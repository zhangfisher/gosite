"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { AdminConfig } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function ServicesSettingsForm({ initial }: { initial: AdminConfig }) {
	const router = useRouter();
	const [saving, setSaving] = React.useState(false);
	const [form, setForm] = React.useState({
		resendApiKey: initial.services?.resend?.apiKey ?? "",
		resendFrom: initial.services?.resend?.from ?? "",
	});

	function update<K extends keyof typeof form>(
		key: K,
		value: (typeof form)[K],
	) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch("/api/admin/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					services: {
						resend: {
							apiKey: form.resendApiKey || undefined,
							from: form.resendFrom || undefined,
						},
					},
				}),
			});
			if (!res.ok) throw new Error("保存失败");
			toast.success("第三方服务配置已保存");
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
					<CardTitle>第三方服务</CardTitle>
					<CardDescription>
						配置外部服务（如邮件服务 Resend）的凭据，供系统发送邮件使用。
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="resendApiKey">Resend API Key</Label>
						<Input
							id="resendApiKey"
							type="password"
							value={form.resendApiKey}
							onValueChange={(v) => update("resendApiKey", v)}
							placeholder="re_..."
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="resendFrom">发件地址（From）</Label>
						<Input
							id="resendFrom"
							value={form.resendFrom}
							onValueChange={(v) => update("resendFrom", v)}
							placeholder="no-reply@yourdomain.com"
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
