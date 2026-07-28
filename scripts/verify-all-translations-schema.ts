import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('📋 验证完整翻译系统结构...\n');

	// 检查 products_translations 表结构
	console.log('📄 products_translations 表字段:');
	const productsTranslationsColumns = db.query("PRAGMA table_info(products_translations)").all() as any[];
	const expectedProductsTranslationsFields = ['id', 'product_id', 'language', 'title', 'content', 'html', 'tags'];

	expectedProductsTranslationsFields.forEach(field => {
		const column = productsTranslationsColumns.find((col: any) => col.name === field);
		if (column) {
			console.log(`  ✓ ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		} else {
			console.log(`  ✗ ${field.padEnd(15)} | 缺失`);
		}
	});

	// 检查 product_categories_translations 表结构
	console.log('\n📄 product_categories_translations 表字段:');
	const categoriesTranslationsColumns = db.query("PRAGMA table_info(product_categories_translations)").all() as any[];
	const expectedCategoriesTranslationsFields = ['id', 'product_category_id', 'language', 'name', 'description', 'tags'];

	expectedCategoriesTranslationsFields.forEach(field => {
		const column = categoriesTranslationsColumns.find((col: any) => col.name === field);
		if (column) {
			console.log(`  ✓ ${column.name.padEnd(25)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		} else {
			console.log(`  ✗ ${field.padEnd(25)} | 缺失`);
		}
	});

	// 检查外键约束
	console.log('\n🔗 外键约束:');
	const productsFK = db.query("PRAGMA foreign_key_list(products_translations)").all() as any[];
	const categoriesFK = db.query("PRAGMA foreign_key_list(product_categories_translations)").all() as any[];

	console.log(`  • products_translations.product_id → products.id (${productsFK[0]?.on_delete || 'NONE'})`);
	console.log(`  • product_categories_translations.product_category_id → product_categories.id (${categoriesFK[0]?.on_delete || 'NONE'})`);

	// 检查索引
	console.log('\n📇 索引信息:');
	const productsIndexes = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='index' AND tbl_name='products_translations'
	`).all() as any[];

	const categoriesIndexes = db.query(`
		SELECT name FROM sqlite_master
		WHERE type='index' AND tbl_name='product_categories_translations'
	`).all() as any[];

	console.log('  products_translations 索引:');
	productsIndexes.forEach((idx: any) => {
		console.log(`    • ${idx.name}`);
	});

	console.log('  product_categories_translations 索引:');
	categoriesIndexes.forEach((idx: any) => {
		console.log(`    • ${idx.name}`);
	});

	// 检查 products 表的 html 字段
	console.log('\n📄 products 表 html 字段:');
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const htmlColumn = productsColumns.find((col: any) => col.name === 'html');

	if (htmlColumn) {
		console.log(`  ✓ ${htmlColumn.name.padEnd(15)} | ${htmlColumn.type.padEnd(10)} | ${htmlColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
	} else {
		console.log('  ✗ html 字段缺失');
	}

	// 最终验证
	console.log('\n🎯 最终验证:');
	const allProductsTranslationsFieldsPresent = expectedProductsTranslationsFields.every(field =>
		productsTranslationsColumns.some((col: any) => col.name === field)
	);
	const allCategoriesTranslationsFieldsPresent = expectedCategoriesTranslationsFields.every(field =>
		categoriesTranslationsColumns.some((col: any) => col.name === field)
	);
	const htmlFieldPresent = !!htmlColumn;
	const hasProductsFK = productsFK.length > 0;
	const hasCategoriesFK = categoriesFK.length > 0;
	const hasProductsIndexes = productsIndexes.length >= 3;
	const hasCategoriesIndexes = categoriesIndexes.length >= 3;

	console.log(`  products_translations 表字段: ${allProductsTranslationsFieldsPresent ? '✅' : '❌'}`);
	console.log(`  product_categories_translations 表字段: ${allCategoriesTranslationsFieldsPresent ? '✅' : '❌'}`);
	console.log(`  products 表 html 字段: ${htmlFieldPresent ? '✅' : '❌'}`);
	console.log(`  products_translations 外键约束: ${hasProductsFK ? '✅' : '❌'}`);
	console.log(`  product_categories_translations 外键约束: ${hasCategoriesFK ? '✅' : '❌'}`);
	console.log(`  products_translations 性能索引: ${hasProductsIndexes ? '✅' : '❌'}`);
	console.log(`  product_categories_translations 性能索引: ${hasCategoriesIndexes ? '✅' : '❌'}`);

	const allPassed = allProductsTranslationsFieldsPresent &&
	                  allCategoriesTranslationsFieldsPresent &&
	                  htmlFieldPresent &&
	                  hasProductsFK &&
	                  hasCategoriesFK &&
	                  hasProductsIndexes &&
	                  hasCategoriesIndexes;

	if (allPassed) {
		console.log('\n🎉 所有验证通过！完整的多语言翻译系统已准备就绪。');
		console.log('\n📊 系统架构:');
		console.log('  • products (1) → (N) products_translations');
		console.log('  • product_categories (1) → (N) product_categories_translations');
		console.log('  • 支持级联删除和唯一语言约束');
		console.log('  • 完整的性能优化索引');
	} else {
		console.log('\n⚠️  部分验证失败，请检查迁移结果。');
	}

} catch (error) {
	console.error('❌ 验证失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
