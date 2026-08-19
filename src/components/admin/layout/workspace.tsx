import { type ReactNode, useEffect, useRef } from "react";
import type { Ref, RefObject } from "react";
import {
  Group,
  Panel,
  Separator,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import { cn } from "@/utils/cn";

export interface WorkspaceOptions {
  /** 内边距 */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** 最大宽度 */
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl";
  /** 是否居中 */
  centered?: boolean;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 是否自动滚动到顶部（路由切换时） */
  scrollToTop?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 子元素（主内容区） */
  children: ReactNode;
  /** 右侧面板内容（传入后工作区拆分为左右两部分） */
  rightPanel?: ReactNode;
  /** 右侧面板的命令式句柄（用于外部切换折叠/展开） */
	rightPanelRef?: RefObject<PanelImperativeHandle | null>;
  /** 右侧面板折叠状态变化回调（拖拽折叠时同步外部按钮状态） */
  onRightPanelCollapseChange?: (collapsed: boolean) => void;
}

/**
 * 工作区布局组件
 *
 * 用于管理和显示应用的主要内容区域，提供统一的布局和样式
 * 使用 react-resizable-panels 将工作区分为左右两个可调整大小的面板
 *
 * 当传入 `rightPanel` 时，工作区拆分为左右两部分：左侧为主内容，
 * 右侧为默认宽度 300px、可折叠的面板（折叠后宽度为 0）。
 * 未传入 `rightPanel` 时退化为单一内容区域（向后兼容）。
 *
 * @param options 工作区配置选项
 * @returns 工作区容器组件
 *
 * @example
 * // 基础用法（单栏）
 * <Workspace>
 *     <div>内容</div>
 * </Workspace>
 *
 * @example
 * // 双栏：右侧可折叠面板
 * <Workspace rightPanelRef={ref} rightPanel={<Aside />}>
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
  rightPanel,
  rightPanelRef,
  onRightPanelCollapseChange,
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

  // 主内容容器样式
  const contentClasses = cn(
    "h-full w-full overflow-auto workspace",
    paddingClasses[padding],
    centered && "mx-auto",
    maxWidthClasses[maxWidth],
    fullscreen && "overflow-hidden",
    className,
  );

  // 单栏（未传入右侧面板）：保持原有行为
  if (!rightPanel) {
    return (
      <div ref={containerRef} className={cn(contentClasses, "flex-1 min-h-0")}>
        {children}
      </div>
    );
  }

  // 双栏：左侧主内容 + 右侧可折叠面板
  return (
    <div ref={containerRef} className="flex-1 min-h-0 w-full">
      <Group orientation="horizontal" className="h-full w-full">
        <Panel minSize={240}>
          <div className={contentClasses}>{children}</div>
        </Panel>
        <Separator className="relative w-2 bg-transparent">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
          <div className="absolute left-1/2 top-1/2 flex h-8 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-sm border bg-background text-muted-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
            >
              <path d="M9 6H9.01M15 6H15.01M15 12H15.01M9 12H9.01M9 18H9.01M15 18H15.01M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6ZM16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6ZM10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12ZM16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12ZM10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18ZM16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z"></path>
            </svg>
          </div>
        </Separator>
        <Panel
          panelRef={rightPanelRef}
          defaultSize={360}
          collapsible
          collapsedSize={0}
          minSize={100}
          maxSize={600}
          groupResizeBehavior="preserve-pixel-size"
          onResize={(_, __, prevPanelSize) => {
            // 忽略挂载时的首次回调，避免覆盖外部初始高亮状态
            if (prevPanelSize === undefined) return;
            onRightPanelCollapseChange?.(rightPanelRef?.current?.isCollapsed() ?? false);
          }}
          className="min-w-0 overflow-hidden bg-background"
        >
          {rightPanel}
        </Panel>
      </Group>
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
