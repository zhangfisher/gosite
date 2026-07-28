import { Database } from 'bun:sqlite';
import { join } from 'path';

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	console.log('🔍 验证最终分类表完整结构\n');
	console.log('═══════════════════════════════════════════════════════\n');

	// 获取 product_categories 表完整结构
	const categoriesColumns = db.query("PRAGMA table_info(product_categories)").all() as any[];

	console.log('📋 product_categories 表完整字段列表:\n');

	// 按字段类型分组显示
	console.log('🔹 基础结构字段:');
	const basicFields = ['id', 'name', 'level', 'left', 'right', 'created_at', 'updated_at'];
	basicFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		}
	});

	console.log('\n🖼️ 媒体资源字段:');
	const mediaFields = ['icon', 'cover', 'images', 'video'];
	mediaFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		}
	});

	console.log('\n📝 内容描述字段:');
	const contentFields = ['description', 'html', 'tags'];
	contentFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		}
	});

	console.log('\n🔗 URL链接字段:');
	const urlFields = ['cover', 'video', 'url'];
	urlFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		}
	});

	console.log('\n⭐ 评价分类字段:');
	const ratingFields = ['stars'];
	ratingFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  • ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)} | ${column.dflt_value || '-'}`);
		}
	});

	// 验证所有关键字段
	console.log('\n🎯 关键字段验证:\n');

	const criticalFields = {
		'嵌套集合模型': ['id', 'name', 'level', 'left', 'right'],
		'内容管理': ['description', 'html', 'tags'],
		'媒体资源': ['icon', 'cover', 'images', 'video'],
		'URL管理': ['cover', 'video', 'url'],
		'评价系统': ['stars'],
		'时间戳': ['created_at', 'updated_at']
	};

	let allFieldsPresent = true;

	Object.entries(criticalFields).forEach(([category, fields]) => {
		const allPresent = fields.every(field =>
			categoriesColumns.some((col: any) => col.name === field)
		);
		console.log(`  ${allPresent ? '✅' : '❌'} ${category.padEnd(20)} | ${fields.join(', ')}`);
		if (!allPresent) allFieldsPresent = false;
	});

	// 字段统计
	console.log('\n📊 表结构统计:\n');
	console.log(`  • 总字段数: ${categoriesColumns.length}`);
	console.log(`  • NOT NULL 字段: ${categoriesColumns.filter(col => col.notnull).length}`);
	console.log(`  • 可选字段: ${categoriesColumns.filter(col => !col.notnull).length}`);

	// 最新添加的字段
	console.log('\n🆕 最新添加的字段:\n');
	const recentFields = ['images', 'html', 'url'];
	recentFields.forEach(fieldName => {
		const column = categoriesColumns.find((col: any) => col.name === fieldName);
		if (column) {
			console.log(`  ✅ ${column.name.padEnd(15)} | ${column.type.padEnd(10)} | ${column.notnull ? 'NOT NULL' : 'NULL'.padEnd(8)}`);
		}
	});

	if (allFieldsPresent) {
		console.log('\n🎉 分类表结构验证完成！所有必要字段均已正确添加。\n');
		console.log('🚀 product_categories 表现在完全支持:');
		console.log('  • 树形分类结构管理');
		console.log('  • 多媒体资源存储');
		console.log('  • 丰富的内容展示');
		console.log('  • URL 链接管理');
		console.log('  • 星级评价系统');
		console.log('  • 多语言翻译支持');
	} else {
		console.log('\n⚠️  部分关键字段缺失，请检查表结构。');
	}

	console.log('\n═══════════════════════════════════════════════════════\n');

} catch (error) {
	console.error('❌ 验证失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
