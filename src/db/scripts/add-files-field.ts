/**
 * 为 contents 表新增 files 字段
 * （上传的关联文件名称列表，使用,分开）
 */
import { sqlite } from '../index';

async function addFilesField() {
	console.log('🔄 开始为 contents 表新增 files 字段...\n');

	try {
		const addFilesSQL = `
			ALTER TABLE \`contents\` ADD COLUMN \`files\` text;
		`;
		sqlite.exec(addFilesSQL);
		console.log('✅ contents 表新增 files 字段');

		console.log('\n✅ contents 表字段调整完成！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 调整失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	addFilesField()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { addFilesField };
