import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sites } from './sites';
import { relations } from 'drizzle-orm';

/**
 * 站点翻译表
 *
 * 用于存储站点的多语言翻译内容
 * 每个站点可以有多条翻译记录，每种语言一条
 */
export const sitesI18n = sqliteTable('sites_i18n', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 关联的站点ID（外键）
	siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),

	// 语言代码（如: 'en', 'zh-CN', 'ja' 等）
	language: text('language').notNull(),

	// 翻译标题
	title: text('title'),

	// 翻译关键词
	keywords: text('keywords'),

	// 翻译描述
	description: text('description'),

	// 翻译联系信息（JSON格式）
	contacts: text('contacts'),

	// 翻译社交媒体信息（JSON格式）
	socials: text('socials'),

	// 翻译版权信息
	copyright: text('copyright'),

	// 翻译隐私政策
	privacyPolicy: text('privacy_policy'),

	// 翻译Cookie声明
	cookieDeclaration: text('cookie_declaration'),

	// 翻译备案信息
	filing: text('filing'),

	// 翻译页眉配置（JSON格式，存储页眉的翻译内容）
	header: text('header'),

	// 翻译页脚配置（JSON格式，存储页脚的翻译内容）
	footer: text('footer'),
});

export type SiteI18n = typeof sitesI18n.$inferSelect;
export type NewSiteI18n = typeof sitesI18n.$inferInsert;

// 定义关系
export const sitesI18nRelations = relations(sitesI18n, ({ one }) => ({
	site: one(sites, {
		fields: [sitesI18n.siteId],
		references: [sites.id],
	}),
}));
