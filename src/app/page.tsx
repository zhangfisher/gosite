export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="overflow-hidden bg-gray-50 dark:bg-gray-800 sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h1 className="heading-2">
              从一个仪表板管理整个团队
            </h1>

            <p className="text-muted hidden md:mt-4 md:block">
              Orbitly 将您的任务、文档和对话整合到一个工作空间中，让您的团队花更少的时间切换工具，更多的时间发布工作。
            </p>

            <div className="mt-4 md:mt-8">
              <a
                href="#"
                className="btn-primary inline-block"
              >
                开始免费试用
              </a>
            </div>
          </div>
        </div>

        <img
          alt=""
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1160"
          className="h-56 w-full object-cover sm:h-full"
        />
      </section>

      {/* Stats Section */}
      <section>
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-1">快速发展的团队的信赖之选</h2>

            <p className="text-muted mt-4 sm:text-xl">
              从五人初创公司到百人公司，团队选择 Orbitly 来确保每个人都朝着同一个方向前进。
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-glass flex flex-col px-4 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">入驻团队数</dt>
              <dd className="stat-number">1.2万+</dd>
            </div>

            <div className="card-glass flex flex-col px-4 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">集成应用</dt>
              <dd className="stat-number">40+</dd>
            </div>

            <div className="card-glass flex flex-col px-4 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">平均正常运行时间</dt>
              <dd className="stat-number">99.98%</dd>
            </div>

            <div className="card-glass flex flex-col px-4 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">支持响应时间</dt>
              <dd className="stat-number">&lt;2小时</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="container-responsive">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="heading-1">
              团队所需的一切
            </h2>

            <p className="text-secondary mt-4 text-lg text-pretty">
              为快速发展需要结构但不想被繁琐工作束缚的团队而设计。
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card-glass">
              <div className="icon-box">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">实时同步</h3>

              <p className="text-secondary mt-2 text-pretty">
                更改在每个设备上即时出现。
              </p>
            </div>

            <div className="card-glass">
              <div className="icon-box">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">企业级安全</h3>

              <p className="text-secondary mt-2 text-pretty">
                每个层级都内置企业级安全。
              </p>
            </div>

            <div className="card-glass">
              <div className="icon-box">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">高度可配置</h3>

              <p className="text-secondary mt-2 text-pretty">
                适应每个方面以匹配您的品牌和工作流程。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <h2 className="sr-only">定价</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
            <div className="card-accent sm:order-last sm:px-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-primary text-lg font-medium">
                  团队版
                  <span className="sr-only">计划</span>
                </h3>

                <p className="mt-2 sm:mt-4">
                  <strong className="text-primary text-3xl font-bold sm:text-4xl"> ¥200 </strong>

                  <span className="text-secondary text-sm font-medium">/月</span>
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 20 名团队成员 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 无限项目 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 优先支持 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 高级权限 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 审计日志 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 单点登录 </span>
                </li>
              </ul>

              <a
                href="#"
                className="btn-primary mt-8 block rounded-full"
              >
                开始免费试用
              </a>
            </div>

            <div className="card rounded-2xl sm:px-8 lg:p-12">
              <div className="text-center">
                <h3 className="text-primary text-lg font-medium">
                  基础版
                  <span className="sr-only">计划</span>
                </h3>

                <p className="mt-2 sm:mt-4">
                  <strong className="text-primary text-3xl font-bold sm:text-4xl"> ¥80 </strong>

                  <span className="text-secondary text-sm font-medium">/月</span>
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 5 名团队成员 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 3 个项目 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 邮件支持 </span>
                </li>

                <li className="flex items-center gap-1">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="check-icon"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>

                  <span className="text-secondary"> 基础集成 </span>
                </li>
              </ul>

              <a
                href="#"
                className="btn-secondary mt-8 block"
              >
                开始免费试用
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}