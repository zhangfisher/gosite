export default function CtaNewsletter() {
  return (
    <section className="surface px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white">
          将您的业务提升到{' '}
          <span style={{ color: 'var(--color-theme-600)' }}>新的高度</span>
        </h2>
        <p className="max-w-4xl mt-6 text-center text-muted">
          我们提供专业的解决方案，帮助您实现业务目标。立即开始体验。
        </p>
        <div className="inline-flex w-full mt-6 sm:w-auto">
          <button
            className="inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 rounded-lg hover:opacity-90 focus:ring focus:ring-opacity-80"
            style={{
              backgroundColor: 'var(--color-theme-600)',
              '--tw-ring-color': 'var(--color-theme-300)'
            } as React.CSSProperties}
          >
            立即注册
          </button>
        </div>
      </div>
    </section>
  );
}
