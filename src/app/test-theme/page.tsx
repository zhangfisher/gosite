"use client";

import { useEffect, useState } from "react";

export default function TestThemePage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      const hasDarkClass = html.classList.contains("dark");
      setIsDark(hasDarkClass);
      console.log("当前主题状态:", hasDarkClass ? "dark" : "light");
      console.log("HTML类名:", html.className);
      console.log("计算出的背景色:", window.getComputedStyle(document.body).backgroundColor);
    };

    checkTheme();

    // 监听类名变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          明暗模式测试页面
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            当前状态
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>主题状态:</strong> {isDark ? "暗色模式" : "亮色模式"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>HTML类名:</strong> {document.documentElement.className}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            样式测试
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="text-gray-900 dark:text-gray-100">
                这是一个测试文本，应该根据主题改变颜色
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              切换主题
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            控制台检查
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            打开浏览器控制台（F12），查看以下信息：
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            <li>HTML元素的类名</li>
            <li>localStorage中的主题设置</li>
            <li>计算出的CSS样式</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
