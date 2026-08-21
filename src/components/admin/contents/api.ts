import type { ContentNode } from "./types";

const TREE_BASE = "/api/contents/tree/contents";

/** 虚拟根节点 id（headless-tree 的 rootItemId，真实树数据挂在它之下） */
export const TREE_ROOT_ID = "__root__";

/**
 * 一次性加载整棵树所需的渲染字段（不含 content 等重型字段）。
 * 选用 list（扁平节点数组）格式：单请求、整树、可按 left/right 重建父子关系，
 * 且服务端按 fields 投影，content 等无关字段不会经网络传输。
 */
const TREE_FIELDS = "id,name,title,type,level,left,right";

/** 由一次性加载得到的整棵树在内存中的索引结构 */
export interface LoadedTree {
	/** id -> 节点渲染数据 */
	byId: Map<string, ContentNode>;
	/** 父 id -> 子 id 列表（父 id 为 TREE_ROOT_ID 表示顶层节点） */
	childrenOf: Map<string, string[]>;
	/** 顶层节点（TREE_ROOT_ID 的直接子节点）id 列表 */
	firstLevel: string[];
}

/**
 * 一次性加载整棵内容树（仅渲染字段）。
 *
 * flextree 的 contents 表采用 Nested Set 模型且无 pid 列，
 * 因此后端返回扁平节点数组后，按 left 升序用栈重建父子关系。
 */
export async function fetchContentTree(): Promise<LoadedTree> {
	const res = await fetch(`${TREE_BASE}/nodes?fields=${TREE_FIELDS}`);
	if (!res.ok) return parseError(res);
	const rows = (await res.json()) as ContentNode[];
	const sorted = [...rows].sort(
		(a, b) => (Number(a.left) || 0) - (Number(b.left) || 0),
	);

	const byId = new Map<string, ContentNode>();
	const childrenOf = new Map<string, string[]>();
	childrenOf.set(TREE_ROOT_ID, []);

	const stack: ContentNode[] = [];
	for (const n of sorted) {
		const nRight = Number(n.right) || 0;
		while (stack.length && (Number(stack[stack.length - 1].right) || 0) < nRight) {
			stack.pop();
		}
		const parentId = stack.length ? String(stack[stack.length - 1].id) : TREE_ROOT_ID;
		if (!childrenOf.has(parentId)) childrenOf.set(parentId, []);
		childrenOf.get(parentId)!.push(String(n.id));
		byId.set(String(n.id), n);
		stack.push(n);
	}

	return { byId, childrenOf, firstLevel: childrenOf.get(TREE_ROOT_ID) ?? [] };
}

async function parseError(res: Response): Promise<never> {
	let msg = `请求失败 (${res.status})`;
	try {
		const body = await res.json();
		if (body?.error) msg = body.error;
	} catch {
		/* ignore */
	}
	throw new Error(msg);
}

/** 获取根节点列表（level=0） */
export async function fetchRoots(): Promise<ContentNode[]> {
	const res = await fetch(`${TREE_BASE}/nodes?level=0`);
	if (!res.ok) return parseError(res);
	return res.json();
}

/** 获取某节点的直接子节点 */
export async function fetchChildren(id: string | number): Promise<ContentNode[]> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}/children`);
	if (!res.ok) return parseError(res);
	return res.json();
}

/** 获取单个节点 */
export async function fetchNode(id: string | number): Promise<ContentNode> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}`);
	if (!res.ok) return parseError(res);
	return res.json();
}

export type MovePos = "lastChild" | "firstChild" | "nextSibling" | "previousSibling";

/** 移动节点 */
export async function moveNode(
	id: string | number,
	to: string | number,
	pos: MovePos,
): Promise<void> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}/move`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ to, pos }),
	});
	if (!res.ok) return parseError(res);
}

/** 复制节点 */
export async function copyNode(
	id: string | number,
	to?: string | number,
	pos?: MovePos,
): Promise<ContentNode> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}/copy`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ to, pos }),
	});
	if (!res.ok) return parseError(res);
	return res.json();
}

export async function moveUp(id: string | number): Promise<void> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}/moveup`, { method: "POST" });
	if (!res.ok) return parseError(res);
}

export async function moveDown(id: string | number): Promise<void> {
	const res = await fetch(`${TREE_BASE}/nodes/${id}/movedown`, { method: "POST" });
	if (!res.ok) return parseError(res);
}

export interface CreateContentInput {
	parentId?: number | null;
	pos?: "firstChild" | "lastChild" | "nextSibling" | "previousSibling";
	name: string;
	title: string;
	description?: string | null;
	keywords?: string | null;
	url?: string | null;
	icon?: string | null;
	cover?: string | null;
	source?: string | null;
	stars?: number | null;
	type?: number | null;
	tags?: string | null;
	video?: string | null;
	content?: string | null;
	ref?: number | null;
}

export async function createContent(input: CreateContentInput): Promise<ContentNode> {
	const res = await fetch(`/api/contents`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});
	if (!res.ok) return parseError(res);
	const data = await res.json();
	return data.content;
}

export async function getContent(id: string | number): Promise<ContentNode> {
	const res = await fetch(`/api/contents/${id}`);
	if (!res.ok) return parseError(res);
	const data = await res.json();
	return data.content;
}

export async function updateContent(
	id: string | number,
	fields: Partial<ContentNode>,
): Promise<ContentNode> {
	const res = await fetch(`/api/contents/${id}`, {
		method: "PATCH",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(fields),
	});
	if (!res.ok) return parseError(res);
	const data = await res.json();
	return data.content;
}

export async function deleteContent(id: string | number): Promise<void> {
	const res = await fetch(`/api/contents/${id}`, { method: "DELETE" });
	if (!res.ok) return parseError(res);
}

// ------------------------------------------------------------------
// 文件（磁盘列举，不再写入 contents 表的 images / files 列）
// ------------------------------------------------------------------

export interface FileItem {
	/** 磁盘上的文件名（含随机前缀） */
	name: string;
	/** 展示用的原始文件名（已去除随机前缀） */
	displayName: string;
	/** 公开可访问的 URL */
	url: string;
	/** 文件大小（字节） */
	size: number;
	/** 是否为图片 */
	isImage: boolean;
	/** 扩展名（不含点，小写） */
	ext: string;
}

/** 列举某内容节点目录下的文件 */
export async function fetchFiles(id: string | number): Promise<FileItem[]> {
	const res = await fetch(`/api/contents/${id}/files`);
	if (!res.ok) return parseError(res);
	const data = await res.json();
	return data.files ?? [];
}

/** 删除文件 */
export async function deleteFile(id: string | number, name: string): Promise<void> {
	const res = await fetch(
		`/api/contents/${id}/files?name=${encodeURIComponent(name)}`,
		{ method: "DELETE" },
	);
	if (!res.ok) return parseError(res);
}

/** 重命名文件 */
export async function renameFile(
	id: string | number,
	from: string,
	to: string,
): Promise<void> {
	const res = await fetch(`/api/contents/${id}/files`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ from, to }),
	});
	if (!res.ok) return parseError(res);
}

/** 将拖拽位置（top/bottom/item）映射为 flextree 的 pos */
export function dragPositionToPos(
	position: "top" | "bottom" | "item",
): MovePos {
	if (position === "top") return "previousSibling";
	if (position === "bottom") return "nextSibling";
	return "lastChild";
}
