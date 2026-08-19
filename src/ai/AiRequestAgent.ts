/**
 * AiRequestAgent
 *
 * 面向「一次性请求 / 一问一答」场景的轻量 AI 代理。
 *
 * 设计要点：
 * - 在应用启动时（见 `src/instrumentation.ts`）预热一个常驻 agent 实例池，
 *   避免每次请求都重新创建 agent（spawn 子进程 + 初始化握手）带来的开销。
 * - 每个实例是一个持久化的 streaming-input `query` 会话，复用同一个 CLI 子进程；
 *   请求到来时从池中取一个空闲实例，串行处理（一次只跑一轮），用完归还。
 * - 每次请求前发送 `/clear` 清空上下文，保证请求之间彼此独立（无记忆），
 *   这与 `AiChatManager`（会持久化对话到数据库）形成对比。
 * - 为追求响应速度，默认关闭所有内置工具（`tools: []`）并禁用会话落盘
 *   （`persistSession: false`），代理只基于自身知识作答、不读写文件 / 执行命令。
 *
 * 模型与凭证仅取自全局配置 `ai`（设置里的 provider），不回退到环境变量。
 */
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import {
	query,
	type Options,
	type Query,
	type SDKMessage,
	type SDKResultMessage,
	type SDKResultSuccess,
	type SDKUserMessage,
} from "@anthropic-ai/claude-agent-sdk";
import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import { nanoid } from "nanoid";
import type { AiProviderConfig, AiSettings } from "@/types/settings";

/** 默认系统提示：一次性请求专用轻量助手（无工具、作答简练） */
const DEFAULT_SYSTEM_PROMPT = `你是一个轻量、响应迅速的 AI 助手，服务于 GoSite 建站系统。
请直接、简洁地回答用户的问题，优先使用中文。
你不读写文件、不执行命令，仅基于自身知识进行回答；如需代码，请给出可运行的示例。`;

/**
 * 组合最终系统提示词（可配置）：
 * 1) 基础提示：环境变量 `AI_REQUEST_SYSTEM_PROMPT` 可覆盖内置默认值；
 * 2) 全局配置 `ai.prompt`（管理员在设置中配置的全局系统提示）作为追加层。
 */
function buildSystemPrompt(globalPrompt?: string | null): string {
	const base = process.env.AI_REQUEST_SYSTEM_PROMPT?.trim() || DEFAULT_SYSTEM_PROMPT;
	const parts = [base];
	if (globalPrompt?.trim()) parts.push(globalPrompt.trim());
	return parts.join("\n\n");
}

/** 常驻实例池大小（环境变量可覆盖，默认 3） */
function poolSize(): number {
	const n = Number(process.env.AI_REQUEST_POOL_SIZE);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 3;
}

/** 单次请求最长等待时间（毫秒，默认 120s） */
function requestTimeoutMs(): number {
	const n = Number(process.env.AI_REQUEST_TIMEOUT_MS);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 120_000;
}

/** 从池中获取空闲实例的最长排队时间（毫秒，默认 60s） */
function acquireTimeoutMs(): number {
	const n = Number(process.env.AI_REQUEST_ACQUIRE_TIMEOUT_MS);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 60_000;
}

/** 异步模式下后台结果保留时长（毫秒，默认 10 分钟） */
function resultTtlMs(): number {
	const n = Number(process.env.AI_REQUEST_RESULT_TTL_MS);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 10 * 60 * 1000;
}

/** 异步提交结果的状态 */
export type AsyncRequestStatus = "pending" | "done" | "error";

/** 异步提交结果条目 */
export interface AsyncRequestEntry {
	id: string;
	status: AsyncRequestStatus;
	createdAt: number;
	result?: string;
	error?: string;
	usage?: unknown;
}

/** 单次请求结果 */
export interface AiRequestResult {
	/** 模型最终文本输出 */
	result: string;
	/** 底层会话 ID */
	sessionId?: string;
	/** 本次请求耗时（毫秒） */
	durationMs?: number;
	/** 是否为错误结果 */
	isError?: boolean;
	/** 错误文本（当 isError 为 true 时） */
	errorText?: string;
	/** token 用量（粗略估计） */
	usage?: unknown;
}

/**
 * 流控输入控制器：持有一个常驻的 AsyncIterable，供 `query` 读取用户消息；
 * 通过 `push` 向其中注入消息（/clear 与用户 prompt），进程退出时 `close`。
 */
