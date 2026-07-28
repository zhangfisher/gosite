import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('📋 验证产品翻译表结构...\n');

	// 检查 products_translations 表结构
	const translationsColumns = db.query("PRAGMA table_info(products_translations)").all() as any[];

	console.log('📄 products_translations 表字段:');
	const expectedTranslationsFields = ['id', 'product_id', 'language', 'title', 'content', 'html', 'tags'];

	expectedTranslationsFields.forEach(field => {
		const column = translationsColumns.find((col: any) => col.name === field);
		if (column) {
			console.log(`  ✓ ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		} else {
			console.log(`  ✗ ${field.padEnd(15)} | 缺失`);
		}
	});

	// 检查外键约束
	console.log('\n🔗 外键约束:');
	const foreignKeys = db.query("PRAGMA foreign_key_list(products_translations)").all() as any[];
	foreignKeys.forEach((fk: any) => {
		console.log(`  • 外键: product_id → products.id (${fk.on_delete})`);
	});

	// 检查索引
	console.log('\n📇 索引信息:');
	const indexes = db.query(`
		SELECT name, "unique" FROM sqlite_master
		WHERE type='index' AND tbl_name='products_translations'
	`).all() as any[];

	indexes.forEach((idx: any) => {
		console.log(`  • ${idx.name} ${idx.unique === 1 ? '(UNIQUE)' : ''}`);
	});

	// 检查 products 表的 html 字段
	console.log('\n📄 products 表 html 字段:');
	const productsColumns = db.query("PRAGMA table_info(products)").all() as any[];
	const htmlColumn = productsColumns.find((col: any) => col.name === 'html');

	if (htmlColumn) {
		console.log(`  ✓ ${htmlColumn.name.padEnd(15)} | ${htmlColumn.type.padEnd(10)} | ${htmlColumn.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${htmlColumn.dflt_value || '-'}`);
	} else {
		console.log('  ✗ html 字段缺失');
	}

	// 最终验证
	console.log('\n🎯 最终验证:');
	const allTranslationsFieldsPresent = expectedTranslationsFields.every(field =>
		translationsColumns.some((col: any) => col.name === field)
	);
	const htmlFieldPresent = !!htmlColumn;
	const hasForeignKey = foreignKeys.length > 0;
	const hasIndexes = indexes.length >= 3;

	console.log(`  products_translations 表字段: ${allTranslationsFieldsPresent ? '✅' : '❌'}`);
	console.log(`  products 表 html 字段: ${htmlFieldPresent ? '✅' : '❌'}`);
	console.log(`  外键约束: ${hasForeignKey ? '✅' : '❌'}`);
	console.log(`  性能索引: ${hasIndexes ? '✅' : '❌'}`);

	if (allTranslationsFieldsPresent && htmlFieldPresent && hasForeignKey && hasIndexes) {
		console.log('\n🎉 所有验证通过！产品翻译系统已准备就绪。');
	} else {
		console.log('\n⚠️  部分验证失败，请检查迁移结果。');
	}

} catch (error) {
	console.error('❌ 验证失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
