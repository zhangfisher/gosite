import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

export interface WorkspaceOptions {
    /** 内边距 */
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    /** 最大宽度 */
    maxWidth?:
        | "none"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "4xl"
        | "6xl"
        | "7xl";
    /** 是否居中 */
    centered?: boolean;
    /** 是否全屏 */
    fullscreen?: boolean;
    /** 是否自动滚动到顶部（路由切换时） */
    scrollToTop?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 子元素 */
    children: ReactNode;
    /** 左侧聊天面板默认大小（百分比 0-100） */
    leftPanelDefaultSize?: number;
    /** 左侧聊天面板最小大小（像素） */
    leftPanelMinSize?: number;
    /** 左侧聊天面板最大大小（像素） */
    leftPanelMaxSize?: number;
}

/**
 * 工作区布局组件
 *
 * 用于管理和显示应用的主要内容区域，提供统一的布局和样式
 * 使用 react-resizable-panels 将工作区分为左右两个可调整大小的面板
 *
 * @param options 工作区配置选项
 * @returns 工作区容器组件
 *
 * @example
 * // 基础用法
 * <Workspace>
 *     <div>内容</div>
 * </Workspace>
 *
 * @example
 * // 自定义左侧面板大小
 * <Workspace leftPanelDefaultSize={30} leftPanelMinSize={15} leftPanelMaxSize={60}>
 *     <div>内容</div>
 * </Workspace>
 */
export function Workspace({
    padding = "none",
    maxWidth = "none",
    centered = false,
    fullscreen = false,
    scrollToTop = false,
    className,
    children,
}: WorkspaceOptions) {
    const containerRef = useRef<HTMLDivElement>(null);
    // 当 scrollToTop 为 true 时，滚动到顶部
    useEffect(() => {
        if (scrollToTop && containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [scrollToTop]);

    // 内边距映射
    const paddingClasses = {
        none: "",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
    };

    // 最大宽度映射
    const maxWidthClasses = {
        none: "",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "4xl": "max-w-4xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
    };

    // 右侧内容容器样式
    const contentClasses = cn(
        "h-full w-full",
        paddingClasses[padding],
        centered && "mx-auto",
        maxWidthClasses[maxWidth],
        !fullscreen && "overflow-auto",
        className
    );

    return (
        <div ref={containerRef} className={contentClasses}>
            {children}
        </div>
    );
}

/**
 * 预设工作区布局组件
 */

/**
 * 标准工作区（默认样式）
 */
export function StandardWorkspace({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <Workspace padding="md" className={className}>
            {children}
        </Workspace>
    );
}

/**
 * 居中内容工作区（适用于文档、表单等）
 */
export function CenteredWorkspace({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <Workspace padding="lg" centered maxWidth="4xl" className={className}>
            {children}
        </Workspace>
    );
}

/**
 * 全屏工作区（适用于编辑器、数据大屏等）
 */
export function FullscreenWorkspace({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <Workspace fullscreen padding="none" className={className}>
            {children}
        </Workspace>
    );
}

/**
 * 紧凑工作区（适用于列表、表格等）
 */
export function CompactWorkspace({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <Workspace padding="sm" className={className}>
            {children}
        </Workspace>
    );
}
