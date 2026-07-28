import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { relations } from 'drizzle-orm';

/**
 * 产品翻译表
 *
 * 用于存储产品的多语言翻译内容
 * 每个产品可以有多条翻译记录，每种语言一条
 */
export const productsTranslations = sqliteTable('products_translations', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 关联的产品ID（外键）
	productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),

	// 语言代码（如: 'en', 'zh-CN', 'ja' 等）
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

export type ProductTranslation = typeof productsTranslations.$inferSelect;
export type NewProductTranslation = typeof productsTranslations.$inferInsert;

// 定义关系
export const productsTranslationsRelations = relations(productsTranslations, ({ one }) => ({
	product: one(products, {
		fields: [productsTranslations.productId],
		references: [products.id],
	}),
}));
