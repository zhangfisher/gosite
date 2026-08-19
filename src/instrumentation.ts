/**
 * 应用启动钩子
 *
 * `register` 在 Next.js 服务实例启动时调用一次，且必须在服务就绪前完成。
 * 这里用于在启动时加载管理员的全局配置（AdminSettings）。
 */
export async function register() {
	// 仅在 Node 运行时加载（避免 Edge 运行时引入 bun:sqlite）
	if (process.env.NEXT_RUNTIME !== "edge") {
		try {
			const { initAdminSettings } = await import("@/lib/settings");
			await initAdminSettings();
		} catch (error) {
			console.error("❌ 启动加载 AdminSettings 失败:", error);
		}

		// 预热一次性 AI 请求代理实例池（避免每次请求重复创建 agent 的开销）。
		// 若尚未配置 AI provider，则静默跳过，留待首次请求时惰性预热。
		try {
			const { getAiRequestAgent } = await import("@/ai");
			await getAiRequestAgent().warm();
		} catch (error) {
			console.warn("⚠️ 启动预热 AI 请求代理失败（将在首次请求时重试）:", error);
		}
	}
}
