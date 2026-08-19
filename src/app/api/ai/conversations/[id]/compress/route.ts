import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getAiChatManager } from "@/ai";

async function requireUser(req: Request): Promise<string | null> {
	const session = await auth.api.getSession({ headers: req.headers });
	return session?.user?.id ?? null;
}

export const { POST } = route({
	compressConversation: routeOperation({
		method: "POST",
		openApiOperation: { tags: ["AI"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ ok: z.boolean(), summary: z.string().nullable() }),
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
		])
		.handler(async (req, ctx: { params: { id: string } }) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const { id } = ctx.params;
			const result = await getAiChatManager().compressConversation(id, userId);
			if (!result.ok) {
				return TypedNextResponse.json(
					{ error: "无可压缩的会话内容或缺少 Anthropic 提供者" },
					{ status: 400 },
				);
			}
			return TypedNextResponse.json({ ok: true, summary: result.summary ?? null });
		}),
});
