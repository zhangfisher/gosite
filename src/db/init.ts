/**
 * 数据库初始化和迁移脚本
 *
 * 用于自动创建数据库和运行迁移
 */
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db, closeDatabase } from './index';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * 确保数据库目录存在
 */
function ensureDatabaseDir() {
	const dbPath = `${import.meta.dir}/../../data/data.db`;
	const dbDir = dirname(dbPath);

	if (!existsSync(dbDir)) {
		console.log(`创建数据库目录: ${dbDir}`);
		mkdirSync(dbDir, { recursive: true });
	}
}

/**
 * 初始化数据库
 */
async function initDatabase() {
	try {
		console.log('🔧 开始初始化数据库...');

		// 确保数据库目录存在
		ensureDatabaseDir();

		// 运行迁移
		console.log('📋 运行数据库迁移...');
		await migrate(db, { migrationsFolder: './drizzle' });

		console.log('✅ 数据库初始化完成！');
		console.log('📍 数据库文件位置: data/data.db');
	} catch (error) {
		console.error('❌ 数据库初始化失败:', error);
		throw error;
	} finally {
		// 关闭数据库连接
		closeDatabase();
	}
}

// 如果直接运行此脚本，执行初始化
if (import.meta.main) {
	initDatabase()
		.then(() => {
			console.log('🎉 初始化完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 初始化失败:', error);
			process.exit(1);
		});
}

export { initDatabase, ensureDatabaseDir };
