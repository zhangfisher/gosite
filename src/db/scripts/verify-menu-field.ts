/**
 * 验证 menu 字段是否正确添加
 */
import { sqlite } from '../index';

function verifyMenuFields() {
	console.log('🔍 验证 menu 字段...\n');

	// 检查 sites 表的字段
	const sitesColumns = sqlite.prepare(`PRAGMA table_info(sites)`).all() as { name: string }[];
	const sitesHasMenu = sitesColumns.some(col => col.name === 'menu');

	if (sitesHasMenu) {
		console.log('✅ sites 表有 menu 字段');
	} else {
		console.log('❌ sites 表缺少 menu 字段');
	}

	// 检查 sites_i18n 表的字段
	const translationsColumns = sqlite.prepare(`PRAGMA table_info(sites_i18n)`).all() as { name: string }[];
	const translationsHasMenu = translationsColumns.some(col => col.name === 'menu');

	if (translationsHasMenu) {
		console.log('✅ sites_i18n 表有 menu 字段');
	} else {
		console.log('❌ sites_i18n 表缺少 menu 字段');
	}

	// 显示完整的字段列表
	console.log('\n📋 sites 表字段:');
	sitesColumns.forEach(({ name }) => {
		const marker = name === 'menu' ? '🆕' : '  ';
		console.log(`   ${marker} ${name}`);
	});

	console.log('\n📋 sites_i18n 表字段:');
	translationsColumns.forEach(({ name }) => {
		const marker = name === 'menu' ? '🆕' : '  ';
		console.log(`   ${marker} ${name}`);
	});

	if (sitesHasMenu && translationsHasMenu) {
		console.log('\n✅ menu 字段验证完成！');
	} else {
		console.log('\n❌ menu 字段验证失败！');
	}
}

if (import.meta.main) {
	verifyMenuFields();
	process.exit(0);
}

export { verifyMenuFields };
