"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { ContentNode } from "./types";
import type { ContentNodeType } from "@/db/schema/contents";
import { CONTENT_NODE_TYPE_LABELS } from "./types";

type FormState = {
	name: string;
	title: string;
	type: number;
	url: string;
	source: string;
	stars: number;
	tags: string;
	keywords: string;
	description: string;
	video: string;
};

function toForm(n: ContentNode | null): FormState {
	return {
		name: n?.name ?? "",
		title: n?.title ?? "",
		type: n?.type ?? 0,
		url: n?.url ?? "",
		source: n?.source ?? "",
		stars: n?.stars ?? 0,
		tags: n?.tags ?? "",
		keywords: n?.keywords ?? "",
		description: n?.description ?? "",
		video: n?.video ?? "",
	};
}

export function PropertiesForm({
	node,
	onSave,
}: {
	node: ContentNode | null;
	onSave: (fields: Partial<ContentNode>) => Promise<void> | void;
}) {
	const [form, setForm] = useState<FormState>(toForm(node));
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setForm(toForm(node));
	}, [node]);

	function set<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function handleSave() {
		setSaving(true);
		try {
			await onSave({
				name: form.name,
				title: form.title,
				type: Number(form.type) as ContentNodeType,
				url: form.url || null,
				source: form.source || null,
				stars: Number(form.stars),
				tags: form.tags || null,
				keywords: form.keywords || null,
				description: form.description || null,
				video: form.video || null,
			});
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<span className="text-sm font-medium">属性</span>
				<Button size="sm" className="h-7" onClick={handleSave} disabled={saving}>
					<Save className="h-3.5 w-3.5" />
					{saving ? "保存中" : "保存"}
				</Button>
			</div>
			<div className="grid min-h-0 flex-1 gap-4 overflow-auto p-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="p-name">名称 (name)</Label>
					<Input id="p-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-title">标题 (title)</Label>
					<Input id="p-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-type">类型 (type)</Label>
					<select
						id="p-type"
						value={form.type}
						onChange={(e) => set("type", Number(e.target.value))}
						className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						{([0, 1, 2] as const).map((t) => (
							<option key={t} value={t}>
								{CONTENT_NODE_TYPE_LABELS[t]}
							</option>
						))}
					</select>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-stars">星级 (stars)</Label>
					<select
						id="p-stars"
						value={form.stars}
						onChange={(e) => set("stars", Number(e.target.value))}
						className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						{[0, 1, 2, 3, 4, 5].map((s) => (
							<option key={s} value={s}>
								{s} 星
							</option>
						))}
					</select>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-url">链接 (url)</Label>
					<Input id="p-url" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="外链或跳转地址" />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-source">来源 (source)</Label>
					<Input id="p-source" value={form.source} onChange={(e) => set("source", e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-tags">标签 (tags，逗号分隔)</Label>
					<Input id="p-tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="p-keywords">关键词 (keywords)</Label>
					<Input id="p-keywords" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
				</div>
				<div className="space-y-1.5 sm:col-span-2">
					<Label htmlFor="p-desc">描述 (description)</Label>
					<Textarea id="p-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
				</div>
				<div className="space-y-1.5 sm:col-span-2">
					<Label htmlFor="p-video">视频 (video，多个用逗号分隔)</Label>
					<Textarea id="p-video" rows={2} value={form.video} onChange={(e) => set("video", e.target.value)} placeholder="https://... 多个以英文逗号分隔" />
				</div>
			</div>
		</div>
	);
}
