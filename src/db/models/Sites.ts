import type { DrizzleDb } from '@/db';
import { sites, sitesTranslations } from '../schema';
import type { Site, NewSite, SiteTranslation, NewSiteTranslation } from '../schema';
import { eq, desc, like, or, sql, and } from 'drizzle-orm';

/**
 * 站点 CRUD 管理器
 *
 * 提供对站点表的完整增删改查操作
 */
export function getSites(db: DrizzleDb) {
	return {
		/**
		 * 创建新站点
		 *
		 * @param site - 站点数据（不需要 id，会自动生成）
		 * @returns 新创建的站点
		 */
		async create(site: NewSite): Promise<Site> {
			const [newSite] = await db.insert(sites).values(site).returning();
			return newSite;
		},

		/**
		 * 根据 ID 查找站点
		 *
		 * @param id - 站点 ID
		 * @returns 站点数据，如果不存在则返回 null
		 */
		async findById(id: number): Promise<Site | null> {
			const [site] = await db
				.select()
				.from(sites)
				.where(eq(sites.id, id))
				.limit(1);
			return site || null;
		},

		/**
		 * 根据名称查找站点
		 *
		 * @param name - 站点名称
		 * @returns 站点数据，如果不存在则返回 null
		 */
		async findByName(name: string): Promise<Site | null> {
			const [site] = await db
				.select()
				.from(sites)
				.where(eq(sites.name, name))
				.limit(1);
			return site || null;
		},

		/**
		 * 查找所有站点
		 *
		 * @param options - 查询选项
		 * @returns 站点数组
		 */
		async findAll(options?: {
			limit?: number;
			offset?: number;
			orderBy?: 'asc' | 'desc';
		}): Promise<Site[]> {
			const { limit, offset, orderBy = 'desc' } = options || {};

			const orderByClause = orderBy === 'asc' ? sites.createdAt : desc(sites.createdAt);

			if (limit !== undefined && offset !== undefined) {
				return await db
					.select()
					.from(sites)
					.orderBy(orderByClause)
					.limit(limit)
					.offset(offset);
			}

			if (limit !== undefined) {
				return await db
					.select()
					.from(sites)
					.orderBy(orderByClause)
					.limit(limit);
			}

			return await db
				.select()
				.from(sites)
				.orderBy(orderByClause);
		},

		/**
		 * 搜索站点（模糊匹配标题或描述）
		 *
		 * @param searchTerm - 搜索关键词
		 * @returns 匹配的站点数组
		 */
		async search(searchTerm: string): Promise<Site[]> {
			return await db
				.select()
				.from(sites)
				.where(
					or(
						like(sites.name, `%${searchTerm}%`),
						like(sites.title, `%${searchTerm}%`),
						like(sites.description, `%${searchTerm}%`)
					)
				);
		},

		/**
		 * 更新站点
		 *
		 * @param id - 站点 ID
		 * @param data - 要更新的数据
		 * @returns 更新后的站点，如果不存在则返回 null
		 */
		async update(id: number, data: Partial<NewSite>): Promise<Site | null> {
			const [updatedSite] = await db
				.update(sites)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(sites.id, id))
				.returning();

			return updatedSite || null;
		},

		/**
		 * 删除站点
		 *
		 * @param id - 站点 ID
		 * @returns 是否删除成功
		 */
		async delete(id: number): Promise<boolean> {
			const result = await db
				.delete(sites)
				.where(eq(sites.id, id))
				.returning();
			return result.length > 0;
		},

		/**
		 * 统计站点总数
		 *
		 * @returns 站点总数
		 */
		async count(): Promise<number> {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(sites);
			return Number(result[0]?.count || 0);
		},

		/**
		 * 获取站点的翻译
		 *
		 * @param siteId - 站点 ID
		 * @param language - 语言代码（可选）
		 * @returns 翻译数组
		 */
		async getTranslations(siteId: number, language?: string): Promise<SiteTranslation[]> {
			const conditions = [eq(sitesTranslations.siteId, siteId)];

			if (language) {
				conditions.push(eq(sitesTranslations.language, language));
			}

			return await db
				.select()
				.from(sitesTranslations)
				.where(and(...conditions));
		},

		/**
		 * 创建站点翻译
		 *
		 * @param translation - 翻译数据
		 * @returns 新创建的翻译
		 */
		async createTranslation(translation: NewSiteTranslation): Promise<SiteTranslation> {
			const [newTranslation] = await db.insert(sitesTranslations).values(translation).returning();
			return newTranslation;
		},

		/**
		 * 更新站点翻译
		 *
		 * @param id - 翻译 ID
		 * @param data - 要更新的数据
		 * @returns 更新后的翻译，如果不存在则返回 null
		 */
		async updateTranslation(id: number, data: Partial<NewSiteTranslation>): Promise<SiteTranslation | null> {
			const [updatedTranslation] = await db
				.update(sitesTranslations)
				.set(data)
				.where(eq(sitesTranslations.id, id))
				.returning();

			return updatedTranslation || null;
		},

		/**
		 * 删除站点翻译
		 *
		 * @param id - 翻译 ID
		 * @returns 是否删除成功
		 */
		async deleteTranslation(id: number): Promise<boolean> {
			const result = await db
				.delete(sitesTranslations)
				.where(eq(sitesTranslations.id, id))
				.returning();
			return result.length > 0;
		},
	};
}
