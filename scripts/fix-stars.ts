import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 开始添加缺失的 stars 字段...\n');

	// 关闭外键约束
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查表是否有数据
	const productsCount = db.query('SELECT COUNT(*) as count FROM products').get() as { count: number };
	const categoriesCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };

	console.log(`Products 表记录数: ${productsCount.count}`);
	console.log(`Product_Categories 表记录数: ${categoriesCount.count}\n`);

	// 为 products 表添加 stars 字段
	if (productsCount.count > 0) {
		console.log('⚠️  Products 表有数据，使用更安全的方法添加 stars 字段...');
		// SQLite 不支持直接添加 NOT NULL 字段到有数据的表
		// 需要分步进行：先添加可空字段，填充数据，再修改为 NOT NULL
		db.exec('ALTER TABLE `products` ADD COLUMN `stars_temp` integer DEFAULT 0');
		db.exec('UPDATE `products` SET `stars_temp` = 0 WHERE `stars_temp` IS NULL');
		// SQLite 不支持 ALTER COLUMN，所以我们需要重新创建表
	} else {
		console.log('✅ Products 表为空，直接添加 stars 字段...');
		db.exec('ALTER TABLE `products` ADD COLUMN `stars` integer DEFAULT 0 NOT NULL');
	}

	// 为 product_categories 表添加 stars 字段
	if (categoriesCount.count > 0) {
		console.log('⚠️  Product_Categories 表有数据，使用更安全的方法添加 stars 字段...');
		db.exec('ALTER TABLE `product_categories` ADD COLUMN `stars_temp` integer DEFAULT 0');
		db.exec('UPDATE `product_categories` SET `stars_temp` = 0 WHERE `stars_temp` IS NULL');
	} else {
		console.log('✅ Product_Categories 表为空，直接添加 stars 字段...');
		db.exec('ALTER TABLE `product_categories` ADD COLUMN `stars` integer DEFAULT 0 NOT NULL');
	}

	console.log('\n✅ stars 字段添加成功！');

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

} catch (error) {
	console.error('❌ 添加失败:', error.message);
	console.error('\n使用替代方案：重新创建表...');

	// 替代方案：重新创建表
	try {
		console.log('\n🔄 使用重新创建表的方法...');

		// 对于 products 表
		console.log('处理 products 表...');
		db.exec(`
			CREATE TABLE `products_new` (
				`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
				`name` text NOT NULL,
				`title` text NOT NULL,
				`description` text NOT NULL,
				`keywords` text NOT NULL,
				`icon` text NOT NULL,
				`images` text NOT NULL,
				`content` text NOT NULL,
				`created_at` integer NOT NULL,
				`updated_at` integer NOT NULL,
				`cover` text,
				`tags` text,
				`video` text,
				`stars` integer DEFAULT 0 NOT NULL
			);

			INSERT INTO `products_new`
			SELECT *, 0 as stars FROM `products`;

			DROP TABLE `products`;
			ALTER TABLE `products_new` RENAME TO `products`;
		`);

		// 对于 product_categories 表
		console.log('处理 product_categories 表...');
		db.exec(`
			CREATE TABLE `product_categories_new` (
				`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
				`name` text NOT NULL,
				`level` integer NOT NULL,
				`left` integer NOT NULL,
				`right` integer NOT NULL,
				`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
				`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
				`icon` text,
				`cover` text,
				`description` text,
				`tags` text,
				`video` text,
				`stars` integer DEFAULT 0 NOT NULL
			);

			INSERT INTO `product_categories_new`
			SELECT *, 0 as stars FROM `product_categories`;

			DROP TABLE `product_categories`;
			ALTER TABLE `product_categories_new` RENAME TO `product_categories`;
		`);

		console.log('✅ 表重新创建成功！stars 字段已添加。');

	} catch (recreateError) {
		console.error('❌ 重新创建表失败:', recreateError.message);
		process.exit(1);
	}
} finally {
	db.close();
}
