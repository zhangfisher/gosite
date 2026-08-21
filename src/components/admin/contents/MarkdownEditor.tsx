"use client";

import { useEffect, useRef, useState } from "react";
import "cherry-markdown/dist/cherry-markdown.css";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function MarkdownEditor({
	content,
	onSave,
}: {
	content: string;
	onSave: (value: string) => Promise<void> | void;
}) {
	const hostRef = useRef<HTMLDivElement>(null);
	const cherryRef = useRef<any>(null);
	// 编辑器当前内容（随用户编辑更新）
	const latestRef = useRef(content);
	// 最近一次载入编辑器的内容（用于识别切换节点）
	const loadedRef = useRef<string | undefined>(undefined);
	// 始终持有最新的 content（避免异步初始化期间节点已切换导致读到旧值）
	const contentRef = useRef(content);
	contentRef.current = content;
	const [saving, setSaving] = useState(false);

	// 初始化 Cherry Markdown（仅客户端，动态 import 避免 SSR 触碰 document）
	useEffect(() => {
		let disposed = false;
		let instance: any;
		(async () => {
			const Cherry = (await import("cherry-markdown")).default;
			if (disposed || !hostRef.current) return;
			const initial = contentRef.current ?? "";
			instance = new Cherry({
				el: hostRef.current,
				value: initial,
				locale: "zh_CN",
				editor: {
					defaultModel: "editOnly",
					height: "100%",
				},
				engine: {
					syntax: {
						table: {
							// 关闭表格 echarts 图表插件（未安装 echarts 依赖）
							enableChart: false,
						},
					},
				},
				onChange: (markdown: string) => {
					latestRef.current = markdown;
				},
			} as any);
			cherryRef.current = instance;
			loadedRef.current = initial;
			latestRef.current = initial;
		})();

		return () => {
			disposed = true;
			try {
				instance?.destroy?.();
			} catch {
				/* ignore */
			}
			cherryRef.current = null;
		};
		// 仅挂载时初始化一次
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 切换节点：外部 content 变化且不同于已载入内容时，重新载入编辑器
	useEffect(() => {
		if (cherryRef.current == null) return;
		if (loadedRef.current === content) return;
		cherryRef.current.setMarkdown(content ?? "", true);
		loadedRef.current = content;
		latestRef.current = content ?? "";
	}, [content]);

	const dirty = latestRef.current !== content;

	async function handleSave() {
		setSaving(true);
		try {
			await onSave(latestRef.current);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<span className="text-sm font-medium">正文内容（Cherry Markdown）</span>
				<Button size="sm" className="h-7" onClick={handleSave} disabled={!dirty || saving}>
					<Save className="h-3.5 w-3.5" />
					{saving ? "保存中" : "保存"}
				</Button>
			</div>
			<div ref={hostRef} className="min-h-0 flex-1 overflow-hidden" />
		</div>
	);
}
