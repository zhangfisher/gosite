import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { Settings, ADMIN_USER_ID } from "@/lib/settings";

/**
 * 全局配置读写接口（仅管理员可访问）
 *
 * - GET：返回当前管理员的全局配置（即应用配置）
 * - POST：合并/覆盖部分配置项并持久化
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
});
const servicesSchema = z.object({
	resend: z
		.object({
			apiKey: z.string().optional(),
			from: z.string().optional(),
		})
		.optional(),
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
	})
	.strict();

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return null;
	if (session.user.role !== "admin") return null;
	return session;
}

export async function GET() {
	const session = await requireAdmin();
	if (!session) {
		return NextResponse.json({ error: "未授权" }, { status: 401 });
	}
	const settings = await new Settings(ADMIN_USER_ID).load();
	return NextResponse.json({ settings: settings.all() });
}

export async function POST(request: Request) {
	const session = await requireAdmin();
	if (!session) {
		return NextResponse.json({ error: "未授权" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "请求体无效" }, { status: 400 });
	}

	const parsed = settingsPatchSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "配置校验失败", details: parsed.error.flatten() },
			{ status: 400 },
		);
	}

	const settings = await new Settings(ADMIN_USER_ID).load();
	await settings.save(parsed.data);

	return NextResponse.json({ settings: settings.all() });
}