function createInputController() {
	const queue: SDKUserMessage[] = [];
	let resolveNext: ((r: IteratorResult<SDKUserMessage>) => void) | null = null;
	let done = false;

	const iterator: AsyncIterable<SDKUserMessage> = {
		[Symbol.asyncIterator]() {
			return {
				next(): Promise<IteratorResult<SDKUserMessage>> {
					if (queue.length) {
						return Promise.resolve({ value: queue.shift()!, done: false });
					}
					if (done) {
						return Promise.resolve({ value: undefined, done: true });
					}
					return new Promise((resolve) => {
						resolveNext = resolve;
					});
				},
				return(): Promise<IteratorResult<SDKUserMessage>> {
					done = true;
					return Promise.resolve({ value: undefined, done: true });
				},
			};
		},
	};

	function push(message: SDKUserMessage) {
		if (done) return;
		if (resolveNext) {
			const r = resolveNext;
			resolveNext = null;
			r({ value: message, done: false });
		} else {
			queue.push(message);
		}
	}

	function close() {
		done = true;
		if (resolveNext) {
			const r = resolveNext;
			resolveNext = null;
			r({ value: undefined, done: true });
		}
	}

	return { iterator, push, close };
}

/** 池中单个常驻 agent 会话 */
class RequestSession {
	readonly id: string;
	private readonly q: Query;
	private readonly input: { push: (m: SDKUserMessage) => void; close: () => void };
	/** 是否正在处理请求（由实例池管理） */
	busy = false;
	private dead = false;
	/** 正在被主动关闭（如 reload），不再触发池中重建 */
	private closing = false;
	private current: {
		uuid: string;
		acc: string;
		resolve: (r: AiRequestResult) => void;
		reject: (e: unknown) => void;
		timer?: ReturnType<typeof setTimeout>;
	} | null = null;

	/** 会话进程结束时回调（用于池中重建） */
	onDeath?: (session: RequestSession) => void;

	constructor(
		id: string,
		options: Options,
		input: ReturnType<typeof createInputController>,
		private readonly abort: AbortController,
	) {
		this.id = id;
		this.input = input;
		this.q = query({ prompt: input.iterator, options });
		void this.consume();
	}

	get isBusy(): boolean {
		return this.busy;
	}

	get isAlive(): boolean {
		return !this.dead;
	}

	/** 是否正在被主动关闭（reload），外部可据此跳过重建 */
	get isClosing(): boolean {
		return this.closing;
	}

	/** 主动关闭本会话（中止底层 query 并闭合输入流） */
	close() {
		if (this.dead) return;
		this.closing = true;
		this.dead = true;
		this.input.close();
		this.abort.abort();
	}

	/** 发起一轮一次性请求，返回模型结果 */
	request(prompt: string, signal?: AbortSignal): Promise<AiRequestResult> {
		if (this.dead) return Promise.reject(new Error("agent 会话已结束"));
		if (signal?.aborted) {
			return Promise.reject(new DOMException("请求已取消", "AbortError"));
		}

		const uuid = randomUUID();
		// 先清空上下文，再发送真正的 prompt（保证请求之间彼此独立）
		this.input.push({
			type: "user",
			message: { role: "user", content: "/clear" },
			parent_tool_use_id: null,
			uuid: randomUUID(),
		});

		return new Promise<AiRequestResult>((resolve, reject) => {
			this.current = {
				uuid,
				acc: "",
				resolve,
				reject,
				timer: setTimeout(() => {
					this.failCurrent(new Error("AI 请求超时"));
				}, requestTimeoutMs()),
			};

			if (signal) {
				signal.addEventListener(
					"abort",
					() => {
						void this.q.interrupt();
						this.failCurrent(new DOMException("请求已取消", "AbortError"));
					},
					{ once: true },
				);
			}

			this.input.push({
				type: "user",
				message: { role: "user", content: prompt },
				parent_tool_use_id: null,
				uuid,
			});
		});
	}

	/** 消费底层 query 输出流 */
	private async consume(): Promise<void> {
		try {
			for await (const msg of this.q) {
				this.handle(msg);
			}
		} catch (err) {
			this.failCurrent(err instanceof Error ? err : new Error("agent 流异常"));
		} finally {
			this.dead = true;
			this.input.close();
			this.failCurrent(new Error("agent 会话已结束"));
			this.onDeath?.(this);
		}
	}

