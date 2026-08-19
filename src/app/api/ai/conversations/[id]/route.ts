import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getAiChatManager } from "@/ai";

async function requireUser(req: Request): Promise<string | null> {
	const session = await auth.api.getSession({ headers: req.headers });
	return session?.user?.id ?? null;
}

const patchSchema = z.object({
	title: z.string().min(1).max(200),
});

export const { GET, PATCH, DELETE } = route({
	getConversation: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["AI"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ conversation: z.any() }),
			},
			{
				status: 401,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
			{
				status: 404,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
		])
		.handler(async (req, ctx: { params: { id: string } }) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const { id } = ctx.params;
			const conversation = await getAiChatManager().getConversation(id, userId);
			if (!conversation) {
				return TypedNextResponse.json({ error: "会话不存在" }, { status: 404 });
			}
			return TypedNextResponse.json({ conversation });
		}),

	renameConversation: routeOperation({
		method: "PATCH",
		openApiOperation: { tags: ["AI"] },
	})
		.input({ body: patchSchema, contentType: "application/json" })
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ conversation: z.any() }),
			},
			{
				status: 400,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
			{
				status: 401,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
			{
				status: 404,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
		])
		.handler(async (req, ctx: { params: { id: string } }) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const { id } = ctx.params;
			const data = (await req.json()) as { title: string };
			const updated = await getAiChatManager().renameConversation(
				id,
				userId,
				data.title,
			);
			if (!updated) {
				return TypedNextResponse.json({ error: "会话不存在" }, { status: 404 });
			}
			return TypedNextResponse.json({ conversation: updated });
		}),

	deleteConversation: routeOperation({
		method: "DELETE",
		openApiOperation: { tags: ["AI"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ ok: z.boolean() }),
			},
			{
				status: 401,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
			{
				status: 404,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
		])
		.handler(async (req, ctx: { params: { id: string } }) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const { id } = ctx.params;
			const ok = await getAiChatManager().deleteConversation(id, userId);
			if (!ok) {
				return TypedNextResponse.json({ error: "会话不存在" }, { status: 404 });
			}
			return TypedNextResponse.json({ ok: true });
		}),
});
