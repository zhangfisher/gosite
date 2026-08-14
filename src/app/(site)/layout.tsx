import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * 前台网站 layout
 *
 * 承载前台专属外壳：Header / Footer / 站点级 metadata。
 * 独立于 app/admin/* —— 后台区段使用自己的 app/admin/layout.tsx，
 * 两者互不继承各自的 Header / Footer。
 */
export const metadata: Metadata = {
  title: "Orbitly - 团队协作平台",
  description:
    "从一个仪表板管理整个团队。Orbitly 将您的任务、文档和对话整合到一个工作空间中。",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
