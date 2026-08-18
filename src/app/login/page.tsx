import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
	title: "登录",
	description: "后台登录",
};

/**
 * 登录页
 *
 * 独立于前台与后台外壳，使用居中的登录卡片。
 * 未登录访问 /admin 会被 proxy 重定向到本页（携带 redirect 参数）。
 */
export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ redirect?: string }>;
}) {
	const { redirect: redirectTo } = await searchParams;

	return (
		<main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
			<LoginForm redirectTo={redirectTo || "/admin"} />
		</main>
	);
}
