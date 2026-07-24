export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Tailwind 暗色模式诊断
      </h1>

      <div className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
            红色测试卡片
          </h2>
          <p className="text-red-700 dark:text-red-300">
            如果暗色模式工作，这个背景会变成深红色
          </p>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            蓝色测试卡片
          </h2>
          <p className="text-blue-700 dark:text-blue-300">
            如果暗色模式工作，这个背景会变成深蓝色
          </p>
        </div>

        <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
            绿色测试卡片
          </h2>
          <p className="text-green-700 dark:text-green-300">
            如果暗色模式工作，这个背景会变成深绿色
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            黑白测试卡片
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            白色背景，深色边框
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-800 dark:text-gray-200">
              嵌套的灰色背景卡片
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-gray-800 border border-yellow-200 dark:border-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-white mb-2">
            手动测试说明
          </h2>
          <div className="text-yellow-800 dark:text-gray-300 space-y-2">
            <p>1. 打开浏览器控制台 (F12)</p>
            <p>2. 运行: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">document.documentElement.classList.add('dark')</code></p>
            <p>3. 观察页面颜色是否改变</p>
            <p>4. 如果没有改变，Tailwind暗色模式没有工作</p>
          </div>
        </div>
      </div>
    </div>
  );
}
