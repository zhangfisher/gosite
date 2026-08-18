"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppBus } from "@/eventbus";

/** 从导航 URL 提取模块名，/admin 根路由用 home */
function getModuleName(url: string): string {
  const segment = url.split("/").filter(Boolean).at(-1);
  return segment === "admin" || !segment ? "home" : segment;
}

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

// 垂直菜单项布局：大图标在上、文本在下。
// 折叠态：shadcn 基类强制 size-8! p-2!，需以 py-2! 找回纵向间距、mx-auto 水平居中
export const verticalMenuItemClass =
  "h-auto flex-col justify-center gap-1 py-2 group-data-[collapsible=icon]:py-2! group-data-[collapsible=icon]:mx-auto";

export function MainMenu({ items }: { items: MenuItem[] }) {
  const pathname = usePathname();

  function handleNavigate(targetUrl: string) {
    const currentModule = getModuleName(pathname);
    const targetModule = getModuleName(targetUrl);
    if (currentModule !== targetModule) {
      AppBus.emit(`modules/${currentModule}/leave`, { module: currentModule });
      AppBus.emit(`modules/${targetModule}/enter`, { module: targetModule });
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2 group-data-[collapsible=icon]:gap-5">
        {items.map((item) => {
          const isActive =
            item.url === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title}
                size="lg"
                className={verticalMenuItemClass}
                render={
                  <Link href={item.url} onClick={() => handleNavigate(item.url)}>
                    {item.icon && (
                      <item.icon className="size-7! stroke-[1px] text-gray-500 shrink-0" />
                    )}
                    <span className="text-base text-gray-600 whitespace-nowrap">
                      {item.title}
                    </span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
