import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppInit } from "./app-init";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 根 layout —— 全局共享层
 *
 * 仅承载所有路由（前台 / admin）共需的基础设施：
 * - <html><body> 骨架
 * - Geist 字体变量
 * - 防 FOUC 暗色模式脚本（public/theme-init.js，head 内同步加载）
 *
 * 各区段的 Header / Footer 等差异化外壳，由各自的子 layout 负责：
 * - 前台：app/(site)/layout.tsx
 * - 后台：app/admin/layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        {/* 防 FOUC：外部脚本由服务端注入 head，同步执行（早于首帧绘制）。
            React 19 对内联脚本（children/dangerouslySetInnerHTML）不执行并告警，故用 src 引用 */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <AppInit />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
