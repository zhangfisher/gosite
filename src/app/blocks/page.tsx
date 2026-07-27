'use client';

import { useState } from 'react';

// 导入Hero组件
import HeroTextLeft from './heros/hero-text-left';
import HeroCenterText from './heros/hero-center-text';
import HeroFeaturesList from './heros/hero-features-list';
import HeroSideImage from './heros/hero-side-image';
import HeroBackground from './heros/hero-background';

// 导入Feature组件
import FeatureDefaultConfig from './features/feature-default-config';
import FeatureElegantDark from './features/feature-elegant-dark';
import FeatureSimpleClean from './features/feature-simple-clean';
import FeatureBorderCard from './features/feature-border-card';
import FeatureGrid2col from './features/feature-grid-2col';
import Feature6items from './features/feature-6items';

// 导入CTA组件
import CtaNewsletter from './ctas/cta-newsletter';
import CtaSplitImage from './ctas/cta-split-image';
import CtaAppDownload from './ctas/cta-app-download';
import CtaServiceChoice from './ctas/cta-service-choice';
import CtaMobileApp from './ctas/cta-mobile-app';

// 导入Footer组件
import FooterSimple from './footers/footer-simple';
import FooterLinksRow from './footers/footer-links-row';
import FooterFullSections from './footers/footer-full-sections';
import FooterNewsletter from './footers/footer-newsletter';
import FooterSubscribeForm from './footers/footer-subscribe-form';

// 导入Card、FAQ、Contact组件
import CardBlog from './cards/card-blog';
import FaqAccordion from './faqs/faq-accordion';
import ContactInfoGrid from './contacts/contact-info-grid';

// 内容区容器：与 Header/Footer 内容区宽度规范一致（全宽背景 + 内部居中）
const CONTENT = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

export default function BlocksPage() {
  const [activeTab, setActiveTab] = useState('heros');
  const [activeBlock, setActiveBlock] = useState(0);

  const categories = [
    { id: 'heros', name: '首页英雄区', count: 5 },
    { id: 'features', name: '功能特性', count: 6 },
    { id: 'ctas', name: '行动号召', count: 5 },
    { id: 'footers', name: '页脚区块', count: 5 },
    { id: 'cards', name: '卡片组件', count: 3 },
    { id: 'faqs', name: '常见问题', count: 1 },
    { id: 'contacts', name: '联系方式', count: 1 },
  ];

  const heroBlocks = [
    <HeroTextLeft key="hero-1" />,
    <HeroCenterText key="hero-2" />,
    <HeroFeaturesList key="hero-3" />,
    <HeroSideImage key="hero-4" />,
    <HeroBackground key="hero-5" />
  ];

  const featureBlocks = [
    <FeatureDefaultConfig key="features-1" />,
    <FeatureElegantDark key="features-2" />,
    <FeatureSimpleClean key="features-3" />,
    <FeatureBorderCard key="features-4" />,
    <FeatureGrid2col key="features-5" />,
    <Feature6items key="features-6" />
  ];

  const ctaBlocks = [
    <CtaNewsletter key="cta-1" />,
    <CtaSplitImage key="cta-2" />,
    <CtaAppDownload key="cta-3" />,
    <CtaServiceChoice key="cta-4" />,
    <CtaMobileApp key="cta-5" />
  ];

  const footerBlocks = [
    <FooterSimple key="footer-1" />,
    <FooterLinksRow key="footer-2" />,
    <FooterFullSections key="footer-3" />,
    <FooterNewsletter key="footer-4" />,
    <FooterSubscribeForm key="footer-5" />
  ];

  const cardBlocks = [
    <CardBlog key="card-1" />
  ];

  const faqBlocks = [
    <FaqAccordion key="faq-1" />
  ];

  const contactBlocks = [
    <ContactInfoGrid key="contact-1" />
  ];

  const getBlocks = () => {
    switch (activeTab) {
      case 'heros': return heroBlocks;
      case 'features': return featureBlocks;
      case 'ctas': return ctaBlocks;
      case 'footers': return footerBlocks;
      case 'cards': return cardBlocks;
      case 'faqs': return faqBlocks;
      case 'contacts': return contactBlocks;
      default: return [];
    }
  };

  const currentBlocks = getBlocks();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header - 全宽 border-b + 内部居中内容 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className={`${CONTENT} py-8`}>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            UI 组件库
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            浏览和预览所有可用的UI组件，点击标签切换不同类别
          </p>
        </div>
      </div>

      {/* Tabs - 全宽 + 内部居中内容 */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className={CONTENT}>
          <div className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  setActiveBlock(0);
                }}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === category.id
                    ? 'border-b-2 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                style={{
                  borderColor: activeTab === category.id ? 'var(--color-theme-600)' : 'transparent'
                }}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Block Navigation - 全宽 + 内部居中内容 */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className={`${CONTENT} py-3`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-600 dark:text-gray-400">选择组件：</span>
            {currentBlocks.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveBlock(index)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  activeBlock === index
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                style={{
                  backgroundColor: activeBlock === index ? 'var(--color-theme-600)' : undefined
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content - 全宽灰色背景 + 内部居中白色卡片 */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className={`${CONTENT} py-8`}>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                组件 {activeBlock + 1} / {currentBlocks.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveBlock(Math.max(0, activeBlock - 1))}
                  disabled={activeBlock === 0}
                  className="px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ backgroundColor: 'var(--color-theme-600)' }}
                >
                  上一个
                </button>
                <button
                  onClick={() => setActiveBlock(Math.min(currentBlocks.length - 1, activeBlock + 1))}
                  disabled={activeBlock === currentBlocks.length - 1}
                  className="px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ backgroundColor: 'var(--color-theme-600)' }}
                >
                  下一个
                </button>
              </div>
            </div>
            <div className="p-6">{currentBlocks[activeBlock]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
