import { EventEmitter } from "node:events";
import { db } from "@/db";
import { contents } from "@/db/schema";
import { getContents } from "@/db/models/Contents";
import { uploadServer, type UploadEvent } from "@/lib/upload/server";
import { eq } from "drizzle-orm";

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

function isImageName(name: string): boolean {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	return IMAGE_EXT.has(ext);
}

/**
 * 内容管理器（全局单例）
 *
 * 负责内容相关的后台功能：
 * - `tree`：基于 flextree 的 contents 表树管理器（单树模式，无 treeId）
 * - 监听 `uploadServer` 的 `upload` 事件：当上传文件携带 `contentId` 元数据时，
 *   按扩展名把文件相对路径（/upload/contents/<id>/...）追加到对应内容的
 *   `images` / `files` 列（逗号分隔），实现"上传即关联"。
 */
class ContentManager extends EventEmitter {
	private _started = false;
	private _tree = getContents(db).treeManager;

	/** 内容树管理器（contents 表，单棵 flextree，全局共享同一实例） */
	get tree() {
		return this._tree;
	}

	/** 应用启动时调用：订阅上传事件 */
	start() {
		if (this._started) return;
		this._started = true;
		uploadServer.on("upload", this.handleUpload);
	}

	private handleUpload = async (event: UploadEvent) => {
		const rawId = event.metadata?.contentId;
		if (rawId == null) return;
		const id = Number(rawId);
		if (!Number.isInteger(id)) return;

		const column = isImageName(event.name) ? "images" : "files";
		const url = event.url;

		const row = await db.query.contents.findFirst({
			where: eq(contents.id, id),
			columns: { images: true, files: true },
		});
		if (!row) return;

		const current = (row[column] ?? "")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (current.includes(url)) return;

		current.push(url);
		await db
			.update(contents)
			.set({ [column]: current.join(","), updatedAt: new Date() } as never)
			.where(eq(contents.id, id));

		this.emit("content-updated", id);
	};
}

export const contentManager = new ContentManager();
export { isImageName };
