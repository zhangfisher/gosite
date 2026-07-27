import { SocialIcon } from "react-social-icons";

export default function FooterSimple() {
  return (
    <footer className="surface">
      <div className="flex flex-col items-center justify-between p-6 space-y-4 sm:space-y-0 sm:flex-row">
        <a href="#">
          <img className="w-auto h-6" src="/images/logo.png" alt="Logo" />
        </a>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          © 版权所有 2021. 保留所有权利.
        </p>
        <div className="flex -mx-2">
          <a
            href="#"
            className="mx-2 link"
          >
            <SocialIcon network="Github" style={{ height: 20, width: 20 }} />
          </a>
          <a
            href="#"
            className="mx-2 link"
          >
            <SocialIcon network="Facebook" style={{ height: 20, width: 20 }} />
          </a>
        </div>
      </div>
    </footer>
  );
}
