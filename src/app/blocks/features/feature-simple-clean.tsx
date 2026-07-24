import { Code, Settings, Sparkles, ArrowRight } from 'lucide-react';

export default function FeatureSimpleClean() {
  const features = [
    { icon: Code, title: '复制粘贴组件' },
    { icon: Settings, title: '零配置' },
    { icon: Sparkles, title: '简洁干净的设计' }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-10">
      <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 space-y-3 text-center rounded-xl"
            style={{ backgroundColor: 'var(--color-gray-100)' }}
          >
            <span
              className="inline-block p-3 rounded-full"
              style={{
                color: 'var(--color-theme-600)',
                backgroundColor: 'rgba(var(--color-theme-600), 0.1)'
              }}
            >
              <feature.icon className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
              {feature.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              简单易用，快速集成，提高开发效率。
            </p>
            <a
              href="#"
              className="flex items-center text-sm hover:underline"
              style={{ color: 'var(--color-theme-600)' }}
            >
              <span className="mx-1">了解更多</span>
              <ArrowRight className="w-4 h-4 mx-1" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
