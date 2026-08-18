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
					ai: { providers, defaultModel: defaultModel || undefined },
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
										placeholder="openai / deepseek / ..."
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
