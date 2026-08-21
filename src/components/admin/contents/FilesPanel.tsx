"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Button } from "@/components/ui/button";
import {
	Trash2,
	List,
	LayoutGrid,
	Link2,
	Upload,
	File as FileIcon,
	FileText,
	FileImage,
	FileArchive,
	FileCode,
	FileSpreadsheet,
	FileMusic,
	FilePlay,
} from "lucide-react";
import { fetchFiles, deleteFile, renameFile, type FileItem } from "./api";
import type { ContentNode } from "./types";
import { cn } from "@/utils/cn";

const IMAGE_EXT = new Set([
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"svg",
	"bmp",
	"avif",
	"ico",
]);
const VIDEO_EXT = new Set(["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"]);
const AUDIO_EXT = new Set(["mp3", "wav", "ogg", "flac", "aac", "m4a"]);
const ARCHIVE_EXT = new Set(["zip", "rar", "7z", "tar", "gz", "bz2", "xz"]);
const CODE_EXT = new Set([
	"js",
	"ts",
	"jsx",
	"tsx",
	"json",
	"html",
	"css",
	"scss",
	"less",
	"xml",
	"yaml",
	"yml",
	"py",
	"java",
	"go",
	"rs",
	"c",
	"cpp",
	"sh",
	"md",
]);
const SHEET_EXT = new Set(["xls", "xlsx", "csv"]);
const DOC_EXT = new Set([
	"txt",
	"md",
	"doc",
	"docx",
	"pdf",
	"rtf",
	"ppt",
	"pptx",
	"pages",
]);

function fileTypeOf(ext: string): string {
	if (IMAGE_EXT.has(ext)) return "image";
	if (VIDEO_EXT.has(ext)) return "video";
	if (AUDIO_EXT.has(ext)) return "audio";
	if (ARCHIVE_EXT.has(ext)) return "archive";
	if (CODE_EXT.has(ext)) return "code";
	if (SHEET_EXT.has(ext)) return "sheet";
	if (DOC_EXT.has(ext)) return "doc";
	return "other";
}

function FileTypeIcon({
	ext,
	className,
}: {
	ext: string;
	className?: string;
}) {
	switch (fileTypeOf(ext)) {
		case "image":
			return <FileImage className={className} />;
		case "video":
			return <FilePlay className={className} />;
		case "audio":
			return <FileMusic className={className} />;
		case "archive":
			return <FileArchive className={className} />;
		case "code":
			return <FileCode className={className} />;
		case "sheet":
			return <FileSpreadsheet className={className} />;
		case "doc":
			return <FileText className={className} />;
		default:
			return <FileIcon className={className} />;
	}
}

