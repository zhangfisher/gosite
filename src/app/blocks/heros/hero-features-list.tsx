import { Check } from 'lucide-react';

export default function HeroFeaturesList() {
  const features = [
    '优质精选',
    '质量保险',
    '合法文件齐全',
    '美国眼镜商直供',
    '支付安全',
    '快速配送（含加急）'
  ];

  return (
    <div className="flex flex-col px-6 py-10 space-y-6 lg:h-128 lg:py-16 lg:flex-row lg:items-center">
      <div className="w-full lg:w-1/2">
        <div className="lg:max-w-lg">
          <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
            从美国选购优质眼镜
          </h1>
          <p className="mt-4 text-secondary">
            我们与美国知名眼镜商合作，为您提供最优质的眼镜产品。
          </p>
          <div className="grid gap-6 mt-8 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center text-gray-800 dark:text-gray-200">
                <Check className="w-5 h-5 mx-3" style={{ color: 'var(--color-theme-600)' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
        <img
          className="object-cover w-full h-full max-w-2xl rounded-md"
          src="https://images.unsplash.com/photo-1555181126-cf46a03827c0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
          alt="眼镜展示"
        />
      </div>
    </div>
  );
}
