"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Database,
  GalleryVerticalEnd,
  Globe,
  Home,
  Layout,
  Package,
  Rocket,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

import { MainMenu, verticalMenuItemClass } from "./menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// 导航数据 —— 统一以 contents(内容管理) 为准
const data = {
  navMain: [
    { title: "首页", url: "/admin", icon: Home },
    { title: "网站管理", url: "/admin/websites", icon: Globe },
    { title: "内容管理", url: "/admin/contents", icon: Package },
    { title: "资源管理", url: "/admin/resources", icon: Database },
    { title: "模板", url: "/admin/template", icon: Layout },
    { title: "部署", url: "/admin/deploy", icon: Rocket },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-gray-200 dark:border-gray-700"
      {...props}
    >
      <SidebarHeader>
        {/* 80px 窄栏：仅居中 logo */}
        <div className="flex items-center justify-center px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="h-6 w-6 stroke-[1px]" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <MainMenu items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-2 group-data-[collapsible=icon]:gap-5">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="设置"
              size="lg"
              className={verticalMenuItemClass}
              render={
                <Link href="/admin/settings">
                  <Settings className="size-7! stroke-[1px] text-gray-500 shrink-0" />
                  <span className="text-base text-gray-600 whitespace-nowrap">
                    设置
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
          {/* 展开/折叠切换（底部，低调的图标指示） */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={collapsed ? "展开侧边栏" : "折叠侧边栏"}
              size="lg"
              className={clsx(verticalMenuItemClass)}
              onClick={toggleSidebar}
            >
              <ChevronRight
                className={
                  collapsed
                    ? "size-5! stroke-[1px] text-gray-400 shrink-0"
                    : "size-5! stroke-[1px] text-gray-400 shrink-0 rotate-180"
                }
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
