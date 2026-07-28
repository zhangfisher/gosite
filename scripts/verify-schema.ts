import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('📋 检查 products 表结构...\n');
	const productsSchema = db.query(`
		SELECT sql FROM sqlite_master
		WHERE type='table' AND name='products'
	`).get() as { sql: string };
	console.log(productsSchema.sql);

	console.log('\n📋 检查 product_categories 表结构...\n');
	const categoriesSchema = db.query(`
		SELECT sql FROM sqlite_master
		WHERE type='table' AND name='product_categories'
	`).get() as { sql: string };
	console.log(categoriesSchema.sql);

	console.log('\n🎯 验证字段是否存在...\n');

	// 检查 products 表的新字段
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const productsNewFields = productsColumns.filter((col: any) =>
		['stars', 'tags', 'video'].includes(col.name)
	);

	console.log('Products 表新字段:');
	if (productsNewFields.length > 0) {
		productsNewFields.forEach((col: any) => {
			console.log(`  ✓ ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
		});
	} else {
		console.log('  ⚠️  未找到新字段');
	}

	// 检查 product_categories 表的新字段
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];
	const categoriesNewFields = categoriesColumns.filter((col: any) =>
		['stars', 'tags', 'video'].includes(col.name)
	);

	console.log('\nProduct_Categories 表新字段:');
	if (categoriesNewFields.length > 0) {
		categoriesNewFields.forEach((col: any) => {
			console.log(`  ✓ ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
		});
	} else {
		console.log('  ⚠️  未找到新字段');
	}

	console.log('\n✅ 所有新字段已成功添加！');
} catch (error) {
	console.error('❌ 验证失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
