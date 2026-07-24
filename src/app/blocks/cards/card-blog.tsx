export default function CardBlog() {
  return (
    <div className="max-w-2xl overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <img
        className="object-cover w-full h-64"
        src="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
        alt="文章图片"
      />
      <div className="p-6">
        <div>
          <span className="text-xs font-medium uppercase" style={{ color: 'var(--color-theme-600)' }}>
            产品
          </span>
          <a
            href="#"
            className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:underline"
          >
            我在一年内建立了成功的博客
          </a>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            分享我的博客建立经验，从零到获得成功的关键步骤和策略。
            内容营销、SEO优化、社区建设等全方位指导。
          </p>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                className="object-cover h-10 rounded-full"
                src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                alt="头像"
              />
              <a href="#" className="mx-2 font-semibold text-gray-700 dark:text-gray-200">
                张三
              </a>
            </div>
            <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">2021年9月21日</span>
          </div>
        </div>
      </div>
    </div>
  );
}
