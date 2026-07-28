/**
 * 检查数据库索引
 */
import { sqlite } from './index';

function checkIndexes() {
	const indexes = sqlite.prepare(`
		SELECT name, tbl_name FROM sqlite_master
		WHERE type='index' AND name NOT LIKE 'sqlite_%'
		ORDER BY tbl_name, name
	`).all() as { name: string; tbl_name: string }[];

	console.log('📊 数据库索引列表:\n');

	// 按表分组
	const indexesByTable: Record<string, string[]> = {};
	indexes.forEach(({ name, tbl_name }) => {
		if (!indexesByTable[tbl_name]) {
			indexesByTable[tbl_name] = [];
		}
		indexesByTable[tbl_name].push(name);
	});

	Object.entries(indexesByTable).forEach(([table, indexes]) => {
		console.log(`📋 ${table}:`);
		indexes.forEach(index => {
			console.log(`   - ${index}`);
		});
		console.log();
	});

	// 检查关键唯一索引
	console.log('🔑 关键唯一索引检查:\n');

	const requiredUniqueIndexes = [
		{ table: 'sites', name: 'sites.name', field: 'name' },
		{ table: 'products_translations', name: 'products_translations_product_language_unique', fields: ['product_id', 'language'] },
		{ table: 'product_categories_translations', name: 'product_categories_translations_category_language_unique', fields: ['category_id', 'language'] },
		{ table: 'sites_translations', name: 'sites_translations_site_language_unique', fields: ['site_id', 'language'] },
		{ table: 'product_category_relations', name: 'product_category_relations_unique', fields: ['product_id', 'category_id'] },
	];

	const allIndexNames = indexes.map(i => i.name);

	requiredUniqueIndexes.forEach(({ table, name, fields }) => {
		const exists = allIndexNames.includes(name);
		if (exists) {
			console.log(`   ✅ ${table}: ${name} (${fields.join(' + ')})`);
		} else {
			console.log(`   ❌ ${table}: ${name} (缺少)`);
		}
	});

	console.log('\n✅ 索引检查完成！');
}

if (import.meta.main) {
	checkIndexes();
	process.exit(0);
}

export { checkIndexes };
