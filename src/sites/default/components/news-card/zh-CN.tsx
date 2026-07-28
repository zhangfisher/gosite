import SiteLink from "@/components/SiteLink";
import { CalendarIcon } from "lucide-react";

export interface NewsCardProps {
  /**
   * 新闻标题
   */
  title: string;
  /**
   * 新闻摘要
   */
  summary: string;
  /**
   * 发布日期（格式：YYYY-MM-DD 或可读日期字符串）
   */
  publishDate: string;
  /**
   * 新闻详情页链接
   */
  href: string;
  /**
   * 可选的卡片样式变体
   */
  variant?: "default" | "cream" | "bordered";
}

/**
 * 新闻卡片组件 - 有机生物绿风格
 *
 * 用于展示新闻摘要信息，包含标题、发布日期、摘要和阅读链接。
 * 采用柔和的卡片设计，悬停时有自然的浮动效果。
 */
export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  publishDate,
  href,
  variant = "default"
}) => {
  // 根据变体设置卡片样式类
  const cardVariantClasses = {
    default: "bg-white",
    cream: "card-cream",
    bordered: "card-bordered"
  }[variant];

  return (
    <article
      className={`card ${cardVariantClasses} group relative flex flex-col gap-4`}
    >
      {/* 标题 */}
      <h3 className="text-h4 font-bold text-primary-900 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
        {title}
      </h3>

      {/* 发布日期 */}
      <div className="flex items-center gap-2 text-body-small text-gray-dark">
        <CalendarIcon className="w-4 h-4 text-primary-500" aria-hidden="true" />
        <time dateTime={publishDate}>{publishDate}</time>
      </div>

      {/* 摘要 */}
      <p className="text-body text-primary-950 line-clamp-3 flex-grow">
        {summary}
      </p>

      {/* 阅读更多链接 */}
      <div className="pt-2 border-t border-primary-100">
        <SiteLink
          href={href}
          className="inline-flex items-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200 group/link"
        >
          阅读更多
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </SiteLink>
      </div>
    </article>
  );
};
