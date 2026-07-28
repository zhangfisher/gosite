/**
 * 验证 content 和 homepage 字段是否正确添加
 */
import { sqlite } from './index';

function verifyNewFields() {
	console.log('🔍 验证 content 和 homepage 字段...\n');

	// 检查 sites 表的字段
	const sitesColumns = sqlite.prepare(`PRAGMA table_info(sites)`).all() as { name: string; type: string }[];

	console.log('📋 sites 表完整字段列表:');
	sitesColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'content' || name === 'homepage') {
			marker = '🆕';
		} else if (name === 'menu') {
			marker = '📱';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 检查 sites_translations 表的字段
	const translationsColumns = sqlite.prepare(`PRAGMA table_info(sites_translations)`).all() as { name: string; type: string }[];

	console.log('\n📋 sites_translations 表完整字段列表:');
	translationsColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'homepage') {
			marker = '🆕';
		} else if (name === 'menu') {
			marker = '📱';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 验证关键字段
	console.log('\n🔍 字段验证:');

	const sitesHasContent = sitesColumns.some(col => col.name === 'content');
	const sitesHasHomepage = sitesColumns.some(col => col.name === 'homepage');
	const translationsHasHomepage = translationsColumns.some(col => col.name === 'homepage');

	if (sitesHasContent) {
		console.log('   ✅ sites 表有 content 字段');
	} else {
		console.log('   ❌ sites 表缺少 content 字段');
	}

	if (sitesHasHomepage) {
		console.log('   ✅ sites 表有 homepage 字段');
	} else {
		console.log('   ❌ sites 表缺少 homepage 字段');
	}

	if (translationsHasHomepage) {
		console.log('   ✅ sites_translations 表有 homepage 翻译字段');
	} else {
		console.log('   ❌ sites_translations 表缺少 homepage 翻译字段');
	}

	// 确认 content 字段不需要翻译
	const translationsHasContent = translationsColumns.some(col => col.name === 'content');
	if (!translationsHasContent) {
		console.log('   ✅ sites_translations 表正确地没有 content 字段（不需要翻译）');
	} else {
		console.log('   ⚠️ sites_translations 表不应该有 content 字段');
	}

	if (sitesHasContent && sitesHasHomepage && translationsHasHomepage && !translationsHasContent) {
		console.log('\n✅ 所有字段验证完成！结构符合预期。');
	} else {
		console.log('\n❌ 字段验证失败！');
	}
}

if (import.meta.main) {
	verifyNewFields();
	process.exit(0);
}

export { verifyNewFields };
