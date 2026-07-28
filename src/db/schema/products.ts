import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { productsTranslations } from './products_translations';

/**
 * 产品表
 *
 * 包含产品的基本信息，包括中英文名称、描述、关键词、图标等
 */
export const products = sqliteTable('products', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 英文名称
	name: text('name').notNull(),

	// 中文标题
	title: text('title').notNull(),

	// 产品简要描述
	description: text('description').notNull(),

	// 关键词（逗号分隔）
	keywords: text('keywords').notNull(),

	// Lucide 图标名称
	icon: text('icon').notNull(),

	// 封面图片地址
	cover: text('cover'),

	// 上传的图片名称列表（JSON 数组格式，存储为 JSON 字符串）
	images: text('images'),

	// 产品介绍内容（Markdown 格式）
	content: text('content').notNull(),

	// 产品介绍内容（HTML 格式）
	html: text('html'),

	// 标星（0-5，0表示无星）
	stars: integer('stars').notNull().default(0),

	// 标签（逗号分隔）
	tags: text('tags'),

	// 视频URL
	video: text('video'),

	// 创建时间
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),

	// 更新时间
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// 定义关系
export const productsRelations = relations(products, ({ many }) => {
	return {
		translations: many(productsTranslations),
	};
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
