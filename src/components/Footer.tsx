import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  HeadphonesIcon,
  Menu,
} from "lucide-react";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 第一列：公司信息 */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="美一智慧餐厅科技"
                className="h-6 w-auto"
              />
            </div>

            {/* 公司名称 */}
            <div className="flex items-start gap-3">
              <Building2
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                福建环宇通科技有限公司
              </p>
            </div>

            {/* 地址 */}
            <div className="flex items-start gap-3">
              <MapPin
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                中国福建省丰泽市雨城区办公楼
              </p>
            </div>

            {/* 电话 */}
            <div className="flex items-start gap-3">
              <Phone
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0"
              />
              <div className="space-y-0.5">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  0086-15906005001
                </p>
              </div>
            </div>

            {/* 邮箱 */}
            <div className="flex items-start gap-3">
              <Mail
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0"
              />
              <a
                href="mailto:hyt@huanyutong.com"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
              >
                hyt@huanyutong.com
              </a>
            </div>

            {/* 社交媒体链接 */}
            <div className="pt-2">
              <h3 className="heading-3 mb-3">关注我们</h3>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/meeyi.intercom"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  aria-label="Facebook"
                >
                  <SocialIcon
                    url="https://www.facebook.com/meeyi.intercom"
                    network="facebook"
                    style={{ height: 28, width: 28 }}
                  />
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://twitter.com/MEEYI_HYT"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  aria-label="X (Twitter)"
                >
                  <SocialIcon
                    url="https://twitter.com/MEEYI_HYT"
                    network="x"
                    style={{ height: 28, width: 28 }}
                  />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@meeyi1999"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  aria-label="YouTube"
                >
                  <SocialIcon
                    url="https://youtube.com/@meeyi1999"
                    network="youtube"
                    style={{ height: 28, width: 28 }}
                  />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/8615392123519?text="
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  aria-label="WhatsApp"
                >
                  <SocialIcon
                    url="https://wa.me/8615392123519?text="
                    network="whatsapp"
                    style={{ height: 28, width: 28 }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* 第二列：解决方案 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Menu
                strokeWidth={1}
                className="w-5 h-5 text-theme-600 dark:text-theme-400"
              />
              <h3 className="heading-3">解决方案</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a
                  href="#solutions"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  无线访客寻呼系统
                </a>
              </li>
              <li>
                <a
                  href="#solutions"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  无线服务员呼叫系统
                </a>
              </li>
              <li>
                <a
                  href="#solutions"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  无线厨房呼叫系统
                </a>
              </li>
            </ul>
          </div>

          {/* 第三列：网站 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe
                strokeWidth={1}
                className="w-5 h-5 text-theme-600 dark:text-theme-400"
              />
              <h3 className="heading-3">网站</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  医疗对讲服务
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  养老服务
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  景区服务
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  银行排队叫号
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  工厂生产线呼叫
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  停车场呼叫服务
                </a>
              </li>
            </ul>
          </div>

          {/* 第四列：服务 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeadphonesIcon
                strokeWidth={1}
                className="w-5 h-5 text-theme-600 dark:text-theme-400"
              />
              <h3 className="heading-3">服务</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  常见问题
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  资源下载
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-theme-600 dark:hover:text-theme-400 transition"
                >
                  样品服务
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; 2026 福建环宇通科技有限公司. 保留所有权利。
            </p>

            <ul className="flex flex-wrap justify-center gap-4 text-xs">
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                  隐私政策
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                  服务条款
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                  Cookie 政策
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
