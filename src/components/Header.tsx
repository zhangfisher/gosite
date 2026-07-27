"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const navToggleCheckbox = document.getElementById(
      "nav-toggle",
    ) as HTMLInputElement;
    const navToggleLabel = document.getElementById("nav-toggle-label");

    const handleChange = () => {
      if (navToggleCheckbox && navToggleLabel) {
        navToggleLabel.setAttribute(
          "aria-expanded",
          String(navToggleCheckbox.checked),
        );
      }
    };

    navToggleCheckbox?.addEventListener("change", handleChange);
    return () => {
      navToggleCheckbox?.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 初始化主题状态 - 只有明确设置为 dark 时才是暗色模式
    const storedTheme = localStorage.getItem("theme");
    const isDarkMode = storedTheme === "dark";
    setIsDark(isDarkMode);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMounted]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newDarkState = !isDark;

    setIsDark(newDarkState);

    if (newDarkState) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow duration-300 dark:border-gray-800 dark:bg-gray-900 ${isScrolled ? "shadow-md" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <a href="#" className="block">
            <img
              src="/images/logo.png"
              alt="Orbitly Logo"
              className="h-6 w-auto"
            />
          </a>

          <div className="flex flex-1 items-center justify-end md:justify-center">
            <nav aria-label="全局导航" className="hidden md:block">
              <ul className="flex items-center gap-6 text-base">
                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    首页
                  </a>
                </li>
                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    新闻资讯
                  </a>
                </li>
                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    产品
                  </a>
                </li>

                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    解决方案
                  </a>
                </li>

                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    服务
                  </a>
                </li>
                <li>
                  <a
                    className="menuitem nav-link"
                    href="#"
                  >
                    关于
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="切换主题"
              className="icon-button focus-visible:ring-2 focus-visible:ring-theme-600 focus-visible:ring-offset-2"
              type="button"
            >
              {isDark ? (
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <label
              htmlFor="nav-toggle"
              id="nav-toggle-label"
              aria-expanded="false"
              aria-controls="mobile-nav"
              className="icon-button cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-theme-600 peer-focus-visible:ring-offset-2 md:hidden"
            >
              <span className="sr-only">切换菜单</span>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
        </div>
      </header>

      <input type="checkbox" id="nav-toggle" className="hidden peer" />

      <nav
        id="mobile-nav"
        aria-label="移动端全局导航"
        className="hidden border-b border-gray-100 bg-white peer-checked:block dark:border-gray-800 dark:bg-gray-900 md:hidden"
      >
        <ul className="space-y-1 px-4 py-4 text-sm">
          <li>
            <a
              href="#"
              className="menu-item"
            >
              产品
            </a>
          </li>

          <li>
            <a
              href="#"
              className="menu-item"
            >
              解决方案
            </a>
          </li>

          <li>
            <a
              href="#"
              className="menu-item"
            >
              客户
            </a>
          </li>

          <li>
            <a
              href="#"
              className="menu-item"
            >
              定价
            </a>
          </li>

          <li>
            <a
              href="#"
              className="menu-item"
            >
              文档
            </a>
          </li>

          <li>
            <a
              href="#"
              className="menu-item"
            >
              博客
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
