import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";
import { and, desc, eq, like, or, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contents, ContentNodeTypes, type ContentNodeType } from "@/db/schema";
import { contentManager } from "@/modules/contens";
import { FlexNodeRelPosition } from "flextree";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 仅管理员可访问内容管理 API */
async function requireAdmin(req: Request) {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session || session.user.role !== "admin") return null;
	return session;
}

// 可在创建/更新时设置的内容字段（不含树结构字段 left/right/level）
const contentFieldsSchema = z.object({
	name: z.string().min(1).max(200),
	title: z.string().min(1).max(200),
	description: z.string().max(5000).optional().nullable(),
	keywords: z.string().max(2000).optional().nullable(),
	url: z.string().max(2000).optional().nullable(),
	icon: z.string().max(100).optional().nullable(),
	cover: z.string().max(2000).optional().nullable(),
	source: z.string().max(2000).optional().nullable(),
	stars: z.number().int().min(0).max(5).optional().nullable(),
	type: z
		.nativeEnum(ContentNodeTypes)
		.optional()
		.nullable(),
	tags: z.string().max(2000).optional().nullable(),
	video: z.string().max(4000).optional().nullable(),
	images: z.string().max(8000).optional().nullable(),
	files: z.string().max(8000).optional().nullable(),
	content: z.string().max(500000).optional().nullable(),
	ref: z.number().int().optional().nullable(),
});

const listQuerySchema = z.object({
	type: z.string().optional(),
	q: z.string().optional(),
	limit: z.string().optional(),
});

export const { GET, POST } = route({
	getContents: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["Contents"] },
	})
		.input({ query: listQuerySchema })
		.outputs([
			{ status: 200, contentType: "application/json", body: z.object({ contents: z.any() }) },
			{ status: 401, contentType: "application/json", body: z.object({ error: z.string() }) },
		])
		.handler(async (req) => {
			const admin = await requireAdmin(req);
			if (!admin) return TypedNextResponse.json({ error: "未授权" }, { status: 401 });

			const url = new URL(req.url);
			const type = url.searchParams.get("type");
			const q = url.searchParams.get("q");
			const limit = url.searchParams.get("limit");

			const conditions = [];
			if (type !== null && type !== "") conditions.push(eq(contents.type, Number(type) as ContentNodeType));
			if (q) {
				conditions.push(
					or(like(contents.name, `%${q}%`), like(contents.title, `%${q}%`))!,
				);
			}

			const rows = await db
				.select()
				.from(contents)
				.where(conditions.length ? and(...conditions) : undefined)
				.orderBy(desc(contents.updatedAt))
				.limit(limit ? Number(limit) : 200);

			return TypedNextResponse.json({ contents: rows });
		}),

	createContent: routeOperation({
		method: "POST",
		openApiOperation: { tags: ["Contents"] },
	})
		.input({
			body: z
				.object({
					parentId: z.number().int().optional().nullable(),
					pos: z.enum(["firstChild", "lastChild", "nextSibling", "previousSibling"]).optional(),
				})
				.merge(contentFieldsSchema)
				.extend({ name: z.string().min(1), title: z.string().min(1) }),
			contentType: "application/json",
		})
		.outputs([
			{ status: 201, contentType: "application/json", body: z.object({ content: z.any() }) },
			{ status: 400, contentType: "application/json", body: z.object({ error: z.string() }) },
			{ status: 401, contentType: "application/json", body: z.object({ error: z.string() }) },
		])
		.handler(async (req) => {
			const admin = await requireAdmin(req);
			if (!admin) return TypedNextResponse.json({ error: "未授权" }, { status: 401 });

			const body = (await req.json()) as Record<string, unknown>;
			const parsed = contentFieldsSchema
				.merge(
					z.object({
						parentId: z.number().int().optional().nullable(),
						pos: z.enum(["firstChild", "lastChild", "nextSibling", "previousSibling"]).optional(),
					}),
				)
				.safeParse(body);
			if (!parsed.success) {
				return TypedNextResponse.json(
					{ error: "参数校验失败: " + parsed.error.message },
					{ status: 400 },
				);
			}
			const { parentId, pos, ...fields } = parsed.data as Record<string, unknown> & {
				parentId?: number | null;
				pos?: "firstChild" | "lastChild" | "nextSibling" | "previousSibling";
			};

			// 计算新 id（contents 为单树，id 自增）
			const maxRow = await db.select({ m: sql<number>`MAX(${contents.id})` }).from(contents);
			const newId = (maxRow[0]?.m ?? 0) + 1;

			const node: Record<string, unknown> = { id: newId, ...fields };
			const manager = contentManager.tree;

			let at: number | undefined;
			if (parentId != null) {
				at = parentId;
			} else {
				const root = await manager.getRoot?.();
				at = root?.[manager.keyFields.id as "id"];
			}

			const POS_MAP: Record<string, FlexNodeRelPosition> = {
				firstChild: FlexNodeRelPosition.FirstChild,
				lastChild: FlexNodeRelPosition.LastChild,
				nextSibling: FlexNodeRelPosition.NextSibling,
				previousSibling: FlexNodeRelPosition.PreviousSibling,
			};
			const position = pos ? POS_MAP[pos] : FlexNodeRelPosition.LastChild;
			await manager.addNodes([node as never], {
				at: at === undefined ? undefined : at,
				pos: position,
			});

			const created = await db.query.contents.findFirst({
				where: eq(contents.id, newId),
			});
			return TypedNextResponse.json({ content: created }, { status: 201 });
		}),
});
