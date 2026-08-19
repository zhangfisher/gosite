/**
 * AiChatManager 单例
 *
 * 管理器在内存中维护活跃对话集合，必须是进程级单例（避免重复实例化导致
 * 活跃对话追踪失效）。存于 globalThis 以兼容开发模式热重载。
 */
import { AiChatManager } from "./AiChatManager";
import { AiRequestAgent } from "./AiRequestAgent";

declare global {
	// eslint-disable-next-line no-var
	var __aiChatManager: AiChatManager | undefined;
	// eslint-disable-next-line no-var
	var __aiRequestAgent: AiRequestAgent | undefined;
}

export function getAiChatManager(): AiChatManager {
	if (!globalThis.__aiChatManager) {
		globalThis.__aiChatManager = new AiChatManager();
	}
	return globalThis.__aiChatManager;
}

export function getAiRequestAgent(): AiRequestAgent {
	if (!globalThis.__aiRequestAgent) {
		globalThis.__aiRequestAgent = new AiRequestAgent();
	}
	return globalThis.__aiRequestAgent;
}

/** 运行时热更新一次性 AI 请求代理（重建实例池，使最新配置 / 提示词生效） */
export async function reloadAiRequestAgent(): Promise<void> {
	return getAiRequestAgent().reload();
}

export { AiChatManager } from "./AiChatManager";
export { AiRequestAgent } from "./AiRequestAgent";
export type { ChatConversation, ChatRequest } from "./types";
export type { AiRequestResult, AsyncRequestEntry, AsyncRequestStatus } from "./AiRequestAgent";
