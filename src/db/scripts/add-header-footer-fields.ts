/**
 * 为 sites 表添加 header 和 footer 字段
 */
import { sqlite } from '../index';

async function addHeaderAndFooterFields() {
	console.log('🔧 开始为 sites 表添加 header 和 footer 字段...\n');

	try {
		// 为 sites 表添加 header 字段
		const alterSitesHeaderSQL = `
			ALTER TABLE \`sites\` ADD COLUMN \`header\` text;
		`;

		sqlite.exec(alterSitesHeaderSQL);
		console.log('✅ sites 表添加 header 字段完成');

		// 为 sites 表添加 footer 字段
		const alterSitesFooterSQL = `
			ALTER TABLE \`sites\` ADD COLUMN \`footer\` text;
		`;

		sqlite.exec(alterSitesFooterSQL);
		console.log('✅ sites 表添加 footer 字段完成');

		// 为 sites_translations 表添加 header 翻译字段
		const alterTranslationsHeaderSQL = `
			ALTER TABLE \`sites_translations\` ADD COLUMN \`header\` text;
		`;

		sqlite.exec(alterTranslationsHeaderSQL);
		console.log('✅ sites_translations 表添加 header 翻译字段完成');

		// 为 sites_translations 表添加 footer 翻译字段
		const alterTranslationsFooterSQL = `
			ALTER TABLE \`sites_translations\` ADD COLUMN \`footer\` text;
		`;

		sqlite.exec(alterTranslationsFooterSQL);
		console.log('✅ sites_translations 表添加 footer 翻译字段完成');

		console.log('\n✅ header 和 footer 字段添加完成！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 添加字段失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	addHeaderAndFooterFields()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { addHeaderAndFooterFields };
