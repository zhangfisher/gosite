/**
 * 将 homepage 字段重命名为 body
 */
import { sqlite } from '../index';

async function renameHomepageToBody() {
	console.log('🔄 开始将 homepage 字段重命名为 body...\n');

	try {
		// 为 sites 表重命名字段
		// SQLite 3.25.0+ 支持 ALTER TABLE RENAME COLUMN
		const renameSitesSQL = `
			ALTER TABLE \`sites\` RENAME COLUMN \`homepage\` TO \`body\`;
		`;

		sqlite.exec(renameSitesSQL);
		console.log('✅ sites 表 homepage -> body 重命名完成');

		// 为 sites_i18n 表重命名字段
		const renameTranslationsSQL = `
			ALTER TABLE \`sites_i18n\` RENAME COLUMN \`homepage\` TO \`body\`;
		`;

		sqlite.exec(renameTranslationsSQL);
		console.log('✅ sites_i18n 表 homepage -> body 重命名完成');

		console.log('\n✅ homepage 字段已成功重命名为 body！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 重命名失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	renameHomepageToBody()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { renameHomepageToBody };
