/**
 * 数据库初始化和迁移脚本
 *
 * 用于自动创建数据库和运行迁移
 */
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { sql } from 'drizzle-orm';
import { db, sqlite, closeDatabase } from './index';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { auth } from '../lib/auth';
import { seedSettings } from './seed';

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
 * 创建初始管理员账号（若不存在）
 *
 * 通过 better-auth 的 signUpEmail 创建，密码会被正确哈希存储。
 * 仅在 user 表为空时执行，重复运行不会报错。
 */
async function seedInitialAdmin() {
	const result = sqlite
		.query('SELECT count(*) as n FROM user')
		.get() as { n: number };
	if (result.n > 0) {
		console.log('👤 已存在用户，跳过初始管理员创建');
		return;
	}

	const username = process.env.ADMIN_USERNAME || 'admin';
	const email = process.env.ADMIN_EMAIL || 'admin@example.com';
	const password = process.env.ADMIN_PASSWORD || '22182666@hyt';
	const name = process.env.ADMIN_NAME || 'Admin';

	try {
		await auth.api.signUpEmail({
			body: { username, email, password, name },
			headers: new Headers(),
		});
		console.log(`👤 已创建初始管理员账号：用户名=${username}，邮箱=${email}`);
	} catch (err: any) {
		// 用户名/邮箱已存在时忽略，保证幂等
		const code = err?.body?.code ?? err?.code;
		if (code === 'USERNAME_IS_ALREADY_TAKEN' || code === 'EMAIL_ALREADY_EXISTS') {
			console.log('👤 初始管理员已存在，跳过创建');
			return;
		}
		throw err;
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

		// 创建初始管理员账号
		console.log('📋 创建初始管理员账号...');
		await seedInitialAdmin();

		// 创建管理员默认配置
		console.log('📋 创建管理员默认配置...');
		await seedSettings();

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
