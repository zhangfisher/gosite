import { Database } from 'bun:sqlite';

const db = new Database('data/data.db');

try {
	console.log('🔄 开始表重命名迁移...');

	// 启用外键约束
	db.exec('PRAGMA foreign_keys = OFF;');
	console.log('✅ 外键约束已禁用');

	// 1. 重命名 categories 表为 product_categories
	db.exec('ALTER TABLE `categories` RENAME TO `product_categories_old`');
	console.log('✅ categories 表临时重命名为 product_categories_old');

	// 2. 重命名 product_categories 表为 product_category_relations
	db.exec('ALTER TABLE `product_categories` RENAME TO `product_category_relations`');
	console.log('✅ product_categories 表重命名为 product_category_relations');

	// 3. 重命名 product_categories_old 为 product_categories
	db.exec('ALTER TABLE `product_categories_old` RENAME TO `product_categories`');
	console.log('✅ product_categories_old 表重命名为 product_categories');

	// 启用外键约束
	db.exec('PRAGMA foreign_keys = ON;');
	console.log('✅ 外键约束已启用');

	console.log('🎉 表重命名迁移完成！');
} catch (error) {
	console.error('❌ 迁移失败:', error);
	process.exit(1);
} finally {
	db.close();
}