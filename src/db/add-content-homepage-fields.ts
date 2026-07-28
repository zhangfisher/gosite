/**
 * 为 sites 表添加 content 和 homepage 字段
 */
import { sqlite } from './index';

async function addContentAndHomepageFields() {
	console.log('🔧 开始为 sites 表添加 content 和 homepage 字段...\n');

	try {
		// 为 sites 表添加 content 字段
		const alterSitesContentSQL = `
			ALTER TABLE \`sites\` ADD COLUMN \`content\` text;
		`;

		sqlite.exec(alterSitesContentSQL);
		console.log('✅ sites 表添加 content 字段完成');

		// 为 sites 表添加 homepage 字段
		const alterSitesHomepageSQL = `
			ALTER TABLE \`sites\` ADD COLUMN \`homepage\` text;
		`;

		sqlite.exec(alterSitesHomepageSQL);
		console.log('✅ sites 表添加 homepage 字段完成');

		// 为 sites_translations 表添加 homepage 字段
		const alterTranslationsHomepageSQL = `
			ALTER TABLE \`sites_translations\` ADD COLUMN \`homepage\` text;
		`;

		sqlite.exec(alterTranslationsHomepageSQL);
		console.log('✅ sites_translations 表添加 homepage 翻译字段完成');

		console.log('\n✅ content 和 homepage 字段添加完成！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 添加字段失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	addContentAndHomepageFields()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { addContentAndHomepageFields };
