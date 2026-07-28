/**
 * 验证 homepage 字段是否已重命名为 body
 */
import { sqlite } from './index';

function verifyBodyFieldRename() {
	console.log('🔍 验证 homepage 字段重命名为 body...\n');

	// 检查 sites 表的字段
	const sitesColumns = sqlite.prepare(`PRAGMA table_info(sites)`).all() as { name: string; type: string }[];

	console.log('📋 sites 表字段列表:');
	sitesColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'body') {
			marker = '🆕';
		} else if (name === 'homepage') {
			marker = '⚠️ ';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 检查 sites_translations 表的字段
	const translationsColumns = sqlite.prepare(`PRAGMA table_info(sites_translations)`).all() as { name: string; type: string }[];

	console.log('\n📋 sites_translations 表字段列表:');
	translationsColumns.forEach(({ name, type }) => {
		let marker = '  ';
		if (name === 'body') {
			marker = '🆕';
		} else if (name === 'homepage') {
			marker = '⚠️ ';
		}
		console.log(`   ${marker} ${name} (${type})`);
	});

	// 验证重命名结果
	console.log('\n🔍 验证结果:');

	const sitesHasBody = sitesColumns.some(col => col.name === 'body');
	const sitesHasHomepage = sitesColumns.some(col => col.name === 'homepage');
	const translationsHasBody = translationsColumns.some(col => col.name === 'body');
	const translationsHasHomepage = translationsColumns.some(col => col.name === 'homepage');

	if (sitesHasBody && !sitesHasHomepage) {
		console.log('   ✅ sites 表 homepage 已重命名为 body');
	} else if (sitesHasHomepage) {
		console.log('   ❌ sites 表仍存在 homepage 字段，重命名失败');
	} else if (!sitesHasBody) {
		console.log('   ❌ sites 表缺少 body 字段');
	}

	if (translationsHasBody && !translationsHasHomepage) {
		console.log('   ✅ sites_translations 表 homepage 已重命名为 body');
	} else if (translationsHasHomepage) {
		console.log('   ❌ sites_translations 表仍存在 homepage 字段，重命名失败');
	} else if (!translationsHasBody) {
		console.log('   ❌ sites_translations 表缺少 body 字段');
	}

	// 更新翻译字段列表
	console.log('\n📊 更新后的翻译字段列表:');
	const translatableFields = ['title', 'keywords', 'description', 'contacts', 'socials', 'copyright', 'privacy_policy', 'cookie_declaration', 'filing', 'menu', 'body', 'header', 'footer'];
	const existingTranslatableFields = translatableFields.filter(field =>
		translationsColumns.some(col => col.name === field)
	);

	console.log(`   翻译字段总数: ${existingTranslatableFields.length}/${translatableFields.length}`);
	console.log(`   支持的翻译字段: ${existingTranslatableFields.join(', ')}`);

	if (sitesHasBody && !sitesHasHomepage && translationsHasBody && !translationsHasHomepage) {
		console.log('\n✅ 所有字段重命名成功！homepage → body');
	} else {
		console.log('\n❌ 字段重命名验证失败！');
	}
}

if (import.meta.main) {
	verifyBodyFieldRename();
	process.exit(0);
}

export { verifyBodyFieldRename };
