import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { productCategories } from './product_categories';
import { relations } from 'drizzle-orm';

/**
 * 产品分类翻译表
 *
 * 用于存储产品分类的多语言翻译内容
 * 每个分类可以有多条翻译记录，每种语言一条
 */
export const productCategoriesTranslations = sqliteTable('product_categories_translations', {
	// 自动主键
	id: integer('id').primaryKey({ autoIncrement: true }),

	// 关联的分类ID（外键）
	productCategoryId: integer('product_category_id').notNull().references(() => productCategories.id, { onDelete: 'cascade' }),

	// 语言代码（如: 'en', 'zh-CN', 'ja' 等）
	language: text('language').notNull(),

	// 翻译名称
	name: text('name').notNull(),

	// 翻译标签（逗号分隔）
	tags: text('tags'),

	// 翻译描述
	description: text('description'),

	// 翻译描述（HTML 格式）
	html: text('html'),
});

export type ProductCategoryTranslation = typeof productCategoriesTranslations.$inferSelect;
export type NewProductCategoryTranslation = typeof productCategoriesTranslations.$inferInsert;

// 定义关系
export const productCategoriesTranslationsRelations = relations(productCategoriesTranslations, ({ one }) => ({
	category: one(productCategories, {
		fields: [productCategoriesTranslations.productCategoryId],
		references: [productCategories.id],
	}),
}));
