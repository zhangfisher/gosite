"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./header";
import { DarkModeToggle } from "./tools";
import { Workspace } from "./workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Search, Settings, Sparkles, LogOut } from "lucide-react";
import { usePanelRef } from "react-resizable-panels";
import { signOut } from "@/lib/auth-client";

/**
 * 后台管理外壳
 *
 * 由 react-router-dom 的 RootLayout(<Outlet/>) 迁移而来：
 * - <Outlet/> → 接收 Next.js 子路由的 children（由 app/admin/layout.tsx 传入）
 * - <Link to> / useNavigate → next/link / useRouter().push
 * - useLocation → usePathname（在子组件内使用）
 *
 * 工具栏保留：搜索、暗黑模式、设置入口。
 * （最小可用阶段移除了 AI 聊天面板与 AppBus 路由事件）
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const rightPanelRef = usePanelRef();
  const [aiOpen, setAiOpen] = useState(true);

  // 工具栏按钮配置
  const tools = [
    <Button
      key="search"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => {
        console.log("搜索功能待实现");
      }}
    >
      <Search className="h-4 w-4" />
    </Button>,
    <Button
      key="ai-panel"
      variant="ghost"
      size="icon"
      className={"h-8 w-8" + (aiOpen ? " bg-accent text-accent-foreground" : "")}
      aria-pressed={aiOpen}
      title="切换 AI 助手面板"
      onClick={() => {
        const panel = rightPanelRef.current;
        if (!panel) return;
        if (panel.isCollapsed()) {
          panel.expand();
          setAiOpen(true);
        } else {
          panel.collapse();
          setAiOpen(false);
        }
      }}
    >
      <Sparkles className="h-4 w-4" />
    </Button>,
    <DarkModeToggle key="dark-mode" />,
    <Button
      key="settings"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => router.push("/admin/settings")}
    >
      <Settings className="h-4 w-4" />
    </Button>,
    <Button
      key="logout"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      title="退出登录"
      onClick={() => {
        signOut().finally(() => router.push("/login"));
      }}
    >
      <LogOut className="h-4 w-4" />
    </Button>,
  ];

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "6rem",
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <AppHeader tools={tools} />
        <Workspace
          rightPanelRef={rightPanelRef}
          onRightPanelCollapseChange={setAiOpen}
          rightPanel={
            <div className="flex h-full flex-col p-4 text-sm text-muted-foreground">
              <div className="mb-2 font-medium text-foreground">AI 助手</div>
              <div className="flex-1 overflow-auto">（占位内容）</div>
            </div>
          }
        >
          {children}
        </Workspace>
      </SidebarInset>
    </SidebarProvider>
  );
}
