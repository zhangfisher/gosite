/**
 * 移除 contents 表的 html、click、prompt 字段
 * 并新增 source 字段
 */
import { sqlite } from '../index';

async function alterContentsTable() {
	console.log('🔄 开始调整 contents 表的字段...\n');

	try {
		// 新增 source 字段
		const addSourceSQL = `
			ALTER TABLE \`contents\` ADD COLUMN \`source\` text;
		`;
		sqlite.exec(addSourceSQL);
		console.log('✅ contents 表新增 source 字段');

		// 移除 html 字段
		const dropHtmlSQL = `
			ALTER TABLE \`contents\` DROP COLUMN \`html\`;
		`;
		sqlite.exec(dropHtmlSQL);
		console.log('✅ contents 表移除 html 字段');

		// 移除 click 字段
		const dropClickSQL = `
			ALTER TABLE \`contents\` DROP COLUMN \`click\`;
		`;
		sqlite.exec(dropClickSQL);
		console.log('✅ contents 表移除 click 字段');

		// 移除 prompt 字段
		const dropPromptSQL = `
			ALTER TABLE \`contents\` DROP COLUMN \`prompt\`;
		`;
		sqlite.exec(dropPromptSQL);
		console.log('✅ contents 表移除 prompt 字段');

		console.log('\n✅ contents 表字段调整完成！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 调整失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	alterContentsTable()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { alterContentsTable };
