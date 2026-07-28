import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0006_products_translations.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行产品翻译表创建迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查 products_translations 表是否已存在
	const existingTables = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='table' AND name='products_translations'
	`).all() as any[];

	if (existingTables.length > 0) {
		console.log('⚠️  products_translations 表已存在，跳过创建');
	} else {
		console.log('⏳ 正在创建 products_translations 表...');
		db.exec(`
			CREATE TABLE \`products_translations\` (
				\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
				\`product_id\` integer NOT NULL,
				\`language\` text NOT NULL,
				\`title\` text NOT NULL,
				\`content\` text NOT NULL,
				\`html\` text,
				\`tags\` text,
				FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
			)
		`);
		console.log('✅ products_translations 表创建成功');
	}

	// 检查 products 表是否已有 html 字段
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const htmlColumn = productsColumns.find((col: any) => col.name === 'html');

	if (htmlColumn) {
		console.log('⚠️  products 表已存在 html 字段，跳过添加');
	} else {
		console.log('⏳ 正在为 products 表添加 html 字段...');
		db.exec('ALTER TABLE `products` ADD COLUMN `html` text');
		console.log('✅ html 字段添加成功');
	}

	// 检查索引是否已存在
	const existingIndexes = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='index' AND name LIKE 'products_translations%'
	`).all() as any[];

	if (existingIndexes.length === 0) {
		console.log('⏳ 正在创建索引...');
		db.exec('CREATE INDEX `products_translations_product_id_index` ON `products_translations`(`product_id`)');
		db.exec('CREATE INDEX `products_translations_language_index` ON `products_translations`(`language`)');
		db.exec('CREATE UNIQUE INDEX `products_translations_product_language_unique` ON `products_translations`(`product_id`, `language`)');
		console.log('✅ 索引创建成功');
	} else {
		console.log('⚠️  索引已存在，跳过创建');
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ 产品翻译表迁移完成！');

	// 验证结果
	const translationsColumns = db.query("PRAGMA table_info(products_translations)").all() as any[];
	const updatedProductsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const updatedHtmlColumn = updatedProductsColumns.find((col: any) => col.name === 'html');

	console.log('\n🎯 验证结果:');
	console.log(`  products_translations 表: ${translationsColumns.length > 0 ? '✅' : '❌'}`);
	console.log(`  products 表 html 字段: ${updatedHtmlColumn ? '✅' : '❌'}`);

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
