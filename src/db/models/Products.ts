import type { DrizzleDb } from '@/db';
import { products } from '../schema';
import type { Product, NewProduct } from '../schema';
import { eq, desc, like, or, gte, sql } from 'drizzle-orm';

/**
 * 产品 CRUD 管理器
 *
 * 提供对产品表的完整增删改查操作
 */
export function getProducts(db: DrizzleDb) {
	return {
		/**
		 * 创建新产品
		 *
		 * @param product - 产品数据（不需要 id，会自动生成）
		 * @returns 新创建的产品
		 */
		async create(product: NewProduct): Promise<Product> {
			const [newProduct] = await db.insert(products).values(product).returning();
			return newProduct;
		},

		/**
		 * 批量创建产品
		 *
		 * @param productsData - 产品数据数组
		 * @returns 新创建的产品数组
		 */
		async createMany(productsData: NewProduct[]): Promise<Product[]> {
			return await db.insert(products).values(productsData).returning();
		},

		/**
		 * 根据 ID 查找产品
		 *
		 * @param id - 产品 ID
		 * @returns 产品数据，如果不存在则返回 null
		 */
		async findById(id: number): Promise<Product | null> {
			const [product] = await db
				.select()
				.from(products)
				.where(eq(products.id, id))
				.limit(1);
			return product || null;
		},

		/**
		 * 查找所有产品
		 *
		 * @param options - 查询选项
		 * @returns 产品数组
		 */
		async findAll(options?: {
			limit?: number;
			offset?: number;
			orderBy?: 'asc' | 'desc';
		}): Promise<Product[]> {
			const { limit, offset, orderBy = 'desc' } = options || {};

			const orderByClause = orderBy === 'asc' ? products.createdAt : desc(products.createdAt);

			if (limit !== undefined && offset !== undefined) {
				return await db
					.select()
					.from(products)
					.orderBy(orderByClause)
					.limit(limit)
					.offset(offset);
			}

			if (limit !== undefined) {
				return await db
					.select()
					.from(products)
					.orderBy(orderByClause)
					.limit(limit);
			}

			return await db
				.select()
				.from(products)
				.orderBy(orderByClause);
		},

		/**
		 * 根据名称搜索产品（模糊匹配）
		 *
		 * @param searchTerm - 搜索关键词
		 * @returns 匹配的产品数组
		 */
		async searchByName(searchTerm: string): Promise<Product[]> {
			return await db
				.select()
				.from(products)
				.where(
					or(
						like(products.name, `%${searchTerm}%`),
						like(products.title, `%${searchTerm}%`)
					)
				);
		},

		/**
		 * 根据标签搜索产品
		 *
		 * @param tag - 标签名称
		 * @returns 包含该标签的产品数组
		 */
		async findByTag(tag: string): Promise<Product[]> {
			// 使用 SQL 的 LIKE 查询来搜索包含指定标签的产品
			return await db
				.select()
				.from(products)
				.where(like(products.tags, `%${tag}%`));
		},

		/**
		 * 更新产品
		 *
		 * @param id - 产品 ID
		 * @param data - 要更新的数据
		 * @returns 更新后的产品，如果不存在则返回 null
		 */
		async update(id: number, data: Partial<NewProduct>): Promise<Product | null> {
			const [updatedProduct] = await db
				.update(products)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(products.id, id))
				.returning();

			return updatedProduct || null;
		},

		/**
		 * 删除产品
		 *
		 * @param id - 产品 ID
		 * @returns 是否删除成功
		 */
		async delete(id: number): Promise<boolean> {
			const result = await db
				.delete(products)
				.where(eq(products.id, id))
				.returning();
			return result.length > 0;
		},

		/**
		 * 统计产品总数
		 *
		 * @returns 产品总数
		 */
		async count(): Promise<number> {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(products);
			return Number(result[0]?.count || 0);
		},

		/**
		 * 获取标星产品
		 *
		 * @param minStars - 最小星级（默认 1）
		 * @returns 标星产品数组
		 */
		async findStarred(minStars: number = 1): Promise<Product[]> {
			return await db
				.select()
				.from(products)
				.where(gte(products.stars, minStars))
				.orderBy(desc(products.stars));
		},
	};
}
