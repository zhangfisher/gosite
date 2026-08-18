import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Proxy（替代旧版 middleware）
 *
 * 仅对 /admin 区段做登录校验：
 * - 未登录访问 /admin/* → 重定向到 /login（携带 redirect 参数）
 * - 已登录访问 /login → 重定向回 /admin
 * 其余路由（含前台、/api、静态资源）不受认证限制，允许匿名访问。
 *
 * 此处仅做“乐观校验”：检查 better-auth 的会话 Cookie 是否存在，
 * 不访问数据库，以保证 proxy 在 Node 运行时下也能运行。
 * 真正的数据库级会话校验由 app/admin/layout.tsx 中的服务端代码负责。
 */
const LOGIN_PATH = "/login";
const ADMIN_PREFIX = "/admin";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);

	// 乐观校验：仅判断会话 Cookie 是否存在（无 DB 依赖）
	const sessionCookie = getSessionCookie(request);

	if (isAdminRoute && !sessionCookie) {
		const loginUrl = new URL(LOGIN_PATH, request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (pathname === LOGIN_PATH && sessionCookie) {
		return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
	}

	return NextResponse.next();
}

export const config = {
	// 排除 API、静态资源与主题脚本，避免误拦截
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|theme-init.js).*)",
	],
};