	private handle(msg: SDKMessage) {
		const cur = this.current;
		if (!cur) return;

		if (msg.type === "assistant") {
			const blocks = (msg.message?.content ?? []) as Array<{ type: string; text?: string }>;
			for (const b of blocks) {
				if (b.type === "text" && b.text) cur.acc += b.text;
			}
			return;
		}

		if (msg.type === "result") {
			const r = msg as SDKResultMessage;
			const s = r as SDKResultSuccess;
			// 仅当结果对应当前 prompt（uuid 匹配）时才结束本轮；
			// /clear 那一轮的结果 uuid 不同，会被忽略。
			if (s.user_message_uuid !== cur.uuid) return;
			this.finish({
				result: cur.acc || s.result || "",
				sessionId: s.session_id,
				durationMs: s.duration_ms,
				isError: r.subtype !== "success",
				errorText: r.subtype !== "success" ? s.result : undefined,
				usage: s.usage,
			});
		}
	}

	private finish(result: AiRequestResult) {
		const cur = this.current;
		if (!cur) return;
		if (cur.timer) clearTimeout(cur.timer);
		this.current = null;
		cur.resolve(result);
	}

	private failCurrent(error: unknown) {
		const cur = this.current;
		if (!cur) return;
		if (cur.timer) clearTimeout(cur.timer);
		this.current = null;
		cur.reject(error);
	}
}

/** 未配置 provider 时抛出的错误 */
class NoProviderError extends Error {
	constructor() {
		super("未配置 AI 大模型 API 服务");
	}
}

export class AiRequestAgent {
	private sessions: RequestSession[] = [];
	private readonly waiters: Array<(s: RequestSession) => void> = [];
	private warmed = false;
	/** 异步提交的结果存储（带 TTL，默认 10 分钟） */
	private readonly results = new Map<string, AsyncRequestEntry>();
	private readonly sweeper?: ReturnType<typeof setInterval>;

	constructor() {
		this.sweeper = setInterval(() => this.sweepResults(), 60_000);
		if (typeof this.sweeper.unref === "function") this.sweeper.unref();
	}

	/** 预热实例池（应用启动时调用；若未配置 provider 则跳过，留待首次请求时惰性预热） */
	async warm(): Promise<void> {
		if (this.warmed) return;
		const provider = await this.getProvider();
		if (!provider) return;
		this.warmed = true;
		await this.fill(provider);
	}

	/**
	 * 运行时热更新：关闭当前所有常驻实例，并按最新配置（provider / 系统提示词等）
	 * 重建实例池。无需重启服务即可让新的 AI 配置与提示词生效。
	 * 正在执行的请求会被中断并以错误 reject；新请求将使用新实例。
	 */
	async reload(): Promise<void> {
		const old = this.sessions;
		this.sessions = [];
		this.warmed = false;
		for (const s of old) s.close();
		await this.warm();
	}

	/** 按当前配置补足实例池，并把排队中的请求派发给新实例 */
	private async fill(provider: AiProviderConfig): Promise<void> {
		const ai = await this.getAiSettings();
		while (this.sessions.length < poolSize()) {
			const created = this.createSession(ai, provider);
			this.sessions.push(created);
			if (this.waiters.length) this.release(created);
		}
	}

	/** 执行一次一次性请求 */
	async run(prompt: string, signal?: AbortSignal): Promise<AiRequestResult> {
		await this.warm();
		if (this.sessions.length === 0) {
			throw new NoProviderError();
		}
		let session = await this.acquire();
		try {
			return await session.request(prompt, signal);
		} catch (err) {
			if (session.isAlive) throw err;
			// 实例已死，重建后重试一次
			await this.recreate(session);
			const retry = await this.acquire();
			try {
				return await retry.request(prompt, signal);
			} finally {
				this.release(retry);
			}
		} finally {
			this.release(session);
		}
	}

	/** 当前池内实例数（含繁忙 / 空闲） */
	get poolCount(): number {
		return this.sessions.length;
	}

