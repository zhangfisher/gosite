import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🎯 验证完整 HTML 字段支持...\n');

	// 检查所有表的 html 字段
	const tables = [
		'products',
		'products_translations',
		'product_categories',
		'product_categories_translations'
	];

	console.log('📋 HTML 字段验证结果:\n');

	let allPassed = true;

	tables.forEach(tableName => {
		const columns = db.query(`PRAGMA table_info(${tableName})`).all() as any[];
		const htmlColumn = columns.find((col: any) => col.name === 'html');

		if (htmlColumn) {
			console.log(`✅ ${tableName.padEnd(40)} | ${htmlColumn.type.padEnd(10)} | ${htmlColumn.notnull ? 'NOT NULL' : 'NULL'}`);
		} else {
			console.log(`❌ ${tableName.padEnd(40)} | HTML 字段缺失`);
			allPassed = false;
		}
	});

	if (allPassed) {
		console.log('\n🎉 HTML 字段验证完成！所有表都支持 HTML 内容存储。\n');

		console.log('📊 完整的多语言内容架构:\n');

		console.log('产品系统:');
		console.log('  • products.content  (Markdown 格式)');
		console.log('  • products.html     (HTML 格式)');
		console.log('  • products_translations.content  (Markdown 翻译)');
		console.log('  • products_translations.html     (HTML 翻译)');

		console.log('\n分类系统:');
		console.log('  • product_categories.description  (Markdown 格式)');
		console.log('  • product_categories.html         (HTML 格式)');
		console.log('  • product_categories_translations.description  (Markdown 翻译)');
		console.log('  • product_categories_translations.html         (HTML 翻译)');

		console.log('\n🚀 系统特性:');
		console.log('  • 支持多种内容格式 (Markdown + HTML)');
		console.log('  • 完整的多语言翻译支持');
		console.log('  • 灵活的内容管理选项');
		console.log('  • 高性能的查询优化');

	} else {
		console.log('\n⚠️  部分表的 HTML 字段缺失，请检查迁移结果。');
	}

} catch (error) {
	console.error('❌ 验证失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
