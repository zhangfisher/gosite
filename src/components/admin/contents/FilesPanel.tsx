"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Dashboard from "@uppy/react/dashboard";
import "@uppy/react/css/style.css";
import { Button } from "@/components/ui/button";
import { Trash2, List, LayoutGrid, Link2, Image as ImageIcon } from "lucide-react";
import { updateContent } from "./api";
import type { ContentNode } from "./types";
import { cn } from "@/utils/cn";

function basename(url: string): string {
	const parts = url.split("/");
	return decodeURIComponent(parts[parts.length - 1] || url);
}

function parseList(col?: string | null): string[] {
	if (!col) return [];
	return col
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

interface FileEntry {
	url: string;
	name: string;
	isImage: boolean;
}

export function FilesPanel({
	node,
	onChanged,
}: {
	node: ContentNode | null;
	onChanged: () => void;
}) {
	const [uppy] = useState(() => {
		const u = new Uppy({
			autoProceed: false,
			restrictions: { maxNumberOfFiles: 100 },
		});
		u.use(Tus, { endpoint: "/api/upload", chunkSize: Infinity });
		return u;
	});

	const nodeRef = useRef<ContentNode | null>(node);
	useEffect(() => {
		nodeRef.current = node;
	}, [node]);

	useEffect(() => {
		const onFileAdded = (file: any) => {
			const n = nodeRef.current;
			if (!n) return;
			const isImg = /\.(png|jpe?g|gif|webp|svg|bmp|avif|ico)$/i.test(file.name || "");
			uppy.setFileMeta(file.id, {
				contentId: String(n.id),
				path: `contents/${n.id}/${isImg ? "images" : "files"}`,
			});
		};
		const onComplete = () => onChanged();
		uppy.on("file-added", onFileAdded);
		uppy.on("complete", onComplete);
		return () => {
			uppy.off("file-added", onFileAdded);
			uppy.off("complete", onComplete);
		};
	}, [uppy, onChanged]);

	const [view, setView] = useState<"list" | "card">("list");
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const images = useMemo(() => parseList(node?.images), [node?.images]);
	const files = useMemo(() => parseList(node?.files), [node?.files]);
	const allFiles: FileEntry[] = useMemo(
		() => [
			...images.map((u) => ({ url: u, name: basename(u), isImage: true })),
			...files.map((u) => ({ url: u, name: basename(u), isImage: false })),
		],
		[images, files],
	);

	async function persist(imagesStr: string, filesStr: string) {
		if (!node) return;
		await updateContent(node.id, { images: imagesStr || null, files: filesStr || null });
		onChanged();
	}

	function toggleSelect(url: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(url)) next.delete(url);
			else next.add(url);
			return next;
		});
	}

	async function deleteSelected() {
		if (!node || selected.size === 0) return;
		const imgSet = new Set(images.filter((u) => selected.has(u)));
		const fileSet = new Set(files.filter((u) => selected.has(u)));
		const newImages = images.filter((u) => !imgSet.has(u)).join(",");
		const newFiles = files.filter((u) => !fileSet.has(u)).join(",");
		setSelected(new Set());
		await persist(newImages, newFiles);
	}

	async function rename(url: string) {
		const current = basename(url);
		const nextName = window.prompt("重命名为：", current);
		if (!nextName || nextName === current) return;
		const ext = current.includes(".") ? "." + current.split(".").pop() : "";
		const newBase = nextName.endsWith(ext) ? nextName : nextName + ext;
		const prefix = url.slice(0, url.length - current.length);
		const newUrl = prefix + encodeURIComponent(newBase);
		if (images.includes(url)) {
			await persist(
				images.map((u) => (u === url ? newUrl : u)).join(","),
				files.join(","),
			);
		} else {
			await persist(
				images.join(","),
				files.map((u) => (u === url ? newUrl : u)).join(","),
			);
		}
	}

	if (!node) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				请选择左侧内容节点以管理其文件
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<span className="text-sm font-medium">文件（{allFiles.length}）</span>
				<div className="flex items-center gap-2">
					<Button
						variant={view === "list" ? "secondary" : "ghost"}
						size="sm"
						className="h-7 w-7 p-0"
						onClick={() => setView("list")}
						title="列表视图"
					>
						<List className="h-4 w-4" />
					</Button>
					<Button
						variant={view === "card" ? "secondary" : "ghost"}
						size="sm"
						className="h-7 w-7 p-0"
						onClick={() => setView("card")}
						title="卡片视图"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant="destructive"
						size="sm"
						className="h-7 gap-1"
						onClick={deleteSelected}
						disabled={selected.size === 0}
					>
						<Trash2 className="h-3.5 w-3.5" />
						删除选中（{selected.size}）
					</Button>
				</div>
			</div>

			<div className="border-b p-2">
				<Dashboard
					uppy={uppy}
					height={260}
					proudlyDisplayPoweredByUppy={false}
					note="拖拽文件到此处或点击上传，图片进入 images，其它进入 files"
				/>
			</div>

			<div className="min-h-0 flex-1 overflow-auto p-3">
				{allFiles.length === 0 ? (
					<p className="text-sm text-muted-foreground">暂无文件</p>
				) : view === "list" ? (
					<table className="w-full text-sm">
						<tbody>
							{allFiles.map((f) => (
								<tr
									key={f.url}
									className={cn(
										"border-b hover:bg-muted/50",
										selected.has(f.url) && "bg-accent/40",
									)}
								>
									<td className="w-6 py-1.5 pl-1">
										<input
											type="checkbox"
											checked={selected.has(f.url)}
											onChange={() => toggleSelect(f.url)}
										/>
									</td>
									<td className="w-10 py-1.5">
										{f.isImage ? (
											<img
												src={f.url}
												alt={f.name}
												className="h-8 w-8 rounded object-cover"
											/>
										) : (
											<ImageIcon className="h-8 w-8 text-muted-foreground" />
										)}
									</td>
									<td className="truncate py-1.5" title={f.name}>
										{f.name}
									</td>
									<td className="py-1.5 pr-2 text-right">
										<div className="flex justify-end gap-1">
											<a
												href={f.url}
												target="_blank"
												rel="noreferrer"
												className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
												title="打开"
											>
												<Link2 className="h-4 w-4" />
											</a>
											<button
												type="button"
												onClick={() => rename(f.url)}
												className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
												title="重命名"
											>
												✎
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
						{allFiles.map((f) => (
							<div
								key={f.url}
								className={cn(
									"group relative rounded-md border p-2",
									selected.has(f.url) && "ring-2 ring-accent",
								)}
							>
								<input
									type="checkbox"
									className="absolute left-1 top-1 z-10"
									checked={selected.has(f.url)}
									onChange={() => toggleSelect(f.url)}
								/>
								<div className="flex h-20 items-center justify-center overflow-hidden rounded bg-muted/40">
									{f.isImage ? (
										<img
											src={f.url}
											alt={f.name}
											className="h-full w-full object-contain"
										/>
									) : (
										<ImageIcon className="h-8 w-8 text-muted-foreground" />
									)}
								</div>
								<div className="mt-1 flex items-center justify-between gap-1">
									<span className="truncate text-xs" title={f.name}>
										{f.name}
									</span>
									<button
										type="button"
										onClick={() => rename(f.url)}
										className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
										title="重命名"
									>
										✎
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
