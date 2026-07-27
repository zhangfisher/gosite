export default function HeroCenterText() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
          使用我们的优质组件构建您的下一个应用
        </h1>
        <p className="mt-6 text-muted">
          丰富的组件库，让开发变得简单高效。快速搭建现代化的用户界面。
        </p>
        <button
          className="px-5 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize rounded-lg lg:mx-0 lg:w-auto focus:outline-none hover:opacity-90"
          style={{ backgroundColor: 'var(--color-theme-600)' }}
        >
          开始14天免费试用
        </button>
        <p className="mt-3 text-sm text-gray-400">无需信用卡</p>
      </div>
      <div className="flex justify-center mt-10">
        <img
          className="object-cover w-full h-96 rounded-xl lg:w-4/5"
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
          alt="应用展示图"
        />
      </div>
    </div>
  );
}