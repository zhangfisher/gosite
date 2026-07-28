import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔍 检查所有表字段详情...\n');

	// 检查 products 表
	console.log('Products 表所有字段:');
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	productsColumns.forEach((col: any) => {
		console.log(`  • ${col.name.padEnd(15)} | ${col.type.padEnd(10)} | ${col.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${col.dflt_value || '-'}`);
	});

	console.log('\nProduct_Categories 表所有字段:');
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	categoriesColumns.forEach((col: any) => {
		console.log(`  • ${col.name.padEnd(15)} | ${col.type.padEnd(10)} | ${col.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${col.dflt_value || '-'}`);
	});

	// 查找 stars 字段
	const productsStars = productsColumns.find((col: any) => col.name === 'stars');
	const categoriesStars = categoriesColumns.find((col: any) => col.name === 'stars');

	console.log('\n🎯 Stars 字段检查:');
	console.log(`  Products 表: ${productsStars ? '✅ 存在' : '❌ 缺失'}`);
	console.log(`  Product_Categories 表: ${categoriesStars ? '✅ 存在' : '❌ 缺失'}`);

	if (!productsStars || !categoriesStars) {
		console.log('\n⚠️  检测到 stars 字段缺失，需要重新迁移！');
	}
} catch (error) {
	console.error('❌ 检查失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
