import { db } from "@/db";
import { getContents } from "@/db/models/Contents";

/**
 * 内容管理器（全局单例）
 *
 * 负责内容相关的后台功能：
 * - `tree`：基于 flextree 的 contents 表树管理器（单树模式，无 treeId）
 *
 * 文件上传不再写入 contents 表的 `images` / `files` 列，
 * 而是直接落盘到 `public/upload/contents/<contentId>/`，
 * 由文件接口按需列举磁盘内容。
 */
class ContentManager {
	private _tree = getContents(db).treeManager;

	/** 内容树管理器（contents 表，单棵 flextree，全局共享同一实例） */
	get tree() {
		return this._tree;
	}
}

export const contentManager = new ContentManager();
