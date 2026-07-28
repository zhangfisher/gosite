import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';
import { products } from './products';
import { productCategories } from './product_categories';

/**
 * 产品分类关联表（中间表）
 *
 * 用于实现产品和分类的多对多关系
 */
export const productCategoryRelations = sqliteTable('product_category_relations', {
	// 产品ID（外键）
	productId: integer('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),

	// 分类ID（外键）
	categoryId: integer('category_id')
		.notNull()
		.references(() => productCategories.id, { onDelete: 'cascade' }),

	// 创建时间
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type ProductCategoryRelation = typeof productCategoryRelations.$inferSelect;
export type NewProductCategoryRelation = typeof productCategoryRelations.$inferInsert;