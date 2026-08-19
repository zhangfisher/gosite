/**
 * AiChatManager
 *
 * 管理基于 `@anthropic-ai/claude-agent-sdk` 的 AI 聊天对话全生命周期：
 * - 维护一个 `conversations` 集合（内存中追踪活跃对话，元信息持久化到数据库）。
 * - 负责启动 / 销毁 / 跟踪单次对话，并通过 claude-agent-sdk 的 `query` 驱动 agent。
 * - 通过 DB 版 {@link DbSessionStore} 将转录落库，以支持 resume。
 * - 将对话元数据（标题 / 预览 / 时间戳 / messageCount / sessionId）持久化到
 *   `conversations` 表，以便前端列表、切换与压缩。
 *
 * 模型 / 凭证仅取自全局配置 `ai`（设置里的 provider），不回退到环境变量。
 */
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import {
	query,
	type Options,
	type SDKMessage,
} from "@anthropic-ai/claude-agent-sdk";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { conversations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import type { AiProviderConfig, AiSettings } from "@/types/settings";
import { DbSessionStore } from "./dbSessionStore";
import type { ChatConversation, ChatRequest } from "./types";

/** 默认系统提示：GoSite 后台 AI 助手 */
const DEFAULT_SYSTEM_PROMPT = `你是 GoSite 建站系统的后台 AI 助手，服务于站点管理员。

你可以帮助管理员：
- 理解与管理多站点、页面、内容与模板；
- 编写、解释与重构代码；
- 规划建站与内容运营任务；
- 回答关于本系统的使用问题。

请用简洁、专业的中文回答。涉及代码时给出可运行的示例。`;

/** 当前活跃对话追踪 */
interface ActiveChat {
	conversationId: string;
	sessionId: string;
	userId: string;
	interrupt: () => void;
	startedAt: number;
	/** 最近一次活动（用户发起或模型输出）时间戳，用于空闲超时销毁 */
	lastActivityAt: number;
}

export class AiChatManager {
	private readonly store = new DbSessionStore();
	private readonly cwd: string;
	private readonly active = new Map<string, ActiveChat>();
	private readonly sweeper?: ReturnType<typeof setInterval>;

	constructor() {
		this.cwd = path.resolve(process.cwd(), "data", "ai-agent");
		fs.mkdirSync(this.cwd, { recursive: true });
		this.sweeper = setInterval(() => {
			void this.sweep();
		}, 60_000);
		// 不让清理定时器阻止进程退出
		if (typeof this.sweeper.unref === "function") this.sweeper.unref();
	}

	// ---- 配置解析 ----

	private async getAiSettings(): Promise<AiSettings | undefined> {
		const settings = await new Settings(ADMIN_USER_ID).load();
		return settings.get("ai");
	}

	/** 仅使用设置里的 provider：查找类型为 anthropic / claude 的已启用提供者 */
	private resolveProvider(ai?: AiSettings): AiProviderConfig {
		const provider = (ai?.providers ?? []).find(
			(p) => p.enabled && (p.provider === "anthropic" || p.provider === "claude"),
		);
		if (!provider || !provider.apiKey) {
			throw new ChatError(
				"NO_PROVIDER",
				"未配置AI大模型API服务，",
			);
		}
		return provider;
	}

	private getConcurrencyLimit(ai?: AiSettings): number {
		const n = ai?.maxConcurrentConversations;
		return n && n > 0 ? n : 5;
	}

	/** 空闲超时时长（毫秒），默认 20 分钟 */
	private getTimeoutMs(ai?: AiSettings): number {
		const min = ai?.conversationTimeoutMin;
		return (min && min > 0 ? min : 20) * 60 * 1000;
	}

	/** 销毁指定的活跃会话（中断 agent 并移除追踪） */
	private destroyActive(id: string) {
		const entry = this.active.get(id);
		if (!entry) return;
		entry.interrupt();
		this.active.delete(id);
	}

	/** 周期性清理空闲超时的活跃会话 */
	private async sweep() {
		const timeoutMs = this.getTimeoutMs(await this.getAiSettings());
		const now = Date.now();
		for (const [id, entry] of this.active) {
			if (now - entry.lastActivityAt > timeoutMs) {
				this.destroyActive(id);
			}
		}
	}

	// ---- 会话元数据 CRUD ----

	async createConversation(
		userId: string,
		title?: string,
		systemPrompt?: string,
	): Promise<ChatConversation> {
		const [created] = await db
			.insert(conversations)
			.values({
				id: randomUUID(),
				userId,
				title: title ?? "新对话",
				systemPrompt: systemPrompt?.trim() || null,
			})
			.returning();
		return created;
	}

	async listConversations(userId: string): Promise<ChatConversation[]> {
		return db
			.select()
			.from(conversations)
			.where(eq(conversations.userId, userId))
			.orderBy(desc(conversations.updatedAt));
	}

	async getConversation(
		id: string,
		userId: string,
	): Promise<ChatConversation | null> {
		const [row] = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, id))
			.limit(1);
		if (!row) return null;
		// 普通用户只能访问自己的会话；管理员可见全部
		if (row.userId !== userId && userId !== ADMIN_USER_ID) return null;
		return row;
	}

	async renameConversation(
		id: string,
		userId: string,
		title: string,
	): Promise<ChatConversation | null> {
		const existing = await this.getConversation(id, userId);
		if (!existing) return null;
		const [updated] = await db
			.update(conversations)
			.set({ title, updatedAt: Date.now() })
			.where(eq(conversations.id, id))
			.returning();
		return updated;
	}

	async deleteConversation(id: string, userId: string): Promise<boolean> {
		const existing = await this.getConversation(id, userId);
		if (!existing) return false;
		// 若正在对话，先中止
		const active = this.active.get(id);
		if (active) active.interrupt();
		this.active.delete(id);
		// 删除转录（resume 数据）
		if (existing.sessionId) {
			await this.store.delete({ projectKey: "", sessionId: existing.sessionId });
		}
		const result = await db
			.delete(conversations)
			.where(eq(conversations.id, id))
			.returning();
		return result.length > 0;
	}

	// ---- 聊天（流式） ----

	/**
	 * 发起一轮聊天，返回 AI SDK UIMessageStream 协议响应。
	 * 整个对话通过 claude-agent-sdk 驱动，结果以文本/推理增量流式下发。
	 */
	async chat(req: ChatRequest, externalSignal?: AbortSignal): Promise<Response> {
		const ai = await this.getAiSettings();

		const stream = createUIMessageStream({
			execute: async ({ writer }) => {
				let provider: AiProviderConfig;
				try {
					provider = this.resolveProvider(ai);
				} catch (e) {
					this.writeError(writer, e);
					writer.write({ type: "finish", finishReason: "stop" });
					return;
				}

				const limit = this.getConcurrencyLimit(ai);
				const conv = await this.ensureConversation(req.conversationId, req.userId);

				if (this.active.size >= limit || this.active.has(conv.id)) {
					writer.write({
						type: "error",
						errorText:
							this.active.has(conv.id)
								? "该对话正在进行中，请等待当前回复完成。"
								: "当前 AI 对话并发已达上限，请稍后再试或等待其他对话结束。",
					});
					writer.write({ type: "finish", finishReason: "stop" });
					return;
				}

				const prevKey = process.env.ANTHROPIC_API_KEY;
				const prevBase = process.env.ANTHROPIC_BASE_URL;
				process.env.ANTHROPIC_API_KEY = provider.apiKey!;
				if (provider.baseURL) process.env.ANTHROPIC_BASE_URL = provider.baseURL;

				try {
					const systemPrompt = buildSystemPrompt(ai?.prompt, conv.systemPrompt);
					const options: Options = {
						model: provider.model,
						cwd: this.cwd,
						systemPrompt,
						permissionMode: "bypassPermissions",
						allowDangerouslySkipPermissions: true,
						settingSources: [],
						sessionStore: this.store,
					};
					if (conv.sessionId) options.resume = conv.sessionId;

				let sessionId = conv.sessionId;
				let assistantText = "";

				const q = query({ prompt: req.prompt, options });
				const interrupt = () => {
					void q.interrupt();
				};
				this.active.set(conv.id, {
					conversationId: conv.id,
					sessionId: conv.sessionId ?? "",
					userId: req.userId,
					interrupt,
					startedAt: Date.now(),
					lastActivityAt: Date.now(),
				});
				externalSignal?.addEventListener("abort", interrupt);

				for await (const msg of q) {
						const live = this.active.get(conv.id);
						if (live) live.lastActivityAt = Date.now();
						if (msg.type === "assistant") {
							const sid = (msg as { session_id?: string }).session_id;
							if (sid) sessionId = sid;
							this.writeAssistantMessage(
								writer,
								msg,
								(t) => {
									assistantText += t;
								},
							);
						} else if (msg.type === "result") {
							const sid = (msg as { session_id?: string }).session_id;
							if (sid) sessionId = sid;
						} else if (msg.type === "system") {
							const sid = (msg as { session_id?: string }).session_id;
							if (sid) sessionId = sid;
						}
					}

					writer.write({ type: "finish", finishReason: "stop" });

					await this.finalizeConversation({
						id: conv.id,
						userId: req.userId,
						sessionId,
						userPrompt: req.prompt,
						assistantPreview: assistantText,
					});
				} catch (err) {
					const message =
						err instanceof Error ? err.message : "聊天过程中发生未知错误";
					writer.write({ type: "error", errorText: message });
					writer.write({ type: "finish", finishReason: "stop" });
				} finally {
					this.active.delete(conv.id);
					if (prevKey !== undefined) process.env.ANTHROPIC_API_KEY = prevKey;
					else delete process.env.ANTHROPIC_API_KEY;
					if (prevBase !== undefined) process.env.ANTHROPIC_BASE_URL = prevBase;
					else delete process.env.ANTHROPIC_BASE_URL;
				}
			},
		});

		return createUIMessageStreamResponse({ stream });
	}

	// ---- 内部工具 ----

	private writeError(
		writer: import("ai").UIMessageStreamWriter,
		e: unknown,
	) {
		const message = e instanceof ChatError ? e.message : e instanceof Error ? e.message : "发生错误";
		writer.write({ type: "error", errorText: message });
	}

	private writeAssistantMessage(
		writer: import("ai").UIMessageStreamWriter,
		msg: SDKMessage,
		onText: (t: string) => void,
	) {
		if (msg.type !== "assistant") return;
		// 每条 assistant 消息分配独立 id，避免 agent 多步回复时
		// reasoning/text 片段因复用同一 id 而被客户端丢弃
		const textId = nanoid();
		const reasoningId = nanoid();
		const content = (msg.message?.content ?? []) as Array<{
			type: string;
			text?: string;
			thinking?: string;
		}>;
		let hasReasoning = false;
		let hasText = false;
		for (const block of content) {
			if (block.type === "thinking" && block.thinking) {
				if (!hasReasoning) {
					writer.write({ type: "reasoning-start", id: reasoningId });
					hasReasoning = true;
				}
				writer.write({
					type: "reasoning-delta",
					id: reasoningId,
					delta: block.thinking,
				});
			} else if (block.type === "text" && block.text) {
				if (!hasText) {
					writer.write({ type: "text-start", id: textId });
					hasText = true;
				}
				writer.write({ type: "text-delta", id: textId, delta: block.text });
				onText(block.text);
			}
		}
		if (hasReasoning) writer.write({ type: "reasoning-end", id: reasoningId });
		if (hasText) writer.write({ type: "text-end", id: textId });
	}

	private async ensureConversation(
		conversationId: string,
		userId: string,
	): Promise<{
		id: string;
		sessionId: string | null;
		userId: string;
		systemPrompt: string | null;
	}> {
		const [row] = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, conversationId))
			.limit(1);
		if (row)
			return {
				id: row.id,
				sessionId: row.sessionId ?? null,
				userId: row.userId,
				systemPrompt: row.systemPrompt ?? null,
			};
		const [created] = await db
			.insert(conversations)
			.values({ id: conversationId, userId, title: "新对话" })
			.returning();
		return {
			id: created.id,
			sessionId: null,
			userId: created.userId,
			systemPrompt: null,
		};
	}

	private async finalizeConversation(args: {
		id: string;
		userId: string;
		sessionId: string | null;
		userPrompt: string;
		assistantPreview: string;
	}): Promise<void> {
		const [row] = await db
			.select()
			.from(conversations)
			.where(eq(conversations.id, args.id))
			.limit(1);
		if (!row) return;

		const messageCount = row.messageCount + 1;
		const title =
			row.messageCount === 0 && args.userPrompt.trim()
				? truncate(args.userPrompt.trim(), 60)
				: row.title;
		const preview =
			args.assistantPreview.trim() || args.userPrompt.trim()
				? truncate((args.assistantPreview || args.userPrompt).trim(), 200)
				: row.preview;

		await db
			.update(conversations)
			.set({
				sessionId: args.sessionId ?? row.sessionId,
				title,
				preview,
				messageCount,
				lastMessageAt: Date.now(),
				updatedAt: Date.now(),
			})
			.where(eq(conversations.id, args.id));
	}

	/** 当前活跃对话数 */
	get activeCount(): number {
		return this.active.size;
	}

	// ---- 工具栏动作：清空 / 压缩 / 读取历史 ----

	/**
	 * 清空对话：删除后端转录（resume 数据）并重置会话元数据，
	 * 使其回到「空对话」状态（下次发言将开启全新 agent 会话）。
	 */
	async clearConversation(id: string, userId: string): Promise<boolean> {
		const existing = await this.getConversation(id, userId);
		if (!existing) return false;
		if (this.active.has(id)) this.active.get(id)!.interrupt();
		this.active.delete(id);
		if (existing.sessionId) {
			await this.store.delete({ projectKey: "", sessionId: existing.sessionId });
		}
		await db
			.update(conversations)
			.set({
				sessionId: null,
				title: "新对话",
				preview: null,
				messageCount: 0,
				lastMessageAt: null,
				updatedAt: Date.now(),
			})
			.where(eq(conversations.id, id));
		return true;
	}

	/**
	 * 压缩对话：用一次「仅总结、不执行工具」的 agent 会话生成本轮对话摘要，
	 * 随后丢弃原始转录并开启新的 agent 会话，将摘要注入系统提示词，
	 * 从而在保留上下文连续性的同时显著减少后续 token 消耗。
	 */
	async compressConversation(
		id: string,
		userId: string,
	): Promise<{ ok: boolean; summary?: string }> {
		const existing = await this.getConversation(id, userId);
		if (!existing || !existing.sessionId) return { ok: false };

		const ai = await this.getAiSettings();
		let provider: AiProviderConfig;
		try {
			provider = this.resolveProvider(ai);
		} catch {
			return { ok: false };
		}

		const prevKey = process.env.ANTHROPIC_API_KEY;
		const prevBase = process.env.ANTHROPIC_BASE_URL;
		process.env.ANTHROPIC_API_KEY = provider.apiKey!;
		if (provider.baseURL) process.env.ANTHROPIC_BASE_URL = provider.baseURL;

		let summary = "";
		try {
			const q = query({
				prompt:
					"请仅用中文输出当前对话的简明要点摘要（用于后续对话的上下文延续），不要调用任何工具、不要读取或写入文件。",
				options: {
					model: provider.model,
					cwd: this.cwd,
					systemPrompt: buildSystemPrompt(ai?.prompt, existing.systemPrompt),
					permissionMode: "bypassPermissions",
					allowDangerouslySkipPermissions: true,
					settingSources: [],
					sessionStore: this.store,
					resume: existing.sessionId,
				},
			});
			for await (const msg of q) {
				if (msg.type === "assistant") {
					for (const block of (msg.message?.content ?? []) as Array<{
						type: string;
						text?: string;
					}>) {
						if (block.type === "text" && block.text) summary += block.text;
					}
				}
			}
		} catch {
			summary = "";
		} finally {
			if (prevKey !== undefined) process.env.ANTHROPIC_API_KEY = prevKey;
			else delete process.env.ANTHROPIC_API_KEY;
			if (prevBase !== undefined) process.env.ANTHROPIC_BASE_URL = prevBase;
			else delete process.env.ANTHROPIC_BASE_URL;
		}

		// 丢弃原始转录，开启新会话，将摘要注入系统提示
		await this.store.delete({ projectKey: "", sessionId: existing.sessionId });
		const injectedPrompt = summary.trim()
			? `${existing.systemPrompt ? existing.systemPrompt + "\n\n" : ""}# 对话历史摘要\n${summary.trim()}`
			: existing.systemPrompt;
		await db
			.update(conversations)
			.set({ sessionId: null, systemPrompt: injectedPrompt || null, updatedAt: Date.now() })
			.where(eq(conversations.id, id));

		return { ok: true, summary: summary.trim() || undefined };
	}

	/**
	 * 读取某会话的可见消息历史（将 DB 中持久化的 agent 转录转换为 UIMessage[]），
	 * 供前端切换对话时回填 Thread。
	 */
	async getMessages(
		id: string,
		userId: string,
	): Promise<Array<{ id: string; role: "user" | "assistant"; parts: Array<{ type: "text"; text: string }> }>> {
		const existing = await this.getConversation(id, userId);
		if (!existing || !existing.sessionId) return [];
		const entries = await this.store.load({
			projectKey: "",
			sessionId: existing.sessionId,
		});
		if (!entries) return [];

		const messages: Array<{
			id: string;
			role: "user" | "assistant";
			parts: Array<{ type: "text"; text: string }>;
		}> = [];

		for (const entry of entries) {
			if (entry.type !== "user" && entry.type !== "assistant") continue;
			const message = (entry as { message?: { content?: unknown } }).message;
			if (!message || !Array.isArray(message.content)) continue;
			const text = (message.content as Array<{ type?: string; text?: string }>)
				.filter((b) => b.type === "text" && typeof b.text === "string")
				.map((b) => b.text as string)
				.join("");
			if (!text) continue;
			messages.push({
				id: entry.uuid ?? `${entry.type}-${messages.length}`,
				role: entry.type,
				parts: [{ type: "text", text }],
			});
		}
		return messages;
	}
}

/** 带错误码的聊天错误 */
class ChatError extends Error {
	code: "NO_PROVIDER" | "CONCURRENCY_LIMIT" | "CONVERSATION_NOT_FOUND" | "AGENT_ERROR";
	constructor(
		code: ChatError["code"],
		message: string,
	) {
		super(message);
		this.code = code;
	}
}

function truncate(text: string, max: number): string {
	return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * 组合最终系统提示词：
 * 1) 内置默认提示（GoSite 后台助手定位）
 * 2) 全局配置 `ai.prompt`（管理员在设置中配置的全局系统提示）
 * 3) 按会话注入的提示（创建对话时指定，优先级最高）
 */
function buildSystemPrompt(
	globalPrompt?: string | null,
	conversationPrompt?: string | null,
): string {
	const parts = [DEFAULT_SYSTEM_PROMPT];
	if (globalPrompt?.trim()) parts.push(globalPrompt.trim());
	if (conversationPrompt?.trim()) parts.push(conversationPrompt.trim());
	return parts.join("\n\n");
}
