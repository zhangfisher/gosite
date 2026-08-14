export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* 背景图片 */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/restaurant_technology_wireless_modern_service_wVoP_Q2Bg_A.jpg"
            alt="智慧餐厅科技"
            className="h-full w-full object-cover"
          />
          {/* 遮罩层 - 确保文字可读性 */}
          <div className="absolute inset-0 bg-linear-to-br from-white/95 via-white/90 to-gray-100/85 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/85"></div>
        </div>

        <div className="container-responsive">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="heading-1 text-4xl md:text-5xl lg:text-6xl">
              美一智慧餐厅科技
            </h1>

            <p className="text-secondary mt-6 text-xl md:text-2xl">
              专业的无线呼叫器系列产品，为餐厅提供智能化解决方案
            </p>

            <p className="text-muted mt-4 text-lg">
              减少排队 · 提高满意度 · 增加利润
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#solutions"
                className="btn-primary inline-block"
              >
                了解解决方案
              </a>
              <a
                href="#contact"
                className="btn-secondary inline-block"
              >
                联系我们
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-12">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-1">
              智能化解决方案
            </h2>

            <p className="text-secondary mt-4 text-lg">
              为餐厅提供全方位的无线呼叫系统，让服务更高效，顾客更满意
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* 无线访客寻呼系统 */}
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
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 1-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 0-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">无线访客寻呼系统</h3>

              <p className="text-secondary mt-3 text-pretty">
                完美解决顾客排队点餐等待问题。由驻场振动器和键盘组成，传输距离超过1公里，顾客可在1公里范围内自由活动，点餐完成立即收到提醒。
              </p>

              <ul className="text-muted mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>传输距离超过1公里</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>优质零部件，品质稳定</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>振动提醒，不会遗漏</span>
                </li>
              </ul>
            </div>

            {/* 无线服务员呼叫系统 */}
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">无线服务员呼叫系统</h3>

              <p className="text-secondary mt-3 text-pretty">
                告别举手和大声叫喊，让餐厅环境更优雅。由呼叫按钮、服务员手表和柜台显示屏组成，顾客与服务员沟通变得快捷安静。
              </p>

              <ul className="text-muted mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>桌面呼叫按钮，操作简单</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>手表和显示屏同步提示</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>提升用餐体验</span>
                </li>
              </ul>
            </div>

            {/* 无线厨房呼叫系统 */}
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
                    d="M9.348 14.651a3.75 3.75 0 0 1 0-5.303m5.304 0a3.75 3.75 0 0 1 0 5.303m-7.425 2.122a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>

              <h3 className="heading-3 mt-4">无线厨房呼叫系统</h3>

              <p className="text-secondary mt-3 text-pretty">
                在服务员呼叫系统基础上创新升级，增加厨房键盘。厨房可通知服务员餐点已准备好，确保顾客品尝到最新鲜美味的佳肴。
              </p>

              <ul className="text-muted mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>厨房键盘直接通知服务员</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>餐点及时上桌，保持最佳口感</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="check-icon mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>红色紧急按钮，快速响应</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-1">
              核心优势
            </h2>

            <p className="text-secondary mt-4 text-lg">
              为什么选择美一智慧餐厅解决方案
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-glass text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-theme-100)]">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-[var(--color-theme-700)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              <h3 className="heading-3">超远传输距离</h3>
              <p className="text-muted mt-2 text-sm">
                传输距离超过1公里，覆盖整个餐厅及周边区域
              </p>
            </div>

            <div className="card-glass text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-theme-100)]">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-[var(--color-theme-700)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <h3 className="heading-3">高品质稳定</h3>
              <p className="text-muted mt-2 text-sm">
                采用优质零部件和材料，确保系统长期稳定运行
              </p>
            </div>

            <div className="card-glass text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--color-theme-100)]">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-[var(--color-theme-700)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <h3 className="heading-3">快捷安静</h3>
              <p className="text-muted mt-2 text-sm">
                无声呼叫，保持优雅用餐环境，提升顾客体验
              </p>
            </div>

            <div className="card-glass text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--theme-color-100)]">
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 text-[var(--color-theme-700)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1 3 0m-3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
              </div>
              <h3 className="heading-3">提高效率</h3>
              <p className="text-muted mt-2 text-sm">
                优化服务流程，提高服务效率和顾客满意度
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Value Section - 数字化展示 */}
      <section>
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="heading-1">
              为您带来的价值
            </h2>

            <p className="text-secondary mt-4 text-lg">
              数字化成果，看得见的改变
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="card-glass px-6 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">减少排队时间</dt>
              <dd className="stat-number">60%</dd>
              <p className="text-muted mt-2 text-sm">
                顾客利用等待时间做其他事情，不再焦虑等待
              </p>
            </div>

            <div className="card-glass px-6 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">提高客户满意度</dt>
              <dd className="stat-number">85%</dd>
              <p className="text-muted mt-2 text-sm">
                快速安静的服务响应，提升整体用餐体验
              </p>
            </div>

            <div className="card-glass px-6 py-8 text-center">
              <dt className="text-muted order-last text-lg font-medium">增加餐厅利润</dt>
              <dd className="stat-number">40%</dd>
              <p className="text-muted mt-2 text-sm">
                提高翻台率，优化服务流程，增加营收
              </p>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative overflow-hidden bg-linear-to-br from-(--color-theme-600) via-(--color-theme-700) to-(--color-theme-800) dark:from-(--color-theme-950) dark:via-(--color-theme-900) dark:to-(--color-theme-800)">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border-2 border-white/20 bg-white/5 p-8 text-center shadow-xl backdrop-blur-sm sm:p-12">
              <h2 className="heading-1 text-white">
                准备好升级您的餐厅了吗？
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                立即联系我们，获取专业的智慧餐厅解决方案，让您的餐厅在竞争中脱颖而出
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <a
                  href="tel:400-888-8888"
                  className="btn-primary inline-block"
                >
                  📞 400-888-8888
                </a>
                <a
                  href="#"
                  className="btn-secondary inline-block bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  在线咨询
                </a>
              </div>

              <p className="mx-auto mt-6 max-w-2xl text-sm text-white/80">
                或发送邮件至 <a href="mailto:contact@meeyi.com" className="text-(--color-theme-100) underline">contact@meeyi.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