function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function sanitizeName(name: string): string {
	return name.replace(/[^\w.\-一-龥]+/g, "_").replace(/_{2,}/g, "_");
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
			restrictions: { maxNumberOfFiles: 200 },
		});
		u.use(Tus, { endpoint: "/api/upload", chunkSize: Infinity });
		return u;
	});

	const [files, setFiles] = useState<FileItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [view, setView] = useState<"list" | "card">("list");
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const nodeRef = useRef<ContentNode | null>(node);
	useEffect(() => {
		nodeRef.current = node;
	}, [node]);

	const refresh = useCallback(async () => {
		const n = nodeRef.current;
		if (!n) {
			setFiles([]);
			return;
		}
		setLoading(true);
		try {
			const list = await fetchFiles(n.id);
			setFiles(list);
		} catch {
			setFiles([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// 切换节点时重新列举
	useEffect(() => {
		setSelected(new Set());
		refresh();
	}, [node?.id, refresh]);

	// 上传完成 / 出错时刷新列表
	useEffect(() => {
		const onUpload = () => {
			setUploading(false);
			refresh();
			onChanged();
		};
		uppy.on("complete", onUpload);
		uppy.on("upload-success", onUpload);
		return () => {
			uppy.off("complete", onUpload);
			uppy.off("upload-success", onUpload);
		};
	}, [uppy, refresh, onChanged]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	function addFiles(fileList: FileList | File[]) {
		const n = nodeRef.current;
		if (!n) return;
		let addedCount = 0;
		for (const f of Array.from(fileList)) {
			try {
				uppy.addFile({
					name: f.name,
					type: f.type,
					data: f,
					meta: {
						contentId: String(n.id),
						path: `contents/${n.id}`,
						filename: f.name,
						filetype: f.type,
					},
				});
				addedCount++;
			} catch {
				/* 跳过重复文件 */
			}
		}
		if (addedCount === 0) return;

		setUploading(true);

		// 用 Promise 包装整次上传，交给 App.toast 展示进度与成败反馈
		const uploadPromise = new Promise<void>((resolve, reject) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const onComplete = (result: any) => {
				uppy.off("complete", onComplete);
				const failed = result.failed ?? [];
				if (failed.length > 0) {
					const names = failed
						.map((f: { name: string }) => f.name)
						.join("、");
					const firstErr = failed[0]?.error;
					const reason =
						firstErr instanceof Error
							? firstErr.message
							: typeof firstErr === "string"
								? firstErr
								: "不支持的文件类型或上传被拒绝";
					reject(new Error(`${reason}（${names}）`));
				} else {
					resolve();
				}
			};
			uppy.on("complete", onComplete);
			void uppy.upload();
		});

		App.toast(uploadPromise, {
			loading: `正在上传 ${addedCount} 个文件…`,
			success: `成功上传 ${addedCount} 个文件`,
			error: (e: unknown) =>
				e instanceof Error ? e.message : "文件上传失败",
		});
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
	}

	function toggleSelect(name: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(name)) next.delete(name);
			else next.add(name);
			return next;
		});
	}

	async function deleteSelected() {
		const n = nodeRef.current;
		if (!n || selected.size === 0) return;
		for (const name of selected) {
			try {
				await deleteFile(n.id, name);
			} catch {
				/* ignore */
			}
		}
		setSelected(new Set());
		await refresh();
		onChanged();
	}

	async function rename(item: FileItem) {
		const current = item.displayName;
		const next = window.prompt("重命名为：", current);
		if (!next || next === current) return;
		const ext = current.includes(".") ? "." + current.split(".").pop() : "";
		const newDisplay = next.endsWith(ext) ? next : next + ext;
		const prefix = item.name.includes("__")
			? item.name.slice(0, item.name.indexOf("__") + 2)
			: "";
		const to = prefix + sanitizeName(newDisplay);
		try {
			await renameFile(node!.id, item.name, to);
			await refresh();
			onChanged();
		} catch (e) {
			window.alert((e as Error).message);
		}
	}

	if (!node) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
				请选择左侧内容节点以管理其文件
			</div>
		);
	}

	const empty = files.length === 0;

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex items-center justify-between border-b px-3 py-2">
				<span className="text-sm font-medium">
					文件（{files.length}）
					{uploading && (
						<span className="ml-2 text-xs text-muted-foreground">上传中…</span>
					)}
				</span>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="h-7 gap-1"
						onClick={() => fileInputRef.current?.click()}
						title="选择文件上传"
					>
						<Upload className="h-3.5 w-3.5" />
						上传
					</Button>
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

			<input
				ref={fileInputRef}
				type="file"
				multiple
				hidden
				onChange={(e) => {
					if (e.target.files?.length) addFiles(e.target.files);
					e.target.value = "";
				}}
			/>

			<div
				className={cn(
					"min-h-0 flex-1 overflow-auto p-3 transition-colors",
					dragActive && "bg-accent/30 ring-2 ring-inset ring-primary/40",
				)}
				onDragOver={(e) => {
					e.preventDefault();
					setDragActive(true);
				}}
				onDragLeave={() => setDragActive(false)}
				onDrop={handleDrop}
			>
				{loading ? (
					<p className="text-sm text-muted-foreground">加载中…</p>
				) : empty ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
						<Upload className="h-8 w-8" />
						<p>将文件拖拽到此处即可上传</p>
						<p className="text-xs">图片 / 文档 / 压缩包等均可，按扩展名自动识别图标</p>
					</div>
				) : view === "list" ? (
					<table className="w-full text-sm">
						<tbody>
							{files.map((f) => (
								<tr
									key={f.name}
									className={cn(
										"border-b hover:bg-muted/50",
										selected.has(f.name) && "bg-accent/40",
									)}
								>
									<td className="w-6 py-1.5 pl-1">
										<input
											type="checkbox"
											checked={selected.has(f.name)}
											onChange={() => toggleSelect(f.name)}
										/>
									</td>
									<td className="w-10 py-1.5">
										{f.isImage ? (
											<img
												src={f.url}
												alt={f.displayName}
												className="h-8 w-8 rounded object-cover"
											/>
										) : (
											<FileTypeIcon
												ext={f.ext}
												className="h-8 w-8 text-muted-foreground"
											/>
										)}
									</td>
									<td className="truncate py-1.5" title={f.displayName}>
										{f.displayName}
									</td>
									<td className="whitespace-nowrap py-1.5 pr-2 text-xs text-muted-foreground">
										{formatSize(f.size)}
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
												onClick={() => rename(f)}
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
						{files.map((f) => (
							<div
								key={f.name}
								className={cn(
									"group relative rounded-md border p-2",
									selected.has(f.name) && "ring-2 ring-accent",
								)}
							>
								<input
									type="checkbox"
									className="absolute left-1 top-1 z-10"
									checked={selected.has(f.name)}
									onChange={() => toggleSelect(f.name)}
								/>
								<div className="flex h-20 items-center justify-center overflow-hidden rounded bg-muted/40">
									{f.isImage ? (
										<img
											src={f.url}
											alt={f.displayName}
											className="h-full w-full object-contain"
										/>
									) : (
										<FileTypeIcon
											ext={f.ext}
											className="h-10 w-10 text-muted-foreground"
										/>
									)}
								</div>
								<div className="mt-1 flex items-center justify-between gap-1">
									<span className="truncate text-xs" title={f.displayName}>
										{f.displayName}
									</span>
									<button
										type="button"
										onClick={() => rename(f)}
										className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
										title="重命名"
									>
										✎
									</button>
								</div>
								<div className="text-[10px] text-muted-foreground">
									{formatSize(f.size)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
