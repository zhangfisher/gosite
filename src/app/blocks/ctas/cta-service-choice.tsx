export default function CtaServiceChoice() {
  const services = [
    { title: 'Web 开发', primary: true },
    { title: 'App 开发', primary: false }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {services.map((cta, index) => (
          <div key={index} className="flex flex-col items-center max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-white">
              {cta.title}
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-300">
              我们提供专业的开发服务，为您的项目提供最佳解决方案。
            </p>
            <button
              className="inline-flex items-center justify-center w-full px-5 py-2 mt-6 rounded-lg sm:w-auto transition-all hover:opacity-90 focus:ring focus:ring-opacity-80"
              style={{
                backgroundColor: cta.primary ? 'var(--color-theme-600)' : 'transparent',
                color: cta.primary ? 'white' : 'var(--color-gray-700)',
                border: cta.primary ? 'none' : '1px solid var(--color-gray-200)',
                '--tw-ring-color': cta.primary ? 'var(--color-theme-300)' : 'var(--color-gray-200)'
              } as React.CSSProperties}
            >
              立即开始
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
