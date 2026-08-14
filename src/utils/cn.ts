import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn - 合并 Tailwind 类名（clsx + tailwind-merge）
 * Shadcn UI 组件统一使用的类名拼接工具
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
