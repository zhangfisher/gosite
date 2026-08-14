import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/layout";

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
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
