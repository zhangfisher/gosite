/**
 * 内容文件管理（基于磁盘，不再写入 contents 表的 images / files 列）
 *
 * 文件统一落盘于 `public/upload/contents/<contentId>/`，对外 URL 为
 * `/upload/contents/<contentId>/<文件名>`。本路由负责列举、删除与重命名。
 */
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { UPLOAD_ROOT } from "@/lib/upload/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

const PREFIX_RE = /^[0-9a-f]{16}__(.+)$/;

function contentDir(id: number): string {
	return path.join(UPLOAD_ROOT, "contents", String(id));
}

function extOf(name: string): string {
	const i = name.lastIndexOf(".");
	return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

/** 校验文件名：禁止路径穿越与非法字符 */
function isValidName(name: string): boolean {
	if (!name) return false;
	if (name.includes("/") || name.includes("\\") || name.includes("..")) return false;
	if (/[<>:"|?*]/.test(name)) return false;
	return true;
}

/** 解析磁盘文件名：去除随机前缀，得到原始展示名 */
function displayNameOf(diskName: string): string {
	const m = PREFIX_RE.exec(diskName);
	return m ? m[1] : diskName;
}

export async function GET(
	_req: Request,
	ctx: { params: Promise<{ id: string }> },
) {
	const id = Number((await ctx.params).id);
	if (!Number.isInteger(id)) {
		return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });
	}

	const dir = contentDir(id);
	let entries: import("node:fs").Dirent[];
	try {
		entries = await fs.readdir(dir, { withFileTypes: true });
	} catch {
		return NextResponse.json({ files: [] });
	}

	const files = [];
	for (const e of entries) {
		if (!e.isFile()) continue;
		const diskName = e.name;
		const stat = await fs.stat(path.join(dir, diskName));
		const display = displayNameOf(diskName);
		const ext = extOf(display);
		files.push({
			name: diskName,
			displayName: display,
			url: `/upload/contents/${id}/${encodeURIComponent(diskName)}`,
			size: stat.size,
			isImage: IMAGE_EXT.has(ext),
			ext,
		});
	}

	files.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
	return NextResponse.json({ files });
}

export async function DELETE(
	req: Request,
	ctx: { params: Promise<{ id: string }> },
) {
	const id = Number((await ctx.params).id);
	if (!Number.isInteger(id)) {
		return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });
	}
	const name = new URL(req.url).searchParams.get("name") ?? "";
	if (!isValidName(name)) {
		return NextResponse.json({ error: "非法的文件名" }, { status: 400 });
	}

	const dir = contentDir(id);
	const target = path.join(dir, name);
	if (path.resolve(target) !== path.join(dir, name)) {
		return NextResponse.json({ error: "非法的文件名" }, { status: 400 });
	}

	try {
		await fs.unlink(target);
	} catch {
		return NextResponse.json({ error: "文件不存在" }, { status: 404 });
	}
	return NextResponse.json({ ok: true });
}

export async function POST(
	req: Request,
	ctx: { params: Promise<{ id: string }> },
) {
	const id = Number((await ctx.params).id);
	if (!Number.isInteger(id)) {
		return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });
	}

	let body: { from?: string; to?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "请求体无效" }, { status: 400 });
	}

	const from = (body.from ?? "").trim();
	const to = (body.to ?? "").trim();
	if (!isValidName(from) || !isValidName(to)) {
		return NextResponse.json({ error: "非法的文件名" }, { status: 400 });
	}

	const dir = contentDir(id);
	const src = path.join(dir, from);
	const dst = path.join(dir, to);
	if (
		path.resolve(src) !== path.join(dir, from) ||
		path.resolve(dst) !== path.join(dir, to)
	) {
		return NextResponse.json({ error: "非法的文件名" }, { status: 400 });
	}

	try {
		await fs.rename(src, dst);
	} catch {
		return NextResponse.json({ error: "重命名失败" }, { status: 400 });
	}
	return NextResponse.json({ ok: true });
}
