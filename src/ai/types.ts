/**
 * AI 聊天相关共享类型
 *
 * 后端 (`src/ai`) 与前端 (`components/aichat`) 共用的轻量类型定义。
 * 会话元数据直接复用数据库 `Conversation` 类型。
 */
import type { Conversation } from "@/db/schema";

/** 会话元数据（对前端暴露的子集，等价于数据库 conversations 行） */
export type ChatConversation = Conversation;

/** 新建会话请求 */
export interface CreateConversationRequest {
	/** 可选初始标题 */
	title?: string;
}

/** 聊天请求（来自前端 useChat 的 POST body 经提取后） */
export interface ChatRequest {
	/** 后端会话 ID（conversations.id） */
	conversationId: string;
	/** 当前用户 ID（用于隔离会话） */
	userId: string;
	/** 用户本轮输入文本 */
	prompt: string;
}

/** 后端聊天错误（以 UIMessageStream error part 形式下发） */
export interface ChatError {
	code: "NO_PROVIDER" | "CONCURRENCY_LIMIT" | "CONVERSATION_NOT_FOUND" | "AGENT_ERROR";
	message: string;
}
