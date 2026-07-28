"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface SiteLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showExternalIcon?: boolean;
  [key: string]: any;
}

/**
 * SiteLink - 智能链接组件
 * - 内部链接使用 Next.js Link（SPA 导航）
 * - 外部链接使用 a 标签（target="_blank"）
 * - 可选显示外链图标
 */
export default function SiteLink({
  href,
  children,
  className = "",
  showExternalIcon = false,
  ...props
}: SiteLinkProps) {
  // 默认启用 flex 布局，确保子元素在同一行显示
  const defaultClasses = "flex flex-row flex-nowrap";
  const combinedClassName = `${defaultClasses} ${className}`.trim();

  // 检测是否为外部链接
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        {...props}
      >
        {children}
        {showExternalIcon && (
          <ExternalLink className="inline-block w-4 h-4 ml-1" strokeWidth={1} />
        )}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClassName} {...props}>
      {children}
    </Link>
  );
}
