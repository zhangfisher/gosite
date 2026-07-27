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
          {/* 第1列：网站 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
              />
              <h3 className="heading-4">网站</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm link">
                  医疗对讲服务
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  养老服务
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  景区服务
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  银行排队叫号
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  工厂生产线呼叫
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  停车场呼叫服务
                </a>
              </li>
            </ul>
          </div>
          {/* 第2列：解决方案 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Menu
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
              />
              <h3 className="heading-4">解决方案</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a href="#solutions" className="text-sm link">
                  无线访客寻呼系统
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-sm link">
                  无线服务员呼叫系统
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-sm link">
                  无线厨房呼叫系统
                </a>
              </li>
            </ul>
          </div>
          {/* 第3列：服务 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HeadphonesIcon
                strokeWidth={1}
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
              />
              <h3 className="heading-4">服务</h3>
            </div>

            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm link">
                  常见问题
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  资源下载
                </a>
              </li>
              <li>
                <a href="#" className="text-sm link">
                  样品服务
                </a>
              </li>
            </ul>
          </div>
          {/* 第4列：公司信息 */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="美一智慧餐厅科技"
                className="h-6 w-auto"
              />
            </div>

            {/* 联系信息组：行内紧凑布局，图标与文字垂直居中对齐 */}
            <div className="space-y-2">
              {/* 公司名称 */}
              <div className="flex items-center gap-3">
                <Building2
                  strokeWidth={1}
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
                />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  福建环宇通科技有限公司
                </p>
              </div>

              {/* 地址 */}
              <div className="flex items-center gap-3">
                <MapPin
                  strokeWidth={1}
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
                />
                <p className="text-sm text-secondary">
                  中国福建省丰泽市雨城区办公楼
                </p>
              </div>

              {/* 电话 */}
              <div className="flex items-center gap-3">
                <Phone
                  strokeWidth={1}
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
                />
                <p className="text-sm text-secondary">0086-15906005001</p>
              </div>

              {/* 邮箱 */}
              <div className="flex items-center gap-3">
                <Mail
                  strokeWidth={1}
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
                />
                <a href="mailto:hyt@huanyutong.com" className="text-sm link">
                  hyt@huanyutong.com
                </a>
              </div>
            </div>

            {/* 社交媒体链接 */}
            <div className="pt-2">
              <h3 className="heading-4 mb-3">关注我们</h3>
              <div className="flex gap-3">
                {/* Facebook */}
                <SocialIcon
                  url="https://www.facebook.com/meeyi.intercom"
                  network="facebook"
                  target="_blank"
                  rel="noreferrer"
                  label="Facebook"
                  style={{ height: 28, width: 28 }}
                />

                {/* X (Twitter) */}
                <SocialIcon
                  url="https://twitter.com/MEEYI_HYT"
                  network="x"
                  target="_blank"
                  rel="noreferrer"
                  label="X (Twitter)"
                  style={{ height: 28, width: 28 }}
                />

                {/* YouTube */}
                <SocialIcon
                  url="https://youtube.com/@meeyi1999"
                  network="youtube"
                  target="_blank"
                  rel="noreferrer"
                  label="YouTube"
                  style={{ height: 28, width: 28 }}
                />

                {/* WhatsApp */}
                <SocialIcon
                  url="https://wa.me/8615392123519?text="
                  network="whatsapp"
                  target="_blank"
                  rel="noreferrer"
                  label="WhatsApp"
                  style={{ height: 28, width: 28 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
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
