import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0010_categories_url.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔧 执行分类表URL字段添加迁移...\n');

	// 启用外键约束检查
	db.exec('PRAGMA foreign_keys=OFF');

	// 检查 product_categories 表是否已有 url 字段
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const urlColumn = categoriesColumns.find((col: any) => col.name === 'url');

	if (urlColumn) {
		console.log('⚠️  product_categories 表已存在 url 字段，跳过添加');
	} else {
		console.log('⏳ 正在为 product_categories 表添加 url 字段...');
		db.exec('ALTER TABLE `product_categories` ADD COLUMN `url` text');
		console.log('✅ product_categories 表 url 字段添加成功');
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('\n✅ 分类表URL字段迁移完成！');

	// 验证结果
	const updatedCategoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const updatedUrlColumn = updatedCategoriesColumns.find((col: any) => col.name === 'url');

	console.log('\n🎯 验证结果:');
	console.log(`  product_categories 表 url 字段: ${updatedUrlColumn ? '✅' : '❌'}`);

	// 显示新字段详情
	if (updatedUrlColumn) {
		console.log('\n📄 product_categories.url 字段详情:');
		console.log(`  ✓ ${updatedUrlColumn.name.padEnd(15)} | ${updatedUrlColumn.type.padEnd(10)} | ${updatedUrlColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		console.log(`  📝 用途: 存储分类的 URL 地址（可选字段）`);
	}

	// 显示所有URL相关字段
	console.log('\n🔗 product_categories 表所有URL相关字段:');
	const urlFields = ['cover', 'video', 'url'];
	urlFields.forEach(fieldName => {
		const column = updatedCategoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		}
	});

} catch (error) {
	console.error('❌ 迁移失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
