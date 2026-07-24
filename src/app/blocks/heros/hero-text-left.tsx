export default function HeroTextLeft() {
  return (
    <div className="px-6 py-16">
      <div className="items-center lg:flex">
        <div className="">
          <div className="lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              选择最佳 <br />
              <span style={{ color: "var(--color-theme-600)" }}>
                服装购物平台
              </span>
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              我们提供最优质的服装选择，为您带来前所未有的购物体验。
              精选品牌，品质保证，让您的每一次购物都充满惊喜。
            </p>
            <button
              className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform rounded-lg lg:w-auto hover:opacity-90 focus:outline-none"
              style={{ backgroundColor: "var(--color-theme-600)" }}
            >
              立即购买
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
          <img
            className="w-full h-full lg:max-w-3xl"
            src="https://merakiui.com/images/components/Catalogue-pana.svg"
            alt="购物目录插图"
          />
        </div>
      </div>
    </div>
  );
}
