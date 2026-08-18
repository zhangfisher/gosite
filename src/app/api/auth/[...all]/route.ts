import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth 的 API 端点聚合路由
 *
 * 挂载于 /api/auth/*，处理登录、登出、会话、回调等所有请求。
 */
export const { GET, POST } = toNextJsHandler(auth);
