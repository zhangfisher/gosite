"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

/**
 * 暗黑模式切换工具
 *
 * - 亮色模式：显示 Sun 图标（点击切到暗黑）
 * - 暗黑模式：显示 Moon 图标（点击切到亮色）
 *
 * 通过操作 <html> 的 classList 切换 `dark` 类，并把偏好持久化到 localStorage。
 * 同时监听系统主题变化：用户未手动设置时跟随系统。
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // 初始化：读取 localStorage / 系统偏好
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const dark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // 监听系统主题变化：仅当用户未手动设置时跟随
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const dark = e.matches;
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const Icon = isDark ? Moon : Sun;
  const tooltip = isDark ? "切换到亮色模式" : "切换到暗黑模式";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggle}
      title={tooltip}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
