import { route, routeOperation, TypedNextResponse } from "next-rest-framework";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { Settings, ADMIN_USER_ID } from "@/lib/settings";

/**
 * 全局配置读写接口（仅管理员可访问）
 *
 * - GET：返回当前管理员的全局配置（即应用配置）
 * - POST：合并/覆盖部分配置项并持久化
 *
 * 通过 next-rest-framework 暴露，`tags: ["Admin"]` 归入后台配置分组。
 */
const localeSchema = z.string().min(1);
const aiProviderSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	provider: z.string().min(1),
	baseURL: z.string().optional(),
	apiKey: z.string().optional(),
	model: z.string().min(1),
	enabled: z.boolean(),
});
const aiSchema = z.object({
	providers: z.array(aiProviderSchema),
	defaultModel: z.string().optional(),
	prompt: z.string().max(8000).optional(),
	maxConcurrentConversations: z.number().int().min(1).max(50).optional(),
	conversationTimeoutMin: z.number().int().min(1).max(1440).optional(),
});
const servicesSchema = z.object({
	resend: z
		.object({
			apiKey: z.string().optional(),
			from: z.string().optional(),
		})
		.optional(),
});
const uploadSchema = z.object({
	maxFileSizeMB: z.number().int().min(1).max(1024).optional(),
	accept: z.array(z.string()).optional(),
	maxFiles: z.number().int().min(1).max(200).optional(),
});

const settingsPatchSchema = z
	.object({
		siteName: z.string().optional(),
		siteDescription: z.string().optional(),
		defaultLocale: localeSchema.optional(),
		locales: z.array(localeSchema).optional(),
		theme: z.enum(["light", "dark", "system"]).optional(),
		maintenanceMode: z.boolean().optional(),
		ai: aiSchema.optional(),
		services: servicesSchema.optional(),
		upload: uploadSchema.optional(),
	})
	.strict();

async function requireAdmin(req: Request) {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session) return null;
	if (session.user.role !== "admin") return null;
	return session;
}

export const { GET, POST } = route({
	getSettings: routeOperation({
		method: "GET",
		openApiOperation: { tags: ["Admin"] },
	})
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ settings: z.any() }),
			},
			{
				status: 401,
				contentType: "application/json",
				body: z.object({ error: z.string() }),
			},
		])
		.handler(async (req) => {
			const session = await requireAdmin(req);
			if (!session) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const settings = await new Settings(ADMIN_USER_ID).load();
			return TypedNextResponse.json({ settings: settings.all() });
		}),

	updateSettings: routeOperation({
		method: "POST",
		openApiOperation: { tags: ["Admin"] },
	})
		.input({ body: settingsPatchSchema, contentType: "application/json" })
		.outputs([
			{
				status: 200,
				contentType: "application/json",
				body: z.object({ settings: z.any() }),
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
			const session = await requireAdmin(req);
			if (!session) {
				return TypedNextResponse.json({ error: "未授权" }, { status: 401 });
			}
			const body = (await req.json()) as Record<string, unknown>;
			const settings = await new Settings(ADMIN_USER_ID).load();
			await settings.save(body as never);
			return TypedNextResponse.json({ settings: settings.all() });
		}),
});
