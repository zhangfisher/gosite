import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { productCategoriesTranslations } from './product_categories_translations';

/**
 * 产品分类表
 *
 * 使用嵌套集合模型（Nested Set Model）来管理树形分类结构
 * 通过 left 和 right 值来实现层级关系
 */
export const productCategories = sqliteTable('product_categories', {
	// 自动主键
	id: integer('id').primaryKey(),

	// 节点名称
	name: text('name').notNull(),

	// 节点层级，0代表根节点，1-N代表第N级节点
	level: integer('level').notNull(),

	// 左值（用于嵌套集合模型）
	left: integer('left').notNull(),

	// 右值（用于嵌套集合模型）
	right: integer('right').notNull(),

	// 创建时间（使用 SQL 默认值）
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),

	// 更新时间（使用 SQL 默认值）
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),

	// 图标
	icon: text('icon'),

	// 封面图片地址
	cover: text('cover'),

	// 上传的图片名称列表（JSON 数组格式，存储为 JSON 字符串）
	images: text('images'),

	// 节点完整描述
	description: text('description'),

	// 分类描述（HTML 格式）
	html: text('html'),

	// 标星（0-5，0表示无星）
	stars: integer('stars').notNull().default(0),

	// 标签（逗号分隔）
	tags: text('tags'),

	// 视频URL
	video: text('video'),

	// URL地址
	url: text('url'),
});

// 定义关系
export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
	translations: many(productCategoriesTranslations),
}));

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;