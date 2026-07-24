export default function TestDarkPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        暗色模式直接测试
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            测试卡片1
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            背景应该: 亮色=白, 暗色=深灰
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg border-2 border-green-500">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            测试卡片2
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            背景应该: 亮色=浅灰, 暗色=中灰
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg border-2 border-indigo-500">
        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
          彩色卡片测试
        </h3>
        <p className="text-indigo-700 dark:text-indigo-300">
          这个卡片在暗色模式下应该显示深蓝色背景
        </p>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>测试说明:</strong> 手动给HTML添加dark类来测试:
          在浏览器控制台运行: document.documentElement.classList.add('dark')
        </p>
      </div>
    </div>
  );
}
