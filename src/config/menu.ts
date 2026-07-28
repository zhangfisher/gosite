/**
 * 菜单配置
 *
 * 定义全站导航菜单结构，支持：
 * - 图标（可选）
 * - 链接地址（内部/外部）
 * - 下拉菜单（可选）
 */

import type { LucideIcon } from "lucide-react";
import {
  Home,
  Newspaper,
  Package,
  Lightbulb,
  Wrench,
  Info,
  Cloud,
  Database,
  Shield,
  Zap,
  ChevronRight,
} from "lucide-react";

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** 图标组件（可选） */
  icon?: LucideIcon;
  /** 菜单标题 */
  title: string;
  /** 链接地址 */
  url: string;
  /** 子菜单项（可选，如果有则显示下拉菜单） */
  children?: MenuItem[];
}

/**
 * 主导航菜单配置
 */
export const mainMenuItems: MenuItem[] = [
  {
    icon: Home,
    title: "首页",
    url: "/",
  },
  {
    icon: Newspaper,
    title: "新闻资讯",
    url: "/news",
  },
  {
    icon: Package,
    title: "产品",
    url: "/products",
    children: [
      {
        title: "云服务",
        url: "/products/cloud",
        icon: Cloud,
      },
      {
        title: "数据库",
        url: "/products/database",
        icon: Database,
      },
      {
        title: "安全防护",
        url: "/products/security",
        icon: Shield,
      },
      {
        title: "性能优化",
        url: "/products/performance",
        icon: Zap,
      },
      {
        title: "查看全部产品",
        url: "/products",
        icon: ChevronRight,
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "解决方案",
    url: "/solutions",
    children: [
      {
        title: "企业数字化转型",
        url: "/solutions/digital-transformation",
      },
      {
        title: "智能制造",
        url: "/solutions/smart-manufacturing",
      },
      {
        title: "金融科技",
        url: "/solutions/fintech",
      },
      {
        title: "智慧医疗",
        url: "/solutions/healthcare",
      },
      {
        title: "教育信息化",
        url: "/solutions/education",
      },
      {
        title: "查看全部方案",
        url: "/solutions",
        icon: ChevronRight,
      },
    ],
  },
  {
    icon: Wrench,
    title: "服务",
    url: "/services",
  },
  {
    icon: Info,
    title: "关于",
    url: "/about",
  },
];

/**
 * 移动端导航菜单配置（与主菜单保持一致）
 */
export const mobileMenuItems: MenuItem[] = mainMenuItems;
