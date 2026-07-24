export default function HeroBackground() {
  return (
    <div
      className="w-full bg-center bg-cover "
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80)`,
      }}
    >
      <div className="flex items-center justify-center bg-gray-900/40">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white lg:text-4xl">
            构建您的全新{" "}
            <span style={{ color: "var(--color-theme-400)" }}>SaaS</span> 项目
          </h1>
          <button
            className="w-full px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 transform rounded-md lg:w-auto hover:opacity-90 focus:outline-none"
            style={{ backgroundColor: "var(--color-theme-600)" }}
          >
            开始项目
          </button>
        </div>
      </div>
    </div>
  );
}
