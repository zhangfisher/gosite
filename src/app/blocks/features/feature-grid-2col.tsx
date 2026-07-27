import {
  Code,
  Settings,
  BarChart,
  Flame,
  Puzzle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function FeatureGrid2col() {
  const features = [
    { icon: Code, title: "复制粘贴组件" },
    { icon: Settings, title: "零配置" },
    { icon: BarChart, title: "每月新增组件" },
    { icon: Flame, title: "优雅的暗色模式" },
    { icon: Puzzle, title: "易于定制" },
    { icon: Sparkles, title: "简洁干净的设计" },
  ];

  return (
    <section className="surface px-6 py-10">
      <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <div key={index} className="space-y-3">
            <span
              className="inline-block p-3 rounded-full"
              style={{
                color: "var(--color-theme-600)",
                backgroundColor: "color-mix(in oklch, var(--color-theme-600) 10%, transparent)",
              }}
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-(--color-theme-50)">
                <feature.icon />
              </div>
            </span>
            <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
              {feature.title}
            </h1>
            <p className="text-muted">
              持续更新和改进，确保您始终使用最新的组件。
            </p>
            <a
              href="#"
              className="inline-flex items-center text-sm hover:underline"
              style={{ color: "var(--color-theme-600)" }}
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
