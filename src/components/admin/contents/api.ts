import type { ContentNode } from "./types";

const TREE_BASE = "/api/contents/tree/contents";

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

/** 将拖拽位置（top/bottom/item）映射为 flextree 的 pos */
export function dragPositionToPos(
	position: "top" | "bottom" | "item",
): MovePos {
	if (position === "top") return "previousSibling";
	if (position === "bottom") return "nextSibling";
	return "lastChild";
}
