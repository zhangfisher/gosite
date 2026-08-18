import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * AI 会话表
 *
 * 用于保存从外部导入（或运行时创建）的 AI 会话元信息，
 * 字段值多带有「多字段回退」与「缺失丢弃」的导入语义。
 *
 * 时间戳字段统一以「毫秒整数」存储，以保证毫秒精度
 * （区别于本项目其他表使用的 mode:'timestamp' 秒级约定）。
 */
export const conversations = sqliteTable('conversations', {
	// 会话 ID（字符串主键，必需字段，导入时若缺失则整条丢弃）
	id: text('id').primaryKey(),

	// 会话标题（导入时优先取记录 title，否则用首条消息文本生成）
	title: text('title'),

	// 会话预览（摘自 preview / lastMessage / snippet / summary / 首条消息）
	preview: text('preview'),

	// 最后一条消息时间（毫秒时间戳，多字段回退）
	lastMessageAt: integer('last_message_at'),

	// 创建时间（毫秒时间戳）
	createdAt: integer('created_at').notNull().$defaultFn(() => Date.now()),

	// 用户 ID（从记录中读取，必需）
	userId: text('user_id').notNull(),

	// 消息数量
	messageCount: integer('message_count').notNull().default(0),

	// 更新时间（毫秒时间戳）
	updatedAt: integer('updated_at').notNull().$defaultFn(() => Date.now()),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