	/**
	 * 异步提交：立即返回 requestId，请求在后台实例池中执行，
	 * 结果通过 {@link getResult} 轮询获取，默认保留 10 分钟。
	 */
	submit(prompt: string): string {
		const id = nanoid();
		const entry: AsyncRequestEntry = {
			id,
			status: "pending",
			createdAt: Date.now(),
		};
		this.results.set(id, entry);
		void this.run(prompt)
			.then((r) => {
				entry.status = r.isError ? "error" : "done";
				entry.result = r.result;
				entry.usage = r.usage;
				if (r.isError) entry.error = r.errorText;
			})
			.catch((err) => {
				entry.status = "error";
				entry.error = err instanceof Error ? err.message : "处理失败";
			});
		return id;
	}

	/** 按 id 获取异步提交结果；不存在或已过期返回 null */
	getResult(id: string): AsyncRequestEntry | null {
		const entry = this.results.get(id);
		if (!entry) return null;
		if (Date.now() - entry.createdAt > resultTtlMs()) {
			this.results.delete(id);
			return null;
		}
		return entry;
	}

	/** 清理过期的异步结果 */
	private sweepResults() {
		const ttl = resultTtlMs();
		const now = Date.now();
		for (const [id, entry] of this.results) {
			if (now - entry.createdAt > ttl) this.results.delete(id);
		}
	}

	// ---- 内部实现 ----

	private async getAiSettings(): Promise<AiSettings | undefined> {
		const settings = await new Settings(ADMIN_USER_ID).load();
		return settings.get("ai");
	}

	private resolveProvider(ai?: AiSettings): AiProviderConfig {
		const provider = (ai?.providers ?? []).find(
			(p) => p.enabled && (p.provider === "anthropic" || p.provider === "claude") && p.apiKey,
		);
		if (!provider || !provider.apiKey) throw new NoProviderError();
		return provider;
	}

	/** 解析已启用的 anthropic/claude provider，未配置时返回 undefined */
	private async getProvider(): Promise<AiProviderConfig | undefined> {
		try {
			return this.resolveProvider(await this.getAiSettings());
		} catch {
			return undefined;
		}
	}

	private createSession(ai: AiSettings | undefined, provider: AiProviderConfig): RequestSession {
		const cwd = path.resolve(process.cwd(), "data", "ai-request-agent");
		fs.mkdirSync(cwd, { recursive: true });

		const options: Options = {
			model: provider.model,
			cwd,
			systemPrompt: buildSystemPrompt(ai?.prompt),
			permissionMode: "bypassPermissions",
			allowDangerouslySkipPermissions: true,
			settingSources: [],
			persistSession: false,
			tools: [],
			promptSuggestions: false,
			includePartialMessages: false,
			env: {
				...process.env,
				ANTHROPIC_API_KEY: provider.apiKey!,
				...(provider.baseURL ? { ANTHROPIC_BASE_URL: provider.baseURL } : {}),
			},
		};

		const input = createInputController();
		const abort = new AbortController();
		const optionsWithAbort: Options = { ...options, abortController: abort };
		const session = new RequestSession(
			`req-${this.sessions.length}-${randomUUID()}`,
			optionsWithAbort,
			input,
			abort,
		);
		session.onDeath = (s) => {
			if (!s.isClosing) void this.recreate(s);
		};
		return session;
	}

	private async recreate(session: RequestSession): Promise<void> {
		const idx = this.sessions.indexOf(session);
		if (idx !== -1) this.sessions.splice(idx, 1);
		const provider = await this.getProvider();
		if (provider) await this.fill(provider);
	}

	private acquire(): Promise<RequestSession> {
		const free = this.sessions.find((s) => !s.isBusy && s.isAlive);
		if (free) {
			free.busy = true;
			return Promise.resolve(free);
		}
		return new Promise<RequestSession>((resolve, reject) => {
			const timer = setTimeout(() => {
				const i = this.waiters.indexOf(resolve as (s: RequestSession) => void);
				if (i !== -1) this.waiters.splice(i, 1);
				reject(new Error("AI 请求排队超时，服务繁忙"));
			}, acquireTimeoutMs());
			this.waiters.push((s) => {
				clearTimeout(timer);
				resolve(s);
			});
		});
	}

	private release(session: RequestSession) {
		if (!this.sessions.includes(session)) return;
		session.busy = false;
		const waiter = this.waiters.shift();
		if (!waiter) return;
		const free = this.sessions.find((s) => !s.isBusy && s.isAlive) ?? session;
		free.busy = true;
		waiter(free);
	}
}
