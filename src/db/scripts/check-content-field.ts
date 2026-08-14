/**
 * 检查 content 字段状态
 */
import { sqlite } from '../index';

function checkContentFieldStatus() {
	console.log('🔍 检查 content 字段状态...\n');

	// 检查 sites 表的字段
	const sitesColumns = sqlite.prepare(`PRAGMA table_info(sites)`).all() as { name: string }[];
	const sitesHasContent = sitesColumns.some(col => col.name === 'content');

	// 检查 sites_translations 表的字段
	const translationsColumns = sqlite.prepare(`PRAGMA table_info(sites_translations)`).all() as { name: string }[];
	const translationsHasContent = translationsColumns.some(col => col.name === 'content');

	console.log('📊 字段状态:');

	if (sitesHasContent) {
		console.log('   ✅ sites 表已有 content 字段');
		console.log('   ℹ️  content 字段不需要翻译（正确）');
	} else {
		console.log('   ❌ sites 表缺少 content 字段');
		console.log('   ⚠️  需要添加 content 字段');
	}

	if (!translationsHasContent) {
		console.log('   ✅ sites_translations 表没有 content 字段（正确，不需要翻译）');
	} else {
		console.log('   ⚠️  sites_translations 表不应该有 content 字段（不需要翻译）');
	}

	// 显示完整的字段列表
	console.log('\n📋 sites 表所有字段:');
	sitesColumns.forEach(({ name }) => {
		let marker = '  ';
		if (name === 'content') {
			marker = '📄';
		}
		console.log(`   ${marker} ${name}`);
	});

	console.log('\n📋 sites_translations 表所有字段:');
	translationsColumns.forEach(({ name }) => {
		let marker = '  ';
		if (name === 'content') {
			marker = '⚠️ ';
		}
		console.log(`   ${marker} ${name}`);
	});

	if (sitesHasContent && !translationsHasContent) {
		console.log('\n✅ content 字段配置正确！');
		console.log('   - sites 表有 content 字段 ✅');
		console.log('   - sites_translations 表没有 content 字段 ✅（不需要翻译）');
	} else if (!sitesHasContent) {
		console.log('\n❌ sites 表缺少 content 字段，需要添加');
	} else if (translationsHasContent) {
		console.log('\n⚠️  配置不正确，content 字段不应该在翻译表中');
	}
}

if (import.meta.main) {
	checkContentFieldStatus();
	process.exit(0);
}

export { checkContentFieldStatus };
