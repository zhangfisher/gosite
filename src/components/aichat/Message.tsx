"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Loader2, CircleAlert } from "lucide-react";
import type { UIMessage } from "ai";
import { cn } from "@/utils/cn";

function isTextPart(p: unknown): p is { type: "text"; text: string } {
	return (
		typeof p === "object" &&
		p !== null &&
		(p as { type?: string }).type === "text" &&
		typeof (p as { text?: unknown }).text === "string"
	);
}

function getReasoning(p: unknown): string {
	if (
		typeof p === "object" &&
		p !== null &&
		(p as { type?: string }).type === "reasoning"
	) {
		const text = (p as { text?: unknown }).text;
		return typeof text === "string" ? text : "";
	}
	return "";
}

export function Message({
	message,
	pending = false,
	failed = false,
}: {
	message: UIMessage;
	/** 是否为「已发送、等待响应」的最后一条用户消息 */
	pending?: boolean;
	/** 是否为「发送失败」的最后一条用户消息 */
	failed?: boolean;
}) {
	const isUser = message.role === "user";
	const reasoning = message.parts.map(getReasoning).filter(Boolean).join("\n");
	const text = message.parts.filter(isTextPart).map((p) => p.text).join("");

	const indicator =
		isUser && (pending || failed) ? (
			pending ? (
				<Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
			) : (
				<CircleAlert className="size-4 shrink-0 text-destructive" />
			)
		) : null;

	return (
		<div className={cn("flex gap-3 px-1 py-3", isUser && "flex-row-reverse")}>
			<div
				className={cn(
					"flex size-8 shrink-0 items-center justify-center rounded-full border border-border",
					isUser ? "bg-accent" : "bg-primary/10",
				)}
			>
				{isUser ? (
					<User className="size-4" strokeWidth={1} />
				) : (
					<Bot className="size-4" strokeWidth={1} />
				)}
			</div>
			<div
				className={cn(
					"min-w-0 flex-1 space-y-2",
					isUser ? "text-right" : "text-left",
				)}
			>
				{reasoning && (
					<details className="group rounded-md border border-border bg-muted/40 text-left text-xs">
						<summary className="cursor-pointer px-2 py-1 text-muted-foreground">
							思考过程
						</summary>
						<pre className="max-h-60 overflow-auto whitespace-pre-wrap px-2 pb-2 text-muted-foreground">
							{reasoning}
						</pre>
					</details>
				)}
				{text && (
					isUser ? (
						<div className="inline-flex max-w-full items-center gap-2">
							{indicator}
							<div className="min-w-0 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
								<div className="whitespace-pre-wrap break-words text-left">
									{text}
								</div>
							</div>
						</div>
					) : (
						<div className="inline-block max-w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
							<div className="prose prose-sm dark:prose-invert max-w-none break-words text-left">
								<ReactMarkdown remarkPlugins={[remarkGfm]}>
									{text}
								</ReactMarkdown>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
}
