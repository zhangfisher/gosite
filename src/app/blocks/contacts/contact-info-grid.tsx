import { Clock, MapPin, Briefcase, Phone } from 'lucide-react';

export default function ContactInfoGrid() {
  const contacts = [
    { icon: Clock, title: '办公时间', desc: '周一至周五 8:00 am - 5:00 pm' },
    { icon: MapPin, title: '我们的地址', desc: '中国某省某市某区某街道123号' },
    { icon: Briefcase, title: '分办公室', desc: '中国某省某市某区某街道456号' },
    { icon: Phone, title: '联系电话', desc: '+86 138-0000-0000 +86 139-0000-0000' }
  ];

  return (
    <div className="py-8 sm:py-16 lg:py-24" style={{ backgroundColor: 'var(--color-gray-100)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto mb-12 w-fit sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-gray-800 dark:text-white">
            联系我们
          </h2>
          <span className="absolute start-0 top-9 h-1 w-full rounded-full bg-gradient-to-r from-theme-600/20 to-theme-600/5"></span>
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src="https://cdn.flyonui.com/fy-assets/blocks/marketing-ui/contact/contact-8.png"
            alt="联系插图"
            className="size-full"
          />
          <div>
            <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
              我们很乐意帮助您！
            </h3>
            <p className="mb-10 text-lg font-medium text-gray-600 dark:text-gray-400">
              我们提供专业的UI组件库，帮助您创建真正专业的网站、落地页面或管理后台。
              无论是SaaS项目还是其他业务需求，我们都能提供完美解决方案。
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {contacts.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--color-theme-600)' }}>
                      <item.icon className="w-6 h-6" style={{ color: 'var(--color-theme-600)' }} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white">{item.title}</h4>
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
