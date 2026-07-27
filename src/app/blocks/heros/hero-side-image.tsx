export default function HeroSideImage() {
  return (
    <div className="lg:flex">
      <div className="flex items-center justify-center w-full px-6 py-8 lg:h-[32rem] lg:w-1/2">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
            实现您的创意{' '}
            <span style={{ color: 'var(--color-theme-600)' }}>想法</span>
          </h2>
          <p className="mt-4 text-sm text-muted lg:text-base">
            我们提供专业的技术支持和创新解决方案，帮助您将创意变为现实。
            无论您有什么想法，我们都能帮您实现。
          </p>
          <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
            <button
              className="px-5 py-2 text-sm font-medium tracking-wider text-center text-white transition-colors duration-300 transform rounded-md hover:opacity-90"
              style={{ backgroundColor: 'var(--color-theme-900)' }}
            >
              开始使用
            </button>
            <button
              className="px-5 py-2 text-sm font-medium tracking-wider text-center text-gray-700 transition-colors duration-300 transform rounded-md lg:mx-4 hover:bg-gray-300"
              style={{ backgroundColor: 'var(--color-gray-200)' }}
            >
              了解更多
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-64 lg:w-1/2 lg:h-auto">
        <div
          className="w-full h-full bg-cover"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1508394522741-82ac9c15ba69?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=748&q=80)`
          }}
        >
          <div className="w-full h-full bg-black opacity-25"></div>
        </div>
      </div>
    </div>
  );
}
