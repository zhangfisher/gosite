'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: '每次升级都需要额外收费吗？',
      answer: '我们提供灵活的升级方案，小版本更新免费，大版本升级享受优惠价格。具体升级政策请查看我们的服务条款。'
    },
    {
      question: '每个网站都需要购买许可证吗？',
      answer: '是的，每个使用我们组件的网站都需要单独购买许可证。每个许可证绑定到一个域名及其子域名，确保合法合规使用。'
    },
    {
      question: '什么是常规许可证？',
      answer: '常规许可证允许您在单个网站或项目中使用我们的组件。包括访问所有基本功能、完整文档和标准技术支持。适合个人开发者和小型项目。'
    },
    {
      question: '什么是扩展许可证？',
      answer: '扩展许可证提供比常规许可证更多的权利和功能。包括多个网站使用权限、优先技术支持、访问高级组件，以及将组件用于销售给最终用户的商业项目的权利。'
    }
  ];

  return (
    <div className="py-8 sm:py-16 lg:py-24" style={{ backgroundColor: 'var(--color-gray-100)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl text-gray-800 dark:text-white">
            需要帮助？我们有答案
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            浏览我们最常见的问题，找到您需要的信息。
          </p>
        </div>
        <div className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg border-gray-200 dark:border-gray-700">
              <button
                className="flex items-center justify-between w-full px-6 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-800 dark:text-white">{faq.question}</span>
                <ChevronRight
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    openIndex === index ? 'rotate-90' : ''
                  }`}
                />
              </button>
              <div className={`px-6 pb-4 ${openIndex === index ? 'block' : 'hidden'}`}>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
