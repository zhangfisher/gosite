/**
 * 数据库Schema验证脚本
 *
 * 验证产品表的字段是否正确
 */
import { Database } from 'bun:sqlite';

async function verifySchema() {
	try {
		console.log('🔍 验证数据库Schema...\n');

		// 直接连接到数据库
		const dbPath = `${import.meta.dir}/../../data/data.db`;
		const sqlite = new Database(dbPath);

		// 查询表结构
		const tableSchema = sqlite.prepare(`
			SELECT sql FROM sqlite_master
			WHERE type='table' AND name='products'
		`).get();

		if (tableSchema) {
			console.log('✅ 产品表结构：');
			console.log(tableSchema.sql);
		} else {
			console.log('❌ 未找到产品表');
		}

		// 获取表信息
		const tableInfo = sqlite.prepare(`PRAGMA table_info(products)`).all();

		console.log('\n📋 产品表字段列表：');
		console.table(tableInfo);

		// 检查是否有cover字段
		const hasCover = tableInfo.some((col: any) => col.name === 'cover');
		if (hasCover) {
			console.log('\n✅ cover 字段已成功添加！');
			const coverField = tableInfo.find((col: any) => col.name === 'cover');
			console.log(`📄 cover 字段详情:`, coverField);
		} else {
			console.log('\n❌ cover 字段未找到');
		}

		// 关闭数据库连接
		sqlite.close();
	} catch (error) {
		console.error('❌ Schema验证失败:', error);
	}
}

// 运行验证
verifySchema()
	.then(() => {
		console.log('\n✨ 验证完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('验证执行失败:', error);
		process.exit(1);
	});
