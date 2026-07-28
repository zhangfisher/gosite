/**
 * 数据库连接和配置
 *
 * 使用 Drizzle ORM 连接 SQLite 数据库
 * 数据库文件位于 data/data.db
 */
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';
import DrizzleTreeAdapter from './utils/treeAdapter';
import { getProducts } from './models/Products';
import { getProductCategories } from './models/ProductCategories';
import { getSites } from './models/Sites';

// 数据库文件路径
const DATABASE_PATH = `${import.meta.dir}/../../data/data.db`;

// 创建 SQLite 数据库连接
export const sqlite = new Database(DATABASE_PATH);

// 启用外键约束
sqlite.run('PRAGMA foreign_keys = ON');

// 创建 Drizzle ORM 实例
export const db = drizzle({
	client: sqlite,
	schema,
});


// 导出数据库类型
export type DrizzleDb = typeof db;

export const Products = getProducts(db)
export const ProductCategories = getProductCategories(db)
export const Sites = getSites(db)

// 导出 schema 供查询使用
export * from './schema';

 

// 导出 FlexTree 适配器类和实例
export { DrizzleTreeAdapter };

  
 
/**
 * 数据库连接关闭函数
 * 在应用关闭时调用
 */
export function closeDatabase() {
	sqlite.close();
}
