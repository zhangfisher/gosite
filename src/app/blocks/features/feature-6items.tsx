import { Code, Settings, Flame, Sparkles } from 'lucide-react';

export default function Feature6items() {
  const features = [
    { icon: Code, title: '复制粘贴组件' },
    { icon: Settings, title: '零配置' },
    { icon: Flame, title: '优雅的暗色模式' },
    { icon: Sparkles, title: '简洁干净的设计' }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-10">
      <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl"
            style={{ borderColor: 'var(--color-gray-200)' }}
          >
            <div className="md:flex md:items-start md:-mx-4">
              <span
                className="inline-block p-2 rounded-xl md:mx-4"
                style={{
                  color: 'var(--color-theme-600)',
                  backgroundColor: 'rgba(var(--color-theme-600), 0.1)'
                }}
              >
                <feature.icon className="w-6 h-6" />
              </span>
              <div className="mt-4 md:mx-4 md:mt-0">
                <h1 className="text-xl font-medium text-gray-700 capitalize dark:text-white">
                  {feature.title}
                </h1>
                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  专业的设计和开发团队，为您提供最优质的组件。
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
