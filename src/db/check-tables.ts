/**
 * 检查数据库中的表
 */
import { sqlite } from './index';

function checkTables() {
	const result = sqlite.prepare(`
		SELECT name FROM sqlite_master
		WHERE type='table'
		ORDER BY name
	`).all() as { name: string }[];

	console.log('📊 数据库中的表:\n');
	result.forEach(({ name }) => {
		console.log(`   - ${name}`);
	});
	console.log();

	// 检查是否缺少 product_category_relations 表
	const hasRelationsTable = result.some(t => t.name === 'product_category_relations');
	if (!hasRelationsTable) {
		console.log('❌ 缺少 product_category_relations 表');
	} else {
		console.log('✅ product_category_relations 表存在');
	}
}

if (import.meta.main) {
	checkTables();
	process.exit(0);
}

export { checkTables };
