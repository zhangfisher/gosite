import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { contents } from './contents';
import { relations } from 'drizzle-orm';

/**
 * 内容翻译表
 *
 * 用于存储内容的多语言翻译内容
 * 每个内容可以有多条翻译记录，每种语言一条
 */
export const contentsI18n = sqliteTable('contents_i18n', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 关联的内容ID（外键）
	contentId: integer('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),

	// 语言代码（如: 'en-US', 'zh-CN', 'ja-JP' 等）
	language: text('language').notNull(),

	// 翻译标题
	title: text('title').notNull(),

	// 翻译内容（Markdown 格式）
	content: text('content').notNull(),

	// 翻译内容（HTML 格式）
	html: text('html'),

	// 翻译标签（逗号分隔）
	tags: text('tags'),
});

export type ContentI18n = typeof contentsI18n.$inferSelect;
export type NewContentI18n = typeof contentsI18n.$inferInsert;

// 定义关系
export const contentsI18nRelations = relations(contentsI18n, ({ one }) => ({
	content: one(contents, {
		fields: [contentsI18n.contentId],
		references: [contents.id],
	}),
}));
