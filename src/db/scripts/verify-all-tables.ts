/**
 * 完整数据库结构验证
 *
 * 验证所有表的创建和关系
 */
import { Database } from 'bun:sqlite';

async function verifyAllTables() {
	try {
		console.log('🔍 验证完整数据库结构...\n');

		// 直接连接到数据库
		const dbPath = `${import.meta.dir}/../../../data/data.db`;
		const sqlite = new Database(dbPath);

		// 获取所有表
		const tables = sqlite.prepare(`
			SELECT name FROM sqlite_master
			WHERE type='table' AND name NOT LIKE 'sqlite_%'
		`).all();

		console.log('📋 数据库表列表：');
		console.table(tables);

		// 验证每个表的结构
		for (const table of tables) {
			const tableName = table.name;
			console.log(`\n📄 表: ${tableName}`);

			// 获取表结构
			const tableInfo = sqlite.prepare(`PRAGMA table_info(${tableName})`).all();
			console.table(tableInfo);

			// 获取外键信息
			const foreignKeys = sqlite.prepare(`PRAGMA foreign_key_list(${tableName})`).all();
			if (foreignKeys.length > 0) {
				console.log(`🔗 外键关系：`);
				console.table(foreignKeys);
			}
		}

		// 获取表的创建SQL
		console.log('\n📝 表创建SQL：');
		for (const table of tables) {
			const tableName = table.name;
			const createSQL = sqlite.prepare(`
				SELECT sql FROM sqlite_master
				WHERE type='table' AND name='${tableName}'
			`).get();

			if (createSQL) {
				console.log(`\n-- ${tableName} --`);
				console.log(createSQL.sql);
			}
		}

		// 关闭数据库连接
		sqlite.close();
	} catch (error) {
		console.error('❌ 数据库验证失败:', error);
	}
}

// 运行验证
verifyAllTables()
	.then(() => {
		console.log('\n✨ 完整验证完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('验证执行失败:', error);
		process.exit(1);
	});
