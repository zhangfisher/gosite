import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0007_categories_translations.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行产品分类翻译表创建迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查 product_categories_translations 表是否已存在
	const existingTables = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='table' AND name='product_categories_translations'
	`).all() as any[];

	if (existingTables.length > 0) {
		console.log('⚠️  product_categories_translations 表已存在，跳过创建');
	} else {
		console.log('⏳ 正在创建 product_categories_translations 表...');
		db.exec(`
			CREATE TABLE \`product_categories_translations\` (
				\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
				\`product_category_id\` integer NOT NULL,
				\`language\` text NOT NULL,
				\`name\` text NOT NULL,
				\`description\` text,
				\`tags\` text,
				FOREIGN KEY (\`product_category_id\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE
			)
		`);
		console.log('✅ product_categories_translations 表创建成功');
	}

	// 检查索引是否已存在
	const existingIndexes = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='index' AND name LIKE 'product_categories_translations%'
	`).all() as any[];

	if (existingIndexes.length === 0) {
		console.log('⏳ 正在创建索引...');
		db.exec('CREATE INDEX `product_categories_translations_product_category_id_index` ON `product_categories_translations`(`product_category_id`)');
		db.exec('CREATE INDEX `product_categories_translations_language_index` ON `product_categories_translations`(`language`)');
		db.exec('CREATE UNIQUE INDEX `product_categories_translations_category_language_unique` ON `product_categories_translations`(`product_category_id`, `language`)');
		console.log('✅ 索引创建成功');
	} else {
		console.log('⚠️  索引已存在，跳过创建');
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ 产品分类翻译表迁移完成！');

	// 验证结果
	const translationsColumns = db.query("PRAGMA table_info(product_categories_translations)").all() as any[];

	console.log('\n🎯 验证结果:');
	console.log(`  product_categories_translations 表: ${translationsColumns.length > 0 ? '✅' : '❌'}`);

	// 显示表字段
	if (translationsColumns.length > 0) {
		console.log('\n📄 product_categories_translations 表字段:');
		const expectedFields = ['id', 'product_category_id', 'language', 'name', 'description', 'tags'];

		expectedFields.forEach(field => {
			const column = translationsColumns.find((col: any) => col.name === field);
			if (column) {
				console.log(`  ✓ ${column.name.padEnd(25)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
			} else {
				console.log(`  ✗ ${field.padEnd(25)} | 缺失`);
			}
		});
	}

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
