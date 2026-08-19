import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getAiChatManager } from "@/ai";

async function requireUser(req: Request): Promise<string | null> {
	const session = await auth.api.getSession({ headers: req.headers });
	return session?.user?.id ?? null;
}

const createSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	systemPrompt: z.string().min(1).max(8000).optional(),
});

export const { GET, POST } = route({
	listConversations: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["AI"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ conversations: z.any() }),
			},
			{
				status: 401,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
		])
		.handler(async (req) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const list = await getAiChatManager().listConversations(userId);
			return TypedNextResponse.json({ conversations: list });
		}),

	createConversation: routeOperation({
		method: "POST",
		openApiOperation: { tags: ["AI"] },
	})
		.input({ body: createSchema, contentType: "application/json" })
		.outputs([
			{
				status: 201,
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
		])
		.handler(async (req) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const data = (await req.json()) as {
				title?: string;
				systemPrompt?: string;
			};
			const conversation = await getAiChatManager().createConversation(
				userId,
				data.title,
				data.systemPrompt,
			);
			return TypedNextResponse.json({ conversation }, { status: 201 });
		}),
});
