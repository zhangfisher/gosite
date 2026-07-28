import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0009_categories_images.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行分类表图片列表字段添加迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查 product_categories 表是否已有 images 字段
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const imagesColumn = categoriesColumns.find((col: any) => col.name === 'images');

	if (imagesColumn) {
		console.log('⚠️  product_categories 表已存在 images 字段，跳过添加');
	} else {
		console.log('⏳ 正在为 product_categories 表添加 images 字段...');
		db.exec('ALTER TABLE `product_categories` ADD COLUMN `images` text');
		console.log('✅ product_categories 表 images 字段添加成功');
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ 分类表图片列表字段迁移完成！');

	// 验证结果
	const updatedCategoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const updatedImagesColumn = updatedCategoriesColumns.find((col: any) => col.name === 'images');

	console.log('\n🎯 验证结果:');
	console.log(`  product_categories 表 images 字段: ${updatedImagesColumn ? '✅' : '❌'}`);

	// 显示新字段详情
	if (updatedImagesColumn) {
		console.log('\n📄 product_categories.images 字段详情:');
		console.log(`  ✓ ${updatedImagesColumn.name.padEnd(15)} | ${updatedImagesColumn.type.padEnd(10)} | ${updatedImagesColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		console.log(`  📝 用途: 存储上传的图片名称列表（JSON 数组格式，存储为 JSON 字符串）`);
	}

	// 显示完整的分类表字段列表
	console.log('\n📋 product_categories 表完整字段列表:');
	updatedCategoriesColumns.forEach((col: any) => {
		console.log(`  • ${col.name.padEnd(25)} | ${col.type.padEnd(10)} | ${col.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${col.dflt_value || '-'}`);
	});

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
