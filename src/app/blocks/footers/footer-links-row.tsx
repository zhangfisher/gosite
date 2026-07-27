export default function FooterLinksRow() {
  const links = ["概述", "功能", "价格", "招聘", "帮助", "隐私"];

  return (
    <footer className="surface">
      <div className="flex flex-col items-center justify-between px-6 py-8 lg:flex-row">
        <a href="#">
          <img className="w-auto h-6" src="/images/logo.png" alt="Logo" />
        </a>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm link"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">
          © 版权所有 2026~ HuanYuTong
        </p>
      </div>
    </footer>
  );
}
