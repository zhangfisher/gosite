import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { verification } from "@/db/schema";

const CAPTCHA_TTL = 60 * 5; // 5 分钟

/**
 * 手写 SVG 图片验证码生成器（零依赖）
 *
 * 不依赖任何外部字体/原生模块，避免打包后 __dirname 解析异常（svg-captcha 在
 * Turbopack 下因读取字体文件而崩溃）。生成 5 位易辨识字符 + 干扰线与噪点。
 */
const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor() {
	const c = () => randInt(0, 155);
	return `rgb(${c()},${c()},${c()})`;
}

function generateCaptchaText(len = 5) {
	let s = "";
	for (let i = 0; i < len; i++) s += CAPTCHA_CHARS[randInt(0, CAPTCHA_CHARS.length - 1)];
	return s;
}

function generateCaptchaSvg(text: string) {
	const width = 130;
	const height = 42;
	const chars = [...text]
		.map((ch, i) => {
			const x = 12 + i * ((width - 24) / text.length) + randInt(-3, 3);
			const y = randInt(28, 34);
			const rot = randInt(-25, 25);
			const size = randInt(22, 28);
			return `<text x="${x}" y="${y}" font-family="monospace" font-weight="bold" font-size="${size}" fill="${randColor()}" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
		})
		.join("");
	const lines = Array.from({ length: 4 }, () => {
		const x1 = randInt(0, width);
		const y1 = randInt(0, height);
		const x2 = randInt(0, width);
		const y2 = randInt(0, height);
		return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${randColor()}" stroke-width="1" opacity="0.5"/>`;
	}).join("");
	const dots = Array.from({ length: 30 }, () => {
		return `<circle cx="${randInt(0, width)}" cy="${randInt(0, height)}" r="1" fill="${randColor()}" opacity="0.4"/>`;
	}).join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f2f2f2"/>${lines}${dots}${chars}</svg>`;
}

function createCaptcha() {
	const text = generateCaptchaText(5);
	return { text, svg: generateCaptchaSvg(text) };
}

function normalize(pathname: string, basePath: string) {
	let p = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
	p = p.replace(/\/{2,}/g, "/");
	if (!p.startsWith("/")) p = `/${p}`;
	if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
	return p;
}

function captchaError(message: string) {
	return {
		response: new Response(JSON.stringify({ message, code: message }), {
			status: 400,
			headers: { "content-type": "application/json" },
		}),
	};
}

export interface CaptchaPluginOptions {
	/** 需要强制校验验证码的端点路径（相对于 basePath），默认覆盖登录/注册/找回密码全链路 */
	endpoints?: string[];
}

/**
 * 自建图片验证码插件
 *
 * - GET /api/auth/captcha：生成 SVG 验证码，答案写入 verification 表（identifier: captcha:<token>），返回 { token, svg }
 * - onRequest：对受保护端点从请求头 x-captcha-token / x-captcha-code 读取并校验，失败返回 400
 *
 * 注意：校验读取请求头而非 body，避免消费请求体影响下游解析（与官方 captcha 插件一致）。
 */
export const captchaPlugin = (options?: CaptchaPluginOptions): BetterAuthPlugin => {
	const endpoints = options?.endpoints ?? [
		"/sign-in/email",
		"/sign-in/email-otp",
		"/email-otp/send-verification-otp",
		"/sign-up/email",
		"/email-otp/request-password-reset",
		"/email-otp/reset-password",
	];
	return {
		id: "custom-captcha",
		endpoints: {
			getCaptcha: createAuthEndpoint(
				"/captcha",
				{ method: "GET" } as const,
				async (ctx) => {
					const c = createCaptcha();
					const token = nanoid();
					await db.insert(verification).values({
						id: nanoid(),
						identifier: `captcha:${token}`,
						value: c.text,
						expiresAt: new Date(Date.now() + CAPTCHA_TTL * 1000),
					});
					return ctx.json({ token, svg: c.svg });
				},
			),
		},
		onRequest: async (request: Request, ctx) => {
			const url = new URL(request.url);
			const basePath = ctx.options.basePath ?? "/api/auth";
			const path = normalize(url.pathname, basePath);
			if (!endpoints.includes(path)) return;
			const token = request.headers.get("x-captcha-token");
			const code = request.headers.get("x-captcha-code");
			if (!token || !code) return captchaError("CAPTCHA_REQUIRED");
			const [record] = await db
				.select()
				.from(verification)
				.where(eq(verification.identifier, `captcha:${token}`));
			if (
				!record ||
				record.expiresAt.getTime() < Date.now() ||
				record.value.toLowerCase() !== code.toLowerCase()
			) {
				if (record) {
					await db
						.delete(verification)
						.where(eq(verification.identifier, `captcha:${token}`));
				}
				return captchaError("INVALID_CAPTCHA");
			}
			await db
				.delete(verification)
				.where(eq(verification.identifier, `captcha:${token}`));
			return;
		},
	};
};
