import { SocialIcon } from "react-social-icons";

export default function FooterFullSections() {
  const sections = [
    { title: "关于", links: ["公司", "社区", "招聘"] },
    { title: "博客", links: ["技术", "音乐", "视频"] },
    { title: "产品", links: ["云端存储", "Aperion UI", "Meraki UI"] },
  ];

  return (
    <footer className="surface">
      <div className="p-6">
        <div className="lg:flex">
          <div className="w-full -mx-6 lg:w-2/5">
            <div className="px-6">
              <a href="#">
                <img className="w-auto h-6" src="/images/logo.png" alt="Logo" />
              </a>
              <p className="max-w-sm mt-2 text-gray-500 dark:text-gray-400">
                加入超过31,000名用户，获取最新技巧、教程和更多内容。
              </p>
              <div className="flex mt-6 -mx-2">
                <a
                  href="#"
                  className="mx-2 link"
                >
                  <SocialIcon
                    network="Github"
                    style={{ height: 20, width: 20 }}
                  />
                </a>
                <a
                  href="#"
                  className="mx-2 link"
                >
                  <SocialIcon
                    network="Facebook"
                    style={{ height: 20, width: 20 }}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-gray-700 uppercase dark:text-white">
                    {section.title}
                  </h3>
                  {section.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              ))}
              <div>
                <h3 className="text-gray-700 uppercase dark:text-white">
                  联系方式
                </h3>
                <span className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  +1 526 654 8965
                </span>
                <span className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                  example@email.com
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr className="h-px my-3 bg-gray-200 border-none dark:bg-gray-700" />
        <div>
          <p className="text-center text-gray-500 dark:text-gray-400">
            © Brand 2020 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
