import { route, routeOperation } from "next-rest-framework";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contents, ContentNodeTypes } from "@/db/schema";
import { contentManager } from "@/modules/contens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(req: Request) {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session || session.user.role !== "admin") return null;
	return session;
}

const updateSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(5000).optional().nullable(),
	keywords: z.string().max(2000).optional().nullable(),
	url: z.string().max(2000).optional().nullable(),
	icon: z.string().max(100).optional().nullable(),
	cover: z.string().max(2000).optional().nullable(),
	source: z.string().max(2000).optional().nullable(),
	stars: z.number().int().min(0).max(5).optional().nullable(),
	type: z.nativeEnum(ContentNodeTypes).optional().nullable(),
	tags: z.string().max(2000).optional().nullable(),
	video: z.string().max(4000).optional().nullable(),
	images: z.string().max(8000).optional().nullable(),
	files: z.string().max(8000).optional().nullable(),
	content: z.string().max(500000).optional().nullable(),
	ref: z.number().int().optional().nullable(),
});

export const { GET, PATCH, DELETE } = route({
	getContent: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["Contents"] },
	})
		.outputs([
			{ status: 200, contentType: "application/json", body: z.object({ content: z.any() }) },
			{ status: 401, contentType: "application/json", body: z.object({ error: z.string() }) },
			{ status: 404, contentType: "application/json", body: z.object({ error: z.string() }) },
		])
		.handler(async (req, ctx: { params: Record<string, string> }) => {
			const admin = await requireAdmin(req);
			if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });
			const id = Number(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);
			if (!Number.isInteger(id))
				return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });
			const content = await db.query.contents.findFirst({ where: eq(contents.id, id) });
			if (!content) return NextResponse.json({ error: "内容不存在" }, { status: 404 });
			return NextResponse.json({ content });
		}),

	updateContent: routeOperation({
		method: "PATCH",
		openApiOperation: { tags: ["Contents"] },
	})
		.input({ body: updateSchema, contentType: "application/json" })
		.outputs([
			{ status: 200, contentType: "application/json", body: z.object({ content: z.any() }) },
			{ status: 400, contentType: "application/json", body: z.object({ error: z.string() }) },
			{ status: 401, contentType: "application/json", body: z.object({ error: z.string() }) },
			{ status: 404, contentType: "application/json", body: z.object({ error: z.string() }) },
		])
		.handler(async (req, ctx: { params: Record<string, string> }) => {
			const admin = await requireAdmin(req);
			if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });
			const id = Number(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);
			if (!Number.isInteger(id))
				return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });

			const body = (await req.json()) as Record<string, unknown>;
			const parsed = updateSchema.safeParse(body);
			if (!parsed.success)
				return NextResponse.json(
					{ error: "参数校验失败: " + parsed.error.message },
					{ status: 400 },
				);
			const data = parsed.data;
			if (Object.keys(data).length === 0)
				return NextResponse.json({ error: "无可更新字段" }, { status: 400 });

			const existing = await db.query.contents.findFirst({
				where: eq(contents.id, id),
				columns: { id: true },
			});
			if (!existing) return NextResponse.json({ error: "内容不存在" }, { status: 404 });

			await db
				.update(contents)
				.set({ ...(data as Record<string, unknown>), updatedAt: new Date() } as never)
				.where(eq(contents.id, id));

			const updated = await db.query.contents.findFirst({ where: eq(contents.id, id) });
			return NextResponse.json({ content: updated });
		}),

	deleteContent: routeOperation({
		method: "DELETE",
		openApiOperation: { tags: ["Contents"] },
	})
		.outputs([
			{ status: 200, contentType: "application/json", body: z.object({ ok: z.boolean() }) },
			{ status: 401, contentType: "application/json", body: z.object({ error: z.string() }) },
			{ status: 404, contentType: "application/json", body: z.object({ error: z.string() }) },
		])
		.handler(async (req, ctx: { params: Record<string, string> }) => {
			const admin = await requireAdmin(req);
			if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });
			const id = Number(Array.isArray(ctx.params.id) ? ctx.params.id[0] : ctx.params.id);
			if (!Number.isInteger(id))
				return NextResponse.json({ error: "无效的内容 ID" }, { status: 400 });

			const existing = await db.query.contents.findFirst({
				where: eq(contents.id, id),
				columns: { id: true },
			});
			if (!existing) return NextResponse.json({ error: "内容不存在" }, { status: 404 });

			await contentManager.tree.deleteNode(id);
			return NextResponse.json({ ok: true });
		}),
});
