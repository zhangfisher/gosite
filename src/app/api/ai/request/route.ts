import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { getAiRequestAgent } from "@/ai";

export const runtime = "nodejs";

async function requireUser(req: Request): Promise<string | null> {
	const session = await auth.api.getSession({ headers: req.headers });
	return session?.user?.id ?? null;
}

/** 请求体：prompt 必填，async 可选（为 true 时走异步模式） */
const requestSchema = z.object({
	prompt: z.string().min(1).max(20000),
	async: z.boolean().optional(),
});

/** 异步结果条目（pending / done / error 共用同一结构） */
const resultEntrySchema = z.object({
	id: z.string(),
	status: z.string(),
	createdAt: z.number(),
	result: z.string().optional(),
	error: z.string().optional(),
	usage: z.unknown().optional(),
});

/** 同步成功响应 */
const syncSuccessSchema = z.object({
	result: z.string(),
	usage: z.unknown().optional(),
});

/** 异步提交受理响应 */
const asyncAcceptedSchema = z.object({
	requestId: z.string(),
	status: z.string(),
});

export const { GET, POST } = route({
	requestAi: routeOperation({
		method: "POST",
		openApiOperation: {
			tags: ["AI"],
			summary: "发起一次性 AI 请求",
			description:
				"提交一个一次性 AI 请求。默认同步等待并返回结果；当 body.async 为 true 时，立即返回 requestId，结果通过 GET 轮询获取（后台结果默认保留 10 分钟）。",
		},
	})
		.input({ body: requestSchema, contentType: "application/json" })
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: syncSuccessSchema,
			},
			{
				status: 202,
				contentType: "application/json",
				body: asyncAcceptedSchema,
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
				status: 500,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
			{
				status: 502,
				contentType: "application/json",
				body: z.object({ error: z.string(), result: z.string().optional() }),
			},
		])
		.handler(async (req) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}

			const data = (await req.json()) as { prompt: string; async?: boolean };

			const agent = getAiRequestAgent();

			// 异步模式：提交后立即返回 requestId
			if (data.async) {
				const requestId = agent.submit(data.prompt);
				return TypedNextResponse.json(
					{ requestId, status: "pending" },
					{ status: 202 },
				);
			}

			// 同步模式：调用并等待结果
			try {
				const result = await agent.run(data.prompt, req.signal);
				if (result.isError) {
					return TypedNextResponse.json(
						{ error: result.errorText || "AI 处理失败", result: result.result },
						{ status: 502 },
					);
				}
				return TypedNextResponse.json(
					{ result: result.result, usage: result.usage },
					{ status: 200 },
				);
			} catch (err) {
				const message = err instanceof Error ? err.message : "AI 请求失败";
				return TypedNextResponse.json({ error: message }, { status: 500 });
			}
		}),

	getRequestAi: routeOperation({
		method: "GET",
		openApiOperation: {
			tags: ["AI"],
			summary: "查询异步 AI 请求结果",
			description: "通过 requestId 轮询一次性 AI 请求的异步结果（pending / done / error）。",
			parameters: [
				{
					name: "id",
					in: "query",
					required: true,
					description: "异步提交时返回的 requestId",
					schema: { type: "string" },
				},
			],
		},
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: resultEntrySchema,
			},
			{
				status: 202,
				contentType: "application/json",
				body: resultEntrySchema,
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
		.handler(async (req) => {
			const userId = await requireUser(req);
			if (!userId) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}

			const id = req.nextUrl.searchParams.get("id");
			if (!id) {
				return TypedNextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
			}

			const entry = getAiRequestAgent().getResult(id);
			if (!entry) {
				return TypedNextResponse.json(
					{ error: "结果不存在或已过期" },
					{ status: 404 },
				);
			}

			if (entry.status === "pending") {
				return TypedNextResponse.json(entry, { status: 202 });
			}
			return TypedNextResponse.json(entry, { status: 200 });
		}),
});
