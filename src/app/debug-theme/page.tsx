"use client";

import { useEffect, useState } from "react";

export default function DebugThemePage() {
  const [htmlClass, setHtmlClass] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [computedBg, setComputedBg] = useState("");

  useEffect(() => {
    const updateState = () => {
      const html = document.documentElement;
      setHtmlClass(html.className);
      setIsDark(html.classList.contains("dark"));
      setComputedBg(window.getComputedStyle(document.body).backgroundColor);
    };

    updateState();

    // 监控HTML类名变化
    const observer = new MutationObserver(updateState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          明暗主题调试页面
        </h1>

        {/* 状态面板 */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            实时状态监控
          </h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">HTML类名:</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">
                {htmlClass || "(无)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">暗色模式状态:</span>
              <span className={`px-3 py-1 rounded ${isDark ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {isDark ? "✅ 已启用" : "❌ 未启用"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Body背景色:</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100">
                {computedBg}
              </span>
            </div>
          </div>
        </div>

        {/* 测试卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-500 dark:border-blue-400">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              测试卡片 A
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              白色背景 → 暗色模式变灰
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg border-2 border-green-500 dark:border-green-400">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              测试卡片 B
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              浅灰背景 → 暗色模式变中灰
            </p>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-4">
          <button
            onClick={toggleDark}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
          >
            切换暗色模式
          </button>

          <button
            onClick={() => {
              console.log("当前状态:", {
                htmlClass: document.documentElement.className,
                hasDark: document.documentElement.classList.contains("dark"),
                bodyBg: window.getComputedStyle(document.body).backgroundColor
              });
            }}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
          >
            控制台日志
          </button>
        </div>

        {/* 说明 */}
        <div className="bg-yellow-50 dark:bg-gray-800 p-6 rounded-lg border border-yellow-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-yellow-900 dark:text-white mb-3">
            诊断说明
          </h3>
          <ul className="text-yellow-800 dark:text-gray-300 space-y-2">
            <li>• 上面的状态面板显示实时的HTML类名和暗色模式状态</li>
            <li>• 如果点击"切换"后状态不变，Tailwind配置有问题</li>
            <li>• 如果状态变了但颜色没变，CSS样式有问题</li>
            <li>• 打开控制台查看详细的样式信息</li>
          </ul>
        </div>

        {/* 原始页面卡片测试 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            原始页面样式测试
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 px-4 py-6 text-center">
              <dt className="text-lg font-medium text-gray-500 dark:text-gray-400">测试数据</dt>
              <dd className="text-4xl font-extrabold text-indigo-600">99%</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
