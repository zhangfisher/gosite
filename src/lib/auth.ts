import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin, emailOTP } from "better-auth/plugins";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { captchaPlugin } from "@/lib/auth/captcha-plugin";

const sendVerificationOTP = async ({
	email,
	otp,
	type,
}: {
	email: string;
	otp: string;
	type: "sign-in" | "email-verification" | "forget-password" | "change-email";
}) => {
	const map = {
		"sign-in": { subject: "登录验证码", text: `您的登录验证码是 ${otp}，5 分钟内有效。` },
		"forget-password": {
			subject: "重置密码验证码",
			text: `您的重置密码验证码是 ${otp}，5 分钟内有效。`,
		},
		"email-verification": { subject: "邮箱验证码", text: `您的验证码是 ${otp}，5 分钟内有效。` },
		"change-email": { subject: "改绑邮箱验证码", text: `您的验证码是 ${otp}，5 分钟内有效。` },
	} as const;
	const { subject, text } = map[type];
	await sendEmail({ to: email, subject, text });
};

/**
 * Better Auth 服务端实例
 *
 * - 使用 drizzleAdapter 接入现有 SQLite（bun:sqlite）数据库
 * - 启用邮箱 + 密码登录，并支持用户名登录（username 插件）
 * - email-otp 插件：邮箱验证码登录 + 通过 OTP 重置密码（复用 verification 表）
 * - 自建图片验证码插件：在登录 / 注册 / 找回密码端点强制校验（captcha-plugin）
 * - 通过 cookie 管理会话，并在 cookie 层做短期缓存以加速校验
 */
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		usePlural: false,
		schema: { user, session, account, verification },
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username({ displayUsername: false }),
		admin({ defaultRole: "user" }),
		emailOTP({ sendVerificationOTP, disableSignUp: true }),
		captchaPlugin(),
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
});

/**
 * 在服务端（Server Component / Proxy）读取当前会话。
 * 传入的 headers 需为标准的 Headers 实例或 Next.js 的 ReadonlyHeaders。
 */
export async function getSession(headers: Headers) {
	return auth.api.getSession({ headers });
}
