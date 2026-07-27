import { SocialIcon } from "react-social-icons";

export default function FooterSubscribeForm() {
  const sections = [
    { title: "Quick Link", links: ["Home", "Who We Are", "Our Philosophy"] },
    {
      title: "Industries",
      links: [
        "Retail & E-Commerce",
        "Information Technology",
        "Finance & Insurance",
      ],
    },
  ];

  return (
    <footer className="surface">
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <h1 className="max-w-lg heading-2 tracking-tight xl:text-2xl">
              Subscribe our newsletter to get update.
            </h1>
            <div className="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
              <input
                id="email"
                type="text"
                className="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                placeholder="Email Address"
                style={
                  {
                    "--tw-ring-color": "var(--color-theme-300)",
                  } as React.CSSProperties
                }
              />
              <button
                className="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none rounded-lg hover:opacity-90 focus:ring focus:ring-opacity-80"
                style={
                  {
                    backgroundColor: "var(--color-gray-800)",
                    "--tw-ring-color": "var(--color-gray-300)",
                  } as React.CSSProperties
                }
              >
                Subscribe
              </button>
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-gray-800 dark:text-white">
                {section.title}
              </p>
              <div className="flex flex-col items-start mt-5 space-y-2">
                {section.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="link hover:underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr className="my-3 border-gray-200 md:my-8 dark:border-gray-700" />
        <div className="flex items-center justify-between">
          <a href="#">
            <img className="w-auto h-6" src="/images/logo.png" alt="" />
          </a>
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
              <SocialIcon
                network="Facebook"
                style={{ height: 20, width: 20 }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
