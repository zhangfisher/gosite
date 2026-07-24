import { Apple } from 'lucide-react';

export default function CtaMobileApp() {
  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-12">
      <div className="flex flex-col items-center xl:flex-row">
        <div className="flex justify-center xl:w-1/2">
          <img
            className="h-80 w-80 sm:w-[28rem] sm:h-[28rem] flex-shrink-0 object-cover rounded-full"
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            alt="应用预览"
          />
        </div>
        <div className="flex flex-col items-center mt-6 xl:items-start xl:w-1/2 xl:mt-0">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
            下载我们的免费移动应用
          </h2>
          <p className="block max-w-2xl mt-4 text-gray-500 dark:text-gray-300">
            随时随地访问我们的服务，享受更好的用户体验。立即下载体验。
          </p>
          <div className="mt-6 sm:-mx-2">
            <button
              className="inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 rounded-lg shadow sm:w-auto sm:mx-2 hover:opacity-90 focus:ring focus:ring-opacity-80"
              style={{
                backgroundColor: 'var(--color-gray-900)',
                '--tw-ring-color': 'var(--color-gray-300)'
              } as React.CSSProperties}
            >
              <Apple className="w-5 h-5 mx-2" />
              <span className="mx-2">App Store 下载</span>
            </button>
            <button
              className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:opacity-90 focus:ring focus:ring-opacity-80"
              style={{
                backgroundColor: 'var(--color-theme-600)',
                '--tw-ring-color': 'var(--color-theme-300)'
              } as React.CSSProperties}
            >
              <span className="mr-2">📱</span>
              <span className="mx-2">Google Play 下载</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
