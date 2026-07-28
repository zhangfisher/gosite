import { Database } from 'bun:sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// 读取迁移文件
const migrationPath = join(import.meta.dir, '../drizzle/0004_stellar_horizon.sql');
const migrationSQL = readFileSync(migrationPath, 'utf-8');

// 连接数据库
const db = new Database(join(import.meta.dir, '../data/data.db'));

try {
	// 启用外键约束
	db.exec('PRAGMA foreign_keys=OFF');

	// 执行迁移（按语句分割）
	const statements = migrationSQL.split('--> statement-breakpoint')
		.map(s => s.trim())
		.filter(s => s.length > 0 && !s.startsWith('--'));

	for (const statement of statements) {
		if (statement.trim()) {
			console.log('执行:', statement.slice(0, 50) + '...');
			db.exec(statement.trim());
		}
	}

	// 重新启用外键约束
	db.exec('PRAGMA foreign_keys=ON');

	console.log('✅ 迁移执行成功！');
} catch (error) {
	console.error('❌ 迁移执行失败:', error.message);
	process.exit(1);
} finally {
	db.close();
}
