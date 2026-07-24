"use client";

import { useEffect, useState } from "react";

export default function TestSimplePage() {
  const [htmlClass, setHtmlClass] = useState("");
  const [bodyBg, setBodyBg] = useState("");

  useEffect(() => {
    const updateInfo = () => {
      setHtmlClass(document.documentElement.className);
      setBodyBg(window.getComputedStyle(document.body).backgroundColor);
    };

    updateInfo();

    const observer = new MutationObserver(updateInfo);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Tailwind 暗色模式测试
        </h1>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            当前状态
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>HTML类名:</strong> {htmlClass || "(无)"}</p>
            <p><strong>Body背景色:</strong> {bodyBg}</p>
            <p><strong>暗色模式:</strong> {htmlClass.includes("dark") ? "✅ 启用" : "❌ 未启用"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              亮色模式样式
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              白色背景，深色边框
            </p>
          </div>

          <div className="bg-gray-800 dark:bg-white p-6 rounded-lg border-2 border-gray-600 dark:border-gray-300">
            <h3 className="text-lg font-semibold text-gray-100 dark:text-gray-900 mb-2">
              暗色模式样式
            </h3>
            <p className="text-gray-300 dark:text-gray-700">
              深色背景，浅色边框
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
        >
          切换暗色模式
        </button>

        <div className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-lg border border-yellow-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-white mb-2">
            测试说明
          </h3>
          <ul className="text-yellow-800 dark:text-gray-300 space-y-1">
            <li>✓ 如果HTML有dark类，右侧卡片应该变白</li>
            <li>✓ 如果HTML没有dark类，左侧卡片保持白色</li>
            <li>✓ 点击按钮切换并观察变化</li>
            <li>✓ 暗色模式应该在全局生效</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
