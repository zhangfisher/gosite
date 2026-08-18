import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { siteContents } from './site_contents';
import { relations } from 'drizzle-orm';

/**
 * 站点内容翻译表
 *
 * 用于存储站点内容的多语言翻译内容。
 * 仅 title 与 html 需要翻译，其余字段使用主表值。
 * 每个站点内容节点可以有多条翻译记录，每种语言一条。
 */
export const siteContentsI18n = sqliteTable('site_contents_i18n', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 关联的站点内容节点ID（外键）
	siteContentId: integer('site_content_id').notNull().references(() => siteContents.id, { onDelete: 'cascade' }),

	// 语言代码（如: 'en', 'zh-CN', 'ja' 等）
	language: text('language').notNull(),

	// 翻译标题
	title: text('title'),

	// 翻译生成的 HTML 内容
	html: text('html'),
}, (table) => ({
	siteContentLanguageUnique: uniqueIndex('site_contents_i18n_unique').on(table.siteContentId, table.language),
	siteContentIdIndex: uniqueIndex('site_contents_i18n_site_content_id_index').on(table.siteContentId),
	languageIndex: uniqueIndex('site_contents_i18n_language_index').on(table.language),
}));

export type SiteContentI18n = typeof siteContentsI18n.$inferSelect;
export type NewSiteContentI18n = typeof siteContentsI18n.$inferInsert;

// 定义关系
export const siteContentsI18nRelations = relations(siteContentsI18n, ({ one }) => ({
	siteContent: one(siteContents, {
		fields: [siteContentsI18n.siteContentId],
		references: [siteContents.id],
	}),
}));
