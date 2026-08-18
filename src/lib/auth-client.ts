import { createAuthClient } from "better-auth/react";
import { username } from "better-auth/plugins";
import { adminClient, emailOTPClient } from "better-auth/client/plugins";

/**
 * Better Auth 客户端实例
 *
 * 用于浏览器侧登录、注册、登出等操作。
 * baseURL 默认同源，无需配置即可工作；如跨域可设置 NEXT_PUBLIC_BETTER_AUTH_URL。
 * emailOTPClient 提供 emailOtp / signIn.emailOtp 等类型化方法。
 */
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
	plugins: [username({ displayUsername: false }), adminClient(), emailOTPClient()],
});

export const { signIn, signUp, signOut } = authClient;
