/**
 * 验证 header 和 footer 字段是否正确添加
 */
import { sqlite } from './index';

function verifyHeaderFooterFields() {
	console.log('🔍 验证 header 和 footer 字段...\n');

	// 检查 sites 表的字段
	const sitesColumns = sqlite.prepare(`PRAGMA table_info(sites)`).all() as { name: string; type: string }[];

	console.log('📋 sites 表完整字段列表:');
	sitesColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'header' || name === 'footer') {
			marker = '🆕';
		} else if (name === 'menu' || name === 'homepage' || name === 'content') {
			marker = '📄';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 检查 sites_translations 表的字段
	const translationsColumns = sqlite.prepare(`PRAGMA table_info(sites_translations)`).all() as { name: string; type: string }[];

	console.log('\n📋 sites_translations 表完整字段列表:');
	translationsColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'header' || name === 'footer') {
			marker = '🆕';
		} else if (name === 'menu' || name === 'homepage') {
			marker = '📄';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 验证关键字段
	console.log('\n🔍 字段验证:');

	const sitesHasHeader = sitesColumns.some(col => col.name === 'header');
	const sitesHasFooter = sitesColumns.some(col => col.name === 'footer');
	const translationsHasHeader = translationsColumns.some(col => col.name === 'header');
	const translationsHasFooter = translationsColumns.some(col => col.name === 'footer');

	if (sitesHasHeader) {
		console.log('   ✅ sites 表有 header 字段');
	} else {
		console.log('   ❌ sites 表缺少 header 字段');
	}

	if (sitesHasFooter) {
		console.log('   ✅ sites 表有 footer 字段');
	} else {
		console.log('   ❌ sites 表缺少 footer 字段');
	}

	if (translationsHasHeader) {
		console.log('   ✅ sites_translations 表有 header 翻译字段');
	} else {
		console.log('   ❌ sites_translations 表缺少 header 翻译字段');
	}

	if (translationsHasFooter) {
		console.log('   ✅ sites_translations 表有 footer 翻译字段');
	} else {
		console.log('   ❌ sites_translations 表缺少 footer 翻译字段');
	}

	// 统计翻译字段
	console.log('\n📊 翻译字段统计:');
	const translatableFields = ['title', 'keywords', 'description', 'contacts', 'socials', 'copyright', 'privacy_policy', 'cookie_declaration', 'filing', 'menu', 'homepage', 'header', 'footer'];
	const existingTranslatableFields = translatableFields.filter(field =>
		translationsColumns.some(col => col.name === field)
	);

	console.log(`   翻译字段总数: ${existingTranslatableFields.length}/${translatableFields.length}`);
	console.log(`   支持的翻译字段: ${existingTranslatableFields.join(', ')}`);

	if (sitesHasHeader && sitesHasFooter && translationsHasHeader && translationsHasFooter) {
		console.log('\n✅ 所有字段验证完成！header 和 footer 字段已正确添加，支持翻译。');
	} else {
		console.log('\n❌ 字段验证失败！');
	}
}

if (import.meta.main) {
	verifyHeaderFooterFields();
	process.exit(0);
}

export { verifyHeaderFooterFields };
