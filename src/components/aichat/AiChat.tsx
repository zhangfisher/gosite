"use client";

import * as React from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
	Plus,
	Trash2,
	Shrink,
	MessagesSquare,
	Bot,
} from "lucide-react";
import { toast } from "sonner";

import type { ChatConversation } from "@/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Composer } from "./Composer";
import { Message } from "./Message";

export function AiChat() {
	const [conversations, setConversations] = React.useState<ChatConversation[]>([]);
	const [activeId, setActiveId] = React.useState<string | null>(null);
	const activeIdRef = React.useRef<string | null>(null);
	const [listOpen, setListOpen] = React.useState(false);
	const [newOpen, setNewOpen] = React.useState(false);
	const [newTitle, setNewTitle] = React.useState("");
	const [newPrompt, setNewPrompt] = React.useState("");

	const {
		messages,
		status,
		error,
		sendMessage,
		setMessages,
		stop,
	} = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
			prepareSendMessagesRequest: async ({ messages }) => ({
				body: { conversationId: activeIdRef.current ?? "", messages },
			}),
		}),
	});

	const streaming = status === "submitted" || status === "streaming";
	// 已发送、等待响应：最后一条仍是用户消息且仍在流式中
	const pending =
		streaming &&
		messages.length > 0 &&
		messages[messages.length - 1].role === "user";
	// 发送失败：useChat 抛出 error，且最后一条仍为用户消息（未产生助手回复）
	const failed =
		!!error &&
		messages.length > 0 &&
		messages[messages.length - 1].role === "user";

	const refreshList = React.useCallback(async () => {
		try {
			const res = await fetch("/api/ai/conversations");
			if (!res.ok) return;
			const data = await res.json();
			setConversations(data.conversations ?? []);
		} catch {
			/* ignore */
		}
	}, []);

	React.useEffect(() => {
		refreshList();
	}, [refreshList]);

	// 一轮回复结束后刷新列表（更新标题 / 预览 / 时间）
	React.useEffect(() => {
		if (status === "ready") refreshList();
	}, [status, refreshList]);

	async function loadConversation(id: string) {
		activeIdRef.current = id;
		setActiveId(id);
		try {
			const res = await fetch(`/api/ai/conversations/${id}/messages`);
			const data = await res.json();
			setMessages((data.messages ?? []) as UIMessage[]);
		} catch {
			setMessages([]);
		}
	}

	async function createConversation(
		title?: string,
		systemPrompt?: string,
	): Promise<ChatConversation> {
		const res = await fetch("/api/ai/conversations", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title: title || undefined, systemPrompt: systemPrompt || undefined }),
		});
		if (!res.ok) throw new Error("创建对话失败");
		const data = await res.json();
		return data.conversation as ChatConversation;
	}

	function handleSend(text: string) {
		let id = activeIdRef.current;
		if (!id) {
			createConversation()
				.then((conv) => {
					id = conv.id;
					activeIdRef.current = id;
					setActiveId(id);
					setConversations((prev) => [conv, ...prev]);
					sendMessage({ text });
				})
				.catch(() => toast.error("创建对话失败"));
			return;
		}
		sendMessage({ text });
	}

	async function handleNew() {
		try {
			const conv = await createConversation(newTitle.trim() || undefined, newPrompt.trim() || undefined);
			setConversations((prev) => [conv, ...prev]);
			await loadConversation(conv.id);
			setNewOpen(false);
			setNewTitle("");
			setNewPrompt("");
		} catch {
			toast.error("创建对话失败");
		}
	}

	async function handleClear() {
		if (!activeId) return;
		try {
			await fetch(`/api/ai/conversations/${activeId}/clear`, { method: "POST" });
			setMessages([]);
			refreshList();
			toast.success("对话已清空");
		} catch {
			toast.error("清空失败");
		}
	}

	async function handleCompress() {
		if (!activeId) return;
		try {
			const res = await fetch(`/api/ai/conversations/${activeId}/compress`, {
				method: "POST",
			});
			if (!res.ok) throw new Error();
			toast.success("对话已压缩，上下文摘要已注入系统提示");
			refreshList();
		} catch {
			toast.error("压缩失败（请确认已配置 Anthropic 提供者）");
		}
	}

	async function handleDelete(id: string) {
		try {
			await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
			setConversations((prev) => prev.filter((c) => c.id !== id));
			if (activeId === id) {
				activeIdRef.current = null;
				setActiveId(null);
				setMessages([]);
			}
		} catch {
			toast.error("删除失败");
		}
	}

	const activeTitle = conversations.find((c) => c.id === activeId)?.title;

	return (
		<div className="flex h-full min-h-0 flex-col">
			{/* 顶部标题区 + 工具栏 */}
			<div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
				<div className="flex min-w-0 items-center gap-2">
					<Bot className="size-4 shrink-0 text-muted-foreground" strokeWidth={1} />
					<span className="truncate text-sm font-medium">
						{activeTitle ?? "AI 助手"}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Button
						variant="ghost"
						size="icon-sm"
						title="新建对话（可注入提示词）"
						onClick={() => setNewOpen(true)}
					>
						<Plus className="size-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						title="清空对话"
						disabled={!activeId || streaming}
						onClick={handleClear}
					>
						<Trash2 className="size-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						title="压缩对话（生成上下文摘要）"
						disabled={!activeId || streaming}
						onClick={handleCompress}
					>
						<Shrink className="size-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						title="切换对话"
						aria-pressed={listOpen}
						className={listOpen ? "bg-accent" : ""}
						onClick={() => setListOpen((v) => !v)}
					>
						<MessagesSquare className="size-4" />
					</Button>
				</div>
			</div>

			<div className="flex min-h-0 flex-1">
				{/* 对话列表（切换） */}
				{listOpen && (
					<div className="w-44 shrink-0 overflow-auto border-r border-border p-2">
						{conversations.length === 0 && (
							<p className="px-1 py-2 text-xs text-muted-foreground">
								暂无对话
							</p>
						)}
						{conversations.map((c) => (
							<button
								key={c.id}
								onClick={() => loadConversation(c.id)}
								className={
									"group mb-1 flex w-full items-center justify-between gap-1 rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent " +
									(c.id === activeId ? " bg-accent" : "")
								}
							>
								<span className="min-w-0 flex-1 truncate">
									{c.title || "新对话"}
								</span>
								<span
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(c.id);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.stopPropagation();
											handleDelete(c.id);
										}
									}}
									className="shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
									title="删除对话"
								>
									<Trash2 className="size-3" />
								</span>
							</button>
						))}
					</div>
				)}

				{/* 对话线程 */}
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<div className="min-h-0 flex-1 overflow-auto px-2">
						{messages.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
								<Bot className="size-8" strokeWidth={1} />
								<p>开始与 AI 助手对话。</p>
								<p className="text-xs">
									点击「新建对话」可在创建时注入专属系统提示词。
								</p>
							</div>
						) : (
							messages.map((m, idx) => (
								<Message
									key={m.id}
									message={m}
									pending={pending && idx === messages.length - 1}
									failed={failed && idx === messages.length - 1}
								/>
							))
						)}
						{error && (
							<div className="mx-1 my-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
								出错了：{error.message || "未知错误"}
								{/未配置|提供者|Anthropic|大模型API/i.test(error.message || "") && (
									<Link
										href="/admin/settings/ai"
										className="font-medium underline underline-offset-2"
									>
										点击进行配置
									</Link>
								)}
							</div>
						)}
					</div>
					<Separator />
					<Composer onSend={handleSend} disabled={streaming} />
					{streaming && (
						<div className="px-3 pb-2 text-right">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => stop()}
								className="text-xs"
							>
								停止生成
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* 新建对话（可注入提示词） */}
			<Dialog open={newOpen} onOpenChange={setNewOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>新建对话</DialogTitle>
						<DialogDescription>
							可选：为本次对话注入专属系统提示词（将覆盖全局默认提示）。
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3">
						<div className="grid gap-1.5">
							<Label htmlFor="new-title">标题（可选）</Label>
							<Input
								id="new-title"
								value={newTitle}
								onValueChange={setNewTitle}
								placeholder="如：重构首页组件"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label htmlFor="new-prompt">系统提示词（可选）</Label>
							<Textarea
								id="new-prompt"
								value={newPrompt}
								onChange={(e) => setNewPrompt(e.target.value)}
								placeholder="如：你只回答与 Next.js 相关的问题，并给出可运行示例。"
								rows={4}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setNewOpen(false)}>
							取消
						</Button>
						<Button onClick={handleNew}>创建并开始</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
