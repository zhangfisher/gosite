import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0005_fix_stars.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行 stars 字段修复迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 执行迁移
	console.log('⏳ 正在重新创建 products 表...');
	db.exec(`
		CREATE TABLE products_new (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			name text NOT NULL,
			title text NOT NULL,
			description text NOT NULL,
			keywords text NOT NULL,
			icon text NOT NULL,
			images text NOT NULL,
			content text NOT NULL,
			created_at integer NOT NULL,
			updated_at integer NOT NULL,
			cover text,
			tags text,
			video text,
			stars integer DEFAULT 0 NOT NULL
		)
	`);

	console.log('⏳ 正在迁移数据...');
	db.exec('INSERT INTO products_new SELECT *, 0 as stars FROM products');

	console.log('⏳ 正在替换旧表...');
	db.exec('DROP TABLE products');
	db.exec('ALTER TABLE products_new RENAME TO products');

	console.log('⏳ 正在重新创建 product_categories 表...');
	db.exec(`
		CREATE TABLE product_categories_new (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			name text NOT NULL,
			level integer NOT NULL,
			left integer NOT NULL,
			right integer NOT NULL,
			created_at integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
			updated_at integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
			icon text,
			cover text,
			description text,
			tags text,
			video text,
			stars integer DEFAULT 0 NOT NULL
		)
	`);

	console.log('⏳ 正在迁移分类数据...');
	db.exec('INSERT INTO product_categories_new SELECT *, 0 as stars FROM product_categories');

	console.log('⏳ 正在替换分类表...');
	db.exec('DROP TABLE product_categories');
	db.exec('ALTER TABLE product_categories_new RENAME TO product_categories');

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ stars 字段修复成功！');

	// 验证结果
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];

	const productsStars = productsColumns.find((col: any) => col.name === 'stars');
	const categoriesStars = categoriesColumns.find((col: any) => col.name === 'stars');

	console.log('\n🎯 验证结果:');
	console.log(`  Products 表 stars 字段: ${productsStars ? '✅' : '❌'}`);
	console.log(`  Product_Categories 表 stars 字段: ${categoriesStars ? '✅' : '❌'}`);

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
