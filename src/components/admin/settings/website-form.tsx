"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { AdminConfig } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const LOCALE_OPTIONS = [
	{ value: "zh-CN", label: "简体中文 (zh-CN)" },
	{ value: "en-US", label: "English (en-US)" },
];

export function WebsiteSettingsForm({ initial }: { initial: AdminConfig }) {
	const router = useRouter();
	const [saving, setSaving] = React.useState(false);
	const [form, setForm] = React.useState({
		siteName: initial.siteName ?? "",
		siteDescription: initial.siteDescription ?? "",
		defaultLocale: initial.defaultLocale ?? "zh-CN",
		localesText: (initial.locales ?? []).join(", "),
		theme: initial.theme ?? "system",
		maintenanceMode: initial.maintenanceMode ?? false,
	});

	function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		try {
			const locales = form.localesText
				.split(",")
				.map((l) => l.trim())
				.filter(Boolean);

			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					siteName: form.siteName,
					siteDescription: form.siteDescription,
					defaultLocale: form.defaultLocale,
					locales,
					theme: form.theme,
					maintenanceMode: form.maintenanceMode,
				}),
			});
			if (!res.ok) throw new Error("保存失败");
			toast.success("网站配置已保存");
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
					<CardTitle>网站配置</CardTitle>
					<CardDescription>
						站点基础信息、语言与外观等全局设置。
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="siteName">站点名称</Label>
						<Input
							id="siteName"
							value={form.siteName}
							onValueChange={(v) => update("siteName", v)}
							placeholder="GoSite"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="siteDescription">站点描述</Label>
					<Textarea
						id="siteDescription"
						value={form.siteDescription}
						onChange={(e) => update("siteDescription", e.target.value)}
						placeholder="一句话描述你的站点"
						rows={3}
					/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="defaultLocale">默认语言</Label>
						<Select
							value={form.defaultLocale}
							onValueChange={(v) => update("defaultLocale", v ?? "")}
						>
							<SelectTrigger id="defaultLocale" className="w-full">
								<SelectValue placeholder="选择默认语言" />
							</SelectTrigger>
							<SelectContent>
								{LOCALE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="locales">支持的语言（逗号分隔）</Label>
						<Input
							id="locales"
							value={form.localesText}
							onValueChange={(v) => update("localesText", v)}
							placeholder="zh-CN, en-US"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="theme">主题</Label>
						<Select
							value={form.theme}
							onValueChange={(v) =>
								update("theme", v as AdminConfig["theme"])
							}
						>
							<SelectTrigger id="theme" className="w-full">
								<SelectValue placeholder="选择主题" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="light">浅色</SelectItem>
								<SelectItem value="dark">深色</SelectItem>
								<SelectItem value="system">跟随系统</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between rounded-lg border border-border p-3">
						<div className="grid gap-0.5">
							<Label htmlFor="maintenanceMode">维护模式</Label>
							<p className="text-xs text-muted-foreground">
								开启后站点将仅对管理员可见。
							</p>
						</div>
						<Switch
							id="maintenanceMode"
							checked={form.maintenanceMode}
							onCheckedChange={(v) => update("maintenanceMode", v)}
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
