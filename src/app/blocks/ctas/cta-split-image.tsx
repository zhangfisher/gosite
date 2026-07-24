export default function CtaSplitImage() {
  return (
    <section className="dark:bg-gray-800 lg:py-12 lg:flex lg:justify-center" style={{ backgroundColor: 'var(--color-gray-100)' }}>
      <div className="overflow-hidden bg-white dark:bg-gray-900 lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        <div className="lg:w-1/2">
          <div
            className="h-64 bg-cover lg:h-full"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)`
            }}
          ></div>
        </div>
        <div className="max-w-xl px-6 py-12 lg:max-w-5xl lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            实现您的创意{' '}
            <span style={{ color: 'var(--color-theme-600)' }}>想法</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-300">
            我们提供专业的技术支持和创新解决方案，帮助您将创意变为现实。
            无论您有什么想法，我们都能帮您实现。
          </p>
          <div className="inline-flex w-full mt-6 sm:w-auto">
            <button
              className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 rounded-lg hover:opacity-90 focus:ring focus:ring-opacity-80"
              style={{
                backgroundColor: 'var(--color-gray-800)',
                '--tw-ring-color': 'var(--color-gray-300)'
              } as React.CSSProperties}
            >
              立即开始
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
