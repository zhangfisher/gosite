export default function FooterLinksRow() {
  const links = ['概述', '功能', '价格', '招聘', '帮助', '隐私'];

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center justify-between px-6 py-8 lg:flex-row">
        <a href="#">
          <img className="w-auto h-7" src="https://merakiui.com/images/full-logo.svg" alt="Logo" />
        </a>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">
          © 版权所有 2023 Meraki UI.
        </p>
      </div>
    </footer>
  );
}
