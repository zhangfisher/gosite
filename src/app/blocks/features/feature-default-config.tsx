import { Code, Smartphone, Settings } from 'lucide-react';

export default function FeatureDefaultConfig() {
  const features = [
    { icon: Code, title: '默认 Tailwind 配置', desc: '开箱即用，无需复杂配置，快速开始您的开发工作。' },
    { icon: Smartphone, title: '完全响应式组件', desc: '完美适配各种设备尺寸，提供一致的用户体验。' },
    { icon: Settings, title: 'RTL 语言支持', desc: '支持从右到左的语言布局，服务全球用户。' }
  ];

  return (
    <section className="bg-white dark:bg-gray-900 px-6 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index}>
            <feature.icon className="w-8 h-8" style={{ color: 'var(--color-theme-600)' }} />
            <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              {feature.title}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
