import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0008_categories_html.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行分类系统 HTML 字段添加迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查 product_categories 表是否已有 html 字段
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const categoriesHtmlColumn = categoriesColumns.find((col: any) => col.name === 'html');

	if (categoriesHtmlColumn) {
		console.log('⚠️  product_categories 表已存在 html 字段，跳过添加');
	} else {
		console.log('⏳ 正在为 product_categories 表添加 html 字段...');
		db.exec('ALTER TABLE `product_categories` ADD COLUMN `html` text');
		console.log('✅ product_categories 表 html 字段添加成功');
	}

	// 检查 product_categories_translations 表是否已有 html 字段
	const translationsColumns = db.query("PRAGMA table_info(product_categories_translations)").all() as any[];
	const translationsHtmlColumn = translationsColumns.find((col: any) => col.name === 'html');

	if (translationsHtmlColumn) {
		console.log('⚠️  product_categories_translations 表已存在 html 字段，跳过添加');
	} else {
		console.log('⏳ 正在为 product_categories_translations 表添加 html 字段...');
		db.exec('ALTER TABLE `product_categories_translations` ADD COLUMN `html` text');
		console.log('✅ product_categories_translations 表 html 字段添加成功');
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ 分类系统 HTML 字段迁移完成！');

	// 验证结果
	const updatedCategoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const updatedTranslationsColumns = db.query("PRAGMA table_info(product_categories_translations)").all() as any[];
	const updatedCategoriesHtmlColumn = updatedCategoriesColumns.find((col: any) => col.name === 'html');
	const updatedTranslationsHtmlColumn = updatedTranslationsColumns.find((col: any) => col.name === 'html');

	console.log('\n🎯 验证结果:');
	console.log(`  product_categories 表 html 字段: ${updatedCategoriesHtmlColumn ? '✅' : '❌'}`);
	console.log(`  product_categories_translations 表 html 字段: ${updatedTranslationsHtmlColumn ? '✅' : '❌'}`);

	// 显示新字段详情
	if (updatedCategoriesHtmlColumn) {
		console.log('\n📄 product_categories.html 字段详情:');
		console.log(`  ✓ ${updatedCategoriesHtmlColumn.name.padEnd(15)} | ${updatedCategoriesHtmlColumn.type.padEnd(10)} | ${updatedCategoriesHtmlColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
	}

	if (updatedTranslationsHtmlColumn) {
		console.log('\n📄 product_categories_translations.html 字段详情:');
		console.log(`  ✓ ${updatedTranslationsHtmlColumn.name.padEnd(15)} | ${updatedTranslationsHtmlColumn.type.padEnd(10)} | ${updatedTranslationsHtmlColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
	}

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
