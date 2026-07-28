import { Database } from 'bun:sqlite';

const db = new Database('data/data.db');

try {
	console.log('🔄 开始数据库迁移...');

	// 分步执行迁移
	db.exec('PRAGMA foreign_keys=OFF;');
	console.log('✅ 外键约束已禁用');

	db.exec(`
	CREATE TABLE \`__new_categories\` (
		\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		\`name\` text NOT NULL,
		\`level\` integer NOT NULL,
		\`left\` integer NOT NULL,
		\`right\` integer NOT NULL,
		\`created_at\` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
		\`updated_at\` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
		\`icon\` text,
		\`cover\` text,
		\`description\` text
	)`);
	console.log('✅ 新表创建成功');

	db.exec('INSERT INTO \`__new_categories\`("id", "name", "level", "left", "right", "created_at", "updated_at", "icon", "cover", "description") SELECT "id", "name", "level", "left", "right", COALESCE("created_at", CURRENT_TIMESTAMP), COALESCE("updated_at", CURRENT_TIMESTAMP), "icon", "cover", "description" FROM \`categories\`;');
	console.log('✅ 数据迁移成功');

	db.exec('DROP TABLE \`categories\`;');
	console.log('✅ 旧表删除成功');

	db.exec('ALTER TABLE \`__new_categories\` RENAME TO \`categories\`;');
	console.log('✅ 表重命名成功');

	db.exec('PRAGMA foreign_keys=ON;');
	console.log('✅ 外键约束已启用');

	console.log('🎉 迁移完成！');
} catch (error) {
	console.error('❌ 迁移失败:', error);
	process.exit(1);
} finally {
	db.close();
}