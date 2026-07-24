import { Flame, Puzzle, Sparkles, ArrowRight } from 'lucide-react';

export default function FeatureElegantDark() {
  const features = [
    { icon: Flame, title: '优雅的暗色模式' },
    { icon: Puzzle, title: '易于定制' },
    { icon: Sparkles, title: '简洁干净的设计' }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-10">
      <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-8 space-y-3 rounded-xl border-2"
            style={{ borderColor: 'var(--color-theme-400)' }}
          >
            <span style={{ color: 'var(--color-theme-600)' }}>
              <feature.icon className="w-8 h-8" />
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
              {feature.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              精心设计的用户体验，让您的产品脱颖而出。
            </p>
            <a
              href="#"
              className="inline-flex p-2 capitalize transition-colors duration-300 transform rounded-full hover:underline"
              style={{
                backgroundColor: 'rgba(var(--color-theme-600), 0.1)',
                color: 'var(--color-theme-600)'
              }}
            >
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
