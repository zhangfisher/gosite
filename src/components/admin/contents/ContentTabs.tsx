"use client";

import { useCallback, useEffect, useState } from "react";
import { getContent, updateContent } from "./api";
import { MarkdownEditor } from "./MarkdownEditor";
import { PropertiesForm } from "./PropertiesForm";
import { FilesPanel } from "./FilesPanel";
import type { ContentNode } from "./types";
import { cn } from "@/utils/cn";
import { FileText, SlidersHorizontal, FolderOpen } from "lucide-react";

type TabKey = "content" | "props" | "files";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
	{ key: "content", label: "内容", icon: <FileText className="h-4 w-4" /> },
	{ key: "props", label: "属性", icon: <SlidersHorizontal className="h-4 w-4" /> },
	{ key: "files", label: "文件", icon: <FolderOpen className="h-4 w-4" /> },
];

export function ContentTabs({
	selectedId,
	onNodeUpdated,
	reloadSignal = 0,
}: {
	selectedId: string | null;
	onNodeUpdated: () => void;
	reloadSignal?: number;
}) {
	const [tab, setTab] = useState<TabKey>("content");
	const [node, setNode] = useState<ContentNode | null>(null);
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		if (!selectedId) {
			setNode(null);
			return;
		}
		setLoading(true);
		try {
			const n = await getContent(selectedId);
			setNode(n);
		} catch {
			setNode(null);
		} finally {
			setLoading(false);
		}
	}, [selectedId]);

	useEffect(() => {
		load();
	}, [load]);

	// 外部刷新信号（如左侧树变更 / 上传完成）→ 重新拉取节点
	useEffect(() => {
		if (reloadSignal > 0) load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reloadSignal]);

	const afterChange = useCallback(
		async (updated?: ContentNode) => {
			if (updated) setNode(updated);
			else await load();
			onNodeUpdated();
		},
		[load, onNodeUpdated],
	);

	async function handleSaveContent(value: string) {
		if (!node) return;
		const updated = await updateContent(node.id, { content: value });
		await afterChange(updated);
	}

	async function handleSaveProps(fields: Partial<ContentNode>) {
		if (!node) return;
		const updated = await updateContent(node.id, fields);
		await afterChange(updated);
	}

	if (!selectedId) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				请从左侧内容树选择一个节点
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center gap-1 border-b px-2">
				{TABS.map((t) => (
					<button
						key={t.key}
						type="button"
						onClick={() => setTab(t.key)}
						className={cn(
							"flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors",
							tab === t.key
								? "border-primary font-medium text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground",
						)}
					>
						{t.icon}
						{t.label}
					</button>
				))}
			</div>
			<div className="min-h-0 flex-1">
				{loading ? (
					<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
						加载中…
					</div>
				) : tab === "content" ? (
					<MarkdownEditor content={node?.content ?? ""} onSave={handleSaveContent} />
				) : tab === "props" ? (
					<PropertiesForm node={node} onSave={handleSaveProps} />
				) : (
					<FilesPanel node={node} onChanged={() => afterChange()} />
				)}
			</div>
		</div>
	);
}
