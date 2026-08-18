import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { sitesI18n } from './sites_i18n';

/**
 * 站点表
 *
 * 用于存储多站点的基本信息
 */
export const sites = sqliteTable('sites', {
	// 主键（默认生成短随机ID）
	id: text('id').primaryKey().$defaultFn(() => nanoid()),

	// 英文名称，作为URL使用
	name: text('name').notNull().unique(),

	// 标题
	title: text('title').notNull(),

	// Logo图片地址
	logo: text('logo'),

	// 封面图片地址
	cover: text('cover'),

	// 描述:该网站的定位等
	description: text('description'),

	// 关键词（逗号分隔）
	keywords: text('keywords'),

	// 联系信息（JSON格式）
	contacts: text('contacts'),

	// 社交媒体信息（JSON格式）
	socials: text('socials'),

	// 版权信息
	copyright: text('copyright'),

	// 隐私政策
	privacyPolicy: text('privacy_policy'),

	// Cookie声明
	cookieDeclaration: text('cookie_declaration'),

	// 备案信息
	filing: text('filing'),

	// AI 提示词
	prompt: text('prompt'),

	// 点击计数
	click: integer('click').notNull().default(0),

	// 支持的语言列表（逗号分隔）
	languages: text('languages'),

	// 页眉配置（JSON格式，存储页眉的结构和内容）
	header: text('header'),

	// 页脚配置（JSON格式，存储页脚的结构和内容）
	footer: text('footer'),

	// 创建时间
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),

	// 更新时间
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// 定义关系
export const sitesRelations = relations(sites, ({ many }) => ({
		translations: many(sitesI18n),
}));

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
