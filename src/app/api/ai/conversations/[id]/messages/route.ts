import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getAiChatManager } from "@/ai";

async function requireUser(req: Request): Promise<string | null> {
	const session = await auth.api.getSession({ headers: req.headers });
	return session?.user?.id ?? null;
}

export const { GET } = route({
	getMessages: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["AI"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ messages: z.any() }),
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
			const messages = await getAiChatManager().getMessages(id, userId);
			return TypedNextResponse.json({ messages });
		}),
});
