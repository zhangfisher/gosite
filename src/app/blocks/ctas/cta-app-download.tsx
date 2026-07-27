import { Apple } from 'lucide-react';

export default function CtaAppDownload() {
  return (
    <section className="surface px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
          立即体验真正不同的创新服务
        </h2>
        <p className="block max-w-4xl mt-4 text-muted">
          我们提供独特而专业的解决方案，为您的业务带来全新体验。
        </p>
        <div className="mt-6">
          <button
            className="inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 rounded-lg shadow sm:w-auto sm:mx-2 hover:opacity-90 dark:hover:opacity-80 focus:ring focus:ring-opacity-80"
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
    </section>
  );
}
