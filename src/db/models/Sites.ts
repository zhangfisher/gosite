import type { DrizzleDb } from '@/db';
import { sites, sitesI18n } from '../schema';
import type { Site, NewSite, SiteI18n, NewSiteI18n } from '../schema';
import { eq, desc, like, or, sql, and } from 'drizzle-orm';

/**
 * 绔欑偣 CRUD 绠＄悊鍣? *
 * 鎻愪緵瀵圭珯鐐硅〃鐨勫畬鏁村鍒犳敼鏌ユ搷浣? */
export function getSites(db: DrizzleDb) {
	return {
		/**
		 * 鍒涘缓鏂扮珯鐐?		 *
		 * @param site - 绔欑偣鏁版嵁锛堜笉闇€瑕?id锛屼細鑷姩鐢熸垚锛?		 * @returns 鏂板垱寤虹殑绔欑偣
		 */
		async create(site: NewSite): Promise<Site> {
			const [newSite] = await db.insert(sites).values(site).returning();
			return newSite;
		},

		/**
		 * 鏍规嵁 ID 鏌ユ壘绔欑偣
		 *
		 * @param id - 绔欑偣 ID
		 * @returns 绔欑偣鏁版嵁锛屽鏋滀笉瀛樺湪鍒欒繑鍥?null
		 */
		async findById(id: number): Promise<Site | null> {
			const [site] = await db
				.select()
				.from(sites)
				.where(eq(sites.id, String(id)))
				.limit(1);
			return site || null;
		},

		/**
		 * 鏍规嵁鍚嶇О鏌ユ壘绔欑偣
		 *
		 * @param name - 绔欑偣鍚嶇О
		 * @returns 绔欑偣鏁版嵁锛屽鏋滀笉瀛樺湪鍒欒繑鍥?null
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
		 * 鏌ユ壘鎵€鏈夌珯鐐?		 *
		 * @param options - 鏌ヨ閫夐」
		 * @returns 绔欑偣鏁扮粍
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
		 * 鎼滅储绔欑偣锛堟ā绯婂尮閰嶆爣棰樻垨鎻忚堪锛?		 *
		 * @param searchTerm - 鎼滅储鍏抽敭璇?		 * @returns 鍖归厤鐨勭珯鐐规暟缁?		 */
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
		 * 鏇存柊绔欑偣
		 *
		 * @param id - 绔欑偣 ID
		 * @param data - 瑕佹洿鏂扮殑鏁版嵁
		 * @returns 鏇存柊鍚庣殑绔欑偣锛屽鏋滀笉瀛樺湪鍒欒繑鍥?null
		 */
		async update(id: number, data: Partial<NewSite>): Promise<Site | null> {
			const [updatedSite] = await db
				.update(sites)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(sites.id, String(id)))
				.returning();

			return updatedSite || null;
		},

		/**
		 * 鍒犻櫎绔欑偣
		 *
		 * @param id - 绔欑偣 ID
		 * @returns 鏄惁鍒犻櫎鎴愬姛
		 */
		async delete(id: number): Promise<boolean> {
			const result = await db
				.delete(sites)
				.where(eq(sites.id, String(id)))
				.returning();
			return result.length > 0;
		},

		/**
		 * 缁熻绔欑偣鎬绘暟
		 *
		 * @returns 绔欑偣鎬绘暟
		 */
		async count(): Promise<number> {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(sites);
			return Number(result[0]?.count || 0);
		},

		/**
		 * 鑾峰彇绔欑偣鐨勭炕璇?		 *
		 * @param siteId - 绔欑偣 ID
		 * @param language - 璇█浠ｇ爜锛堝彲閫夛級
		 * @returns 缈昏瘧鏁扮粍
		 */
		async getTranslations(siteId: number, language?: string): Promise<SiteI18n[]> {
			const conditions = [eq(sitesI18n.siteId, String(siteId))];

			if (language) {
				conditions.push(eq(sitesI18n.language, language));
			}

			return await db
				.select()
				.from(sitesI18n)
				.where(and(...conditions));
		},

		/**
		 * 鍒涘缓绔欑偣缈昏瘧
		 *
		 * @param translation - 缈昏瘧鏁版嵁
		 * @returns 鏂板垱寤虹殑缈昏瘧
		 */
		async createTranslation(translation: NewSiteI18n): Promise<SiteI18n> {
			const [newTranslation] = await db.insert(sitesI18n).values(translation).returning();
			return newTranslation;
		},

		/**
		 * 鏇存柊绔欑偣缈昏瘧
		 *
		 * @param id - 缈昏瘧 ID
		 * @param data - 瑕佹洿鏂扮殑鏁版嵁
		 * @returns 鏇存柊鍚庣殑缈昏瘧锛屽鏋滀笉瀛樺湪鍒欒繑鍥?null
		 */
		async updateTranslation(id: number, data: Partial<NewSiteI18n>): Promise<SiteI18n | null> {
			const [updatedTranslation] = await db
				.update(sitesI18n)
				.set(data)
				.where(eq(sitesI18n.id, id))
				.returning();

			return updatedTranslation || null;
		},

		/**
		 * 鍒犻櫎绔欑偣缈昏瘧
		 *
		 * @param id - 缈昏瘧 ID
		 * @returns 鏄惁鍒犻櫎鎴愬姛
		 */
		async deleteTranslation(id: number): Promise<boolean> {
			const result = await db
				.delete(sitesI18n)
				.where(eq(sitesI18n.id, id))
				.returning();
			return result.length > 0;
		},
	};
}
