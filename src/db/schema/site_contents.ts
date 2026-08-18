import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sites } from './sites';
import { contents } from './contents';
import { siteContentsI18n } from './site_contents_i18n';
import { relations } from 'drizzle-orm';

/**
 * 站点内容表（多树表）
 *
 * 基于 flextree 的嵌套集合模型存储每个站点的多棵树。
 * 每个站点（siteId）对应一棵或多棵树（treeId === siteId），
 * 树中的节点可指向 contents 表中的一条内容（1:1）。
 */
export const siteContents = sqliteTable('site_contents', {
	// 节点主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 站点ID，同时作为 flextree 的 treeId（多树表的外键分区键）
	siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),

	// 指向 contents 表的内容ID（1:1）
	contentId: integer('content_id').references(() => contents.id, { onDelete: 'cascade' }),

	// 英文名称，通常用作 URL
	name: text('name'),

	// 中文或友好标题
	title: text('title'),

	// 是否显示为导航菜单项
	isMenu: integer('is_menu').notNull().default(0),

	// 是否隐藏
	visible: integer('visible').notNull().default(1),

	// 访问是否需要登录
	isAuth: integer('is_auth').notNull().default(0),

	// AI 提示词
	prompt: text('prompt'),

	// 生成的 HTML 内容
	html: text('html'),

	// 布局配置（JSON格式，存储页面布局结构）
	layout: text('layout'),

	// 点击次数
	click: integer('click').notNull().default(0),

	// 嵌套集合模型：左值
	leftValue: integer('left_value').notNull(),

	// 嵌套集合模型：右值
	rightValue: integer('right_value').notNull(),

	// 嵌套集合模型：层级（0 为根）
	level: integer('level').notNull(),

	// 创建时间
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),

	// 更新时间
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type SiteContent = typeof siteContents.$inferSelect;
export type NewSiteContent = typeof siteContents.$inferInsert;

// 定义关系
export const siteContentsRelations = relations(siteContents, ({ one, many }) => ({
	site: one(sites, {
		fields: [siteContents.siteId],
		references: [sites.id],
	}),
	content: one(contents, {
		fields: [siteContents.contentId],
		references: [contents.id],
	}),
	translations: many(siteContentsI18n),
}));
