"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { AdminConfig, AiProviderConfig } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function createProvider(): AiProviderConfig {
	return {
		id: crypto.randomUUID(),
		name: "",
		provider: "openai",
		baseURL: "",
		apiKey: "",
		model: "",
		enabled: true,
	};
}

export function AiSettingsForm({ initial }: { initial: AdminConfig }) {
	const router = useRouter();
	const [saving, setSaving] = React.useState(false);
	const [providers, setProviders] = React.useState<AiProviderConfig[]>(
		initial.ai?.providers?.length
			? initial.ai.providers.map((p) => ({ ...p }))
			: [createProvider()],
	);
	const [defaultModel, setDefaultModel] = React.useState(
		initial.ai?.defaultModel ?? "",
	);
	const [maxConcurrent, setMaxConcurrent] = React.useState<number>(
		initial.ai?.maxConcurrentConversations ?? 5,
	);
	const [timeoutMin, setTimeoutMin] = React.useState<number>(
		initial.ai?.conversationTimeoutMin ?? 20,
	);
	const [globalPrompt, setGlobalPrompt] = React.useState<string>(
		initial.ai?.prompt ?? "",
	);

	function patchProvider(
		id: string,
		patch: Partial<AiProviderConfig>,
	) {
		setProviders((prev) =>
			prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
		);
	}

	function addProvider() {
		setProviders((prev) => [...prev, createProvider()]);
	}

	function removeProvider(id: string) {
		setProviders((prev) => prev.filter((p) => p.id !== id));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					ai: {
						providers,
						defaultModel: defaultModel || undefined,
						prompt: globalPrompt || undefined,
						maxConcurrentConversations: maxConcurrent,
						conversationTimeoutMin: timeoutMin,
					},
				}),
			});
			if (!res.ok) throw new Error("保存失败");
			toast.success("AI 配置已保存");
			router.refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "保存失败");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Card>
			<form onSubmit={handleSubmit}>
				<CardHeader>
					<CardTitle>AI 配置</CardTitle>
					<CardDescription>
						配置 AI 提供者（API Key、模型等）。可添加多个提供者。
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{providers.map((p) => (
						<div
							key={p.id}
							className="grid gap-3 rounded-lg border border-border p-3"
						>
							<div className="flex items-center justify-between">
								<Label>提供者</Label>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => removeProvider(p.id)}
									aria-label="删除提供者"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label htmlFor={`name-${p.id}`}>显示名称</Label>
									<Input
										id={`name-${p.id}`}
										value={p.name}
										onValueChange={(v) =>
											patchProvider(p.id, { name: v })
										}
										placeholder="例如：OpenAI"
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={`provider-${p.id}`}>类型</Label>
									<Input
										id={`provider-${p.id}`}
										value={p.provider}
										onValueChange={(v) =>
											patchProvider(p.id, { provider: v })
										}
										placeholder="openai / deepseek / anthropic"
									/>
								</div>
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor={`baseURL-${p.id}`}>基础地址（可选）</Label>
								<Input
									id={`baseURL-${p.id}`}
									value={p.baseURL ?? ""}
									onValueChange={(v) =>
										patchProvider(p.id, { baseURL: v })
									}
									placeholder="https://api.openai.com/v1"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="grid gap-1.5">
									<Label htmlFor={`apiKey-${p.id}`}>API Key</Label>
									<Input
										id={`apiKey-${p.id}`}
										type="password"
										value={p.apiKey ?? ""}
										onValueChange={(v) =>
											patchProvider(p.id, { apiKey: v })
										}
										placeholder="sk-..."
									/>
								</div>
								<div className="grid gap-1.5">
									<Label htmlFor={`model-${p.id}`}>模型</Label>
									<Input
										id={`model-${p.id}`}
										value={p.model}
										onValueChange={(v) =>
											patchProvider(p.id, { model: v })
										}
										placeholder="gpt-4o"
									/>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor={`enabled-${p.id}`}>启用</Label>
								<Switch
									id={`enabled-${p.id}`}
									checked={p.enabled}
									onCheckedChange={(v) =>
										patchProvider(p.id, { enabled: v })
									}
								/>
							</div>
						</div>
					))}
					<Button
						type="button"
						variant="outline"
						onClick={addProvider}
						className="w-fit"
					>
						<Plus className="size-4" />
						添加提供者
					</Button>
					<div className="grid gap-1.5 border-t border-border pt-4">
						<Label htmlFor="defaultModel">默认模型（可选）</Label>
						<Input
							id="defaultModel"
							value={defaultModel}
							onValueChange={setDefaultModel}
							placeholder="provider/model"
						/>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="globalPrompt">全局系统提示词</Label>
						<Textarea
							id="globalPrompt"
							value={globalPrompt}
							onChange={(e) => setGlobalPrompt(e.target.value)}
							placeholder="作为所有 AI 对话的基础系统提示，例如：你是一位资深的全栈工程师，回答请优先给出可运行代码。"
							rows={4}
						/>
						<p className="text-xs text-muted-foreground">
							该提示会与内置默认提示、以及按会话注入的提示组合，构成最终系统提示。
						</p>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="maxConcurrent">并发对话数量上限</Label>
						<Input
							id="maxConcurrent"
							type="number"
							value={String(maxConcurrent)}
							onValueChange={(v) => {
								const n = Number.parseInt(v, 10);
								if (Number.isFinite(n)) setMaxConcurrent(n);
							}}
							placeholder="5"
						/>
						<p className="text-xs text-muted-foreground">
							AI 助手（claude-agent-sdk）同时进行的最大对话数。
							后台聊天使用类型为 <code>anthropic</code> 的提供者（需配置
							API Key 与 Claude 模型，如 claude-sonnet-4-20250514）。
						</p>
					</div>
					<div className="grid gap-1.5">
						<Label htmlFor="timeoutMin">对话空闲超时（分钟）</Label>
						<Input
							id="timeoutMin"
							type="number"
							value={String(timeoutMin)}
							onValueChange={(v) => {
								const n = Number.parseInt(v, 10);
								if (Number.isFinite(n)) setTimeoutMin(n);
							}}
							placeholder="20"
						/>
						<p className="text-xs text-muted-foreground">
							活跃会话在指定分钟数内无活动（无新消息、也无模型输出）时自动销毁，
							避免长时间占用进程资源。默认 20 分钟。
						</p>
					</div>
				</CardContent>
				<CardFooter className="justify-end">
					<Button type="submit" disabled={saving}>
						{saving ? "保存中…" : "保存配置"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
