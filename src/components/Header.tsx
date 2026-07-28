"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SiteLink from "./SiteLink";
import { mainMenuItems as menuConfig, type MenuItem } from "@/config/menu";

/**
 * 下拉菜单组件
 */
function DropdownMenu({
  item,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  item: MenuItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isExternalLink = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li
      className="relative whitespace-nowrap"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <SiteLink
        href={item.url}
        className="menuitem nav-link items-center gap-2"
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1} />}
        <span>{item.title}</span>
        {hasChildren && (
          <ChevronDown
            className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
            strokeWidth={1}
          />
        )}
      </SiteLink>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ul role="menu">
              {item.children!.map((child, childIndex) => {
                const ChildIcon = child.icon;
                const childIsExternal = isExternalLink(child.url);

                return (
                  <motion.li
                    key={childIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: childIndex * 0.05,
                      duration: 0.15,
                    }}
                  >
                    <SiteLink
                      href={child.url}
                      className="items-center justify-between px-4 py-2 text-base text-gray-700 dark:text-gray-300 hover:text-theme-600 dark:hover:text-theme-400 hover:bg-theme-50 dark:hover:bg-slate-800/50 transition-colors"
                      role="menuitem"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                          {ChildIcon ? (
                            <ChildIcon strokeWidth={1} />
                          ) : (
                            <span className="w-5 h-5 opacity-0" />
                          )}
                        </span>
                        <span className="flex-1">{child.title}</span>
                      </span>
                      {childIsExternal && (
                        <ExternalLink
                          className="w-5 h-5 shrink-0"
                          strokeWidth={1}
                        />
                      )}
                    </SiteLink>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * Header 主组件
 */
export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

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

  // 移动端下拉菜单切换
  const toggleMobileDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // 桌面端下拉菜单处理
  const handleDesktopDropdownEnter = (index: number) => {
    if (window.innerWidth >= 768) {
      setOpenDropdownIndex(index);
    }
  };

  const handleDesktopDropdownLeave = () => {
    setOpenDropdownIndex(null);
  };

  // 移动端菜单项点击处理
  const handleMobileMenuItemClick = (e: React.MouseEvent, index: number, hasChildren: boolean) => {
    if (hasChildren) {
      e.preventDefault();
      toggleMobileDropdown(index);
    }
  };

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

  const isExternalLink = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow duration-300 dark:border-gray-800 dark:bg-gray-900 ${isScrolled ? "shadow-md" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl xl:max-w-screen-xl 2xl:max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8 xl:px-8">
          <a href="#" className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Orbitly Logo"
              className="h-6 w-auto"
            />
          </a>

          <nav
            aria-label="全局导航"
            className="flex-1 hidden md:flex items-center justify-center"
          >
            <ul className="flex items-center gap-0 text-md">
              {menuConfig.map((item, index) => {
                const hasChildren = item.children && item.children.length > 0;

                if (!hasChildren) {
                  // 无下拉菜单的普通菜单项
                  const Icon = item.icon;
                  return (
                    <li key={index} className="whitespace-nowrap">
                      <SiteLink
                        href={item.url}
                        className="menuitem nav-link items-center gap-2"
                      >
                        {Icon && (
                          <Icon
                            className="w-5 h-5 flex-shrink-0"
                            strokeWidth={1}
                          />
                        )}
                        <span>{item.title}</span>
                      </SiteLink>
                    </li>
                  );
                }

                // 有下拉菜单的菜单项
                return (
                  <DropdownMenu
                    key={index}
                    item={item}
                    isOpen={openDropdownIndex === index}
                    onMouseEnter={() => handleDesktopDropdownEnter(index)}
                    onMouseLeave={handleDesktopDropdownLeave}
                  />
                );
              })}
            </ul>
          </nav>

          {/* 占位空间 - 在小屏幕下占据中间空间，确保按钮显示在右侧 */}
          <div className="flex-1 md:hidden"></div>

          <div className="flex items-center gap-2 flex-shrink-0">
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
              className="inline-flex items-center justify-center p-2.5 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors rounded focus:ring-2 focus:ring-theme-600 focus:ring-offset-2 md:hidden peer-focus-visible:ring-2 peer-focus-visible:ring-theme-600 peer-focus-visible:ring-offset-2"
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

      <motion.nav
        id="mobile-nav"
        aria-label="移动端全局导航"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: "auto",
          opacity: 1,
        }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden border-b border-gray-100 bg-white peer-checked:block dark:border-gray-800 dark:bg-gray-900 md:hidden overflow-hidden"
      >
        <ul className="px-4 py-4 text-sm">
          {menuConfig.map((item, index) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openDropdownIndex === index;

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SiteLink
                  href={item.url}
                  className="flex items-center gap-2 py-2 px-4 rounded-md text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 hover:bg-theme-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleMobileMenuItemClick(e, index, !!hasChildren)}
                >
                  {Icon && (
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={1} />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  {hasChildren && (
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" strokeWidth={1} />
                    </motion.div>
                  )}
                </SiteLink>

                {/* 移动端下拉菜单 */}
                <AnimatePresence>
                  {hasChildren && isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-6 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      {item.children!.map((child, childIndex) => {
                        const ChildIcon = child.icon;
                        const childIsExternal = isExternalLink(child.url);

                        return (
                          <motion.li
                            key={childIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: childIndex * 0.05 }}
                          >
                            <SiteLink
                              href={child.url}
                              className="flex items-center justify-between text-xs py-2 px-4 gap-2 text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 hover:bg-theme-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <span className="flex items-center gap-2 flex-1">
                                {ChildIcon && (
                                  <ChildIcon
                                    className="w-3 h-3 shrink-0"
                                    strokeWidth={1}
                                  />
                                )}
                                <span className="truncate">
                                  {child.title}
                                </span>
                              </span>
                              {childIsExternal && (
                                <ExternalLink
                                  className="w-3 h-3 shrink-0"
                                  strokeWidth={1}
                                />
                              )}
                            </SiteLink>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
