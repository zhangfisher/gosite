import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/layout";
import "@/eventbus";

export const metadata: Metadata = {
  title: {
    default: "后台管理",
    template: "%s · 易站后台",
  },
  description: "易站后台管理系统",
};

/**
 * 后台区段 layout
 *
 * 独立的后台外壳 —— 不继承前台 (site) 的 Header / Footer，
 * 而是使用 AdminShell（侧边栏 + 顶栏 + 工作区）。
 * 子路由通过 children 注入到工作区。
 *
 * 服务端会话校验：未登录直接重定向到 /login，
 * 与 proxy.ts 共同构成 /admin 的登录保护（proxy 负责跳转，layout 负责兜底）。
 */
export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login?redirect=/admin");
  }
  // 仅允许 admin 角色访问后台（admin 插件会为 user 注入 role 字段）
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return <AdminShell>{children}</AdminShell>;
}
