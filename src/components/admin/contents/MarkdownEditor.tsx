"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Save, Eye, Pencil } from "lucide-react";

export function MarkdownEditor({
	content,
	onSave,
}: {
	content: string;
	onSave: (value: string) => Promise<void> | void;
}) {
	const [value, setValue] = useState(content);
	const [preview, setPreview] = useState(false);
	const [saving, setSaving] = useState(false);
	const dirty = value !== content;

	useEffect(() => {
		setValue(content);
	}, [content]);

	async function handleSave() {
		setSaving(true);
		try {
			await onSave(value);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<span className="text-sm font-medium">正文内容（Markdown）</span>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setPreview((p) => !p)}
						className="h-7 gap-1"
					>
						{preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
						{preview ? "编辑" : "预览"}
					</Button>
					<Button size="sm" className="h-7" onClick={handleSave} disabled={!dirty || saving}>
						<Save className="h-3.5 w-3.5" />
						{saving ? "保存中" : "保存"}
					</Button>
				</div>
			</div>
			<div className="flex min-h-0 flex-1">
				{!preview && (
					<textarea
						value={value}
						onChange={(e) => setValue(e.target.value)}
						spellCheck={false}
						className="h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-sm outline-none"
						placeholder="在此输入 Markdown 内容…"
					/>
				)}
				{preview && (
					<div className="prose prose-sm dark:prose-invert h-full w-full overflow-auto p-4">
						{value.trim() ? (
							<Markdown>{value}</Markdown>
						) : (
							<p className="text-muted-foreground">暂无内容</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
