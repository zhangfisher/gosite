/**
 * 为 sites 表添加 menu 字段
 */
import { sqlite } from './index';

async function addMenuFields() {
	console.log('🔧 开始为 sites 表添加 menu 字段...\n');

	try {
		// 为 sites 表添加 menu 字段
		const alterSitesSQL = `
			ALTER TABLE \`sites\` ADD COLUMN \`menu\` text;
		`;

		sqlite.exec(alterSitesSQL);
		console.log('✅ sites 表添加 menu 字段完成');

		// 为 sites_translations 表添加 menu 字段
		const alterTranslationsSQL = `
			ALTER TABLE \`sites_translations\` ADD COLUMN \`menu\` text;
		`;

		sqlite.exec(alterTranslationsSQL);
		console.log('✅ sites_translations 表添加 menu 字段完成');

		console.log('\n✅ menu 字段添加完成！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 添加 menu 字段失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	addMenuFields()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { addMenuFields };
