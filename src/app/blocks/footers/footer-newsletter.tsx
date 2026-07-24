import { ArrowRight } from 'lucide-react';

export default function FooterNewsletter() {
  const sections = [
    { title: '快速链接', links: ['首页', '关于我们', '我们的理念'] },
    { title: '行业', links: ['零售电商', '信息技术', '金融保险'] },
    { title: '服务', links: ['翻译服务', '校对编辑', '内容创作'] }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="px-6 py-12">
        <div className="md:flex md:-mx-3 md:items-center md:justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-gray-800 md:mx-3 xl:text-2xl dark:text-white">
            订阅我们的通讯获取最新资讯
          </h1>
          <div className="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
            <button
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm text-white duration-300 rounded-lg gap-x-3 hover:opacity-90 focus:ring focus:ring-opacity-80"
              style={{
                backgroundColor: 'var(--color-gray-800)',
                '--tw-ring-color': 'var(--color-gray-300)'
              } as React.CSSProperties}
            >
              <span>立即注册</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-gray-800 dark:text-white">{section.title}</p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {section.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">联系我们</p>
            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline">
                +880 768 473 4978
              </a>
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:underline">
                info@merakiui.com
              </a>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="#">
            <img className="w-auto h-7" src="https://merakiui.com/images/full-logo.svg" alt="Logo" />
          </a>
          <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300">
            © 版权所有 2021. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
