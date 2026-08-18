/**
 * 手动创建 sites 和 sites_i18n 表
 *
 * 由于 drizzle-kit 的交互式限制，此脚本直接执行 SQL 创建表
 */
import { sqlite } from '../index';

/**
 * 创建 sites 表
 */
function createSitesTable() {
	const sql = `
-- 创建站点表
-- 用于存储多站点的基本信息
CREATE TABLE IF NOT EXISTS \`sites\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`name\` text NOT NULL UNIQUE,
	\`title\` text NOT NULL,
	\`logo\` text,
	\`cover\` text,
	\`description\` text,
	\`keywords\` text,
	\`contacts\` text,
	\`socials\` text,
	\`copyright\` text,
	\`privacy_policy\` text,
	\`cookie_declaration\` text,
	\`filing\` text,
	\`languages\` text,
	\`created_at\` integer NOT NULL DEFAULT (strftime('%s', 'now')),
	\`updated_at\` integer NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS \`sites_name_index\` ON \`sites\`(\`name\`);
	`;

	sqlite.exec(sql);
	console.log('✅ 创建 sites 表');
}

/**
 * 创建 sites_i18n 表
 */
function createSitesTranslationsTable() {
	const sql = `
-- 创建站点翻译表
-- 用于存储站点的多语言翻译内容
CREATE TABLE IF NOT EXISTS \`sites_i18n\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`site_id\` integer NOT NULL,
	\`language\` text NOT NULL,
	\`title\` text,
	\`keywords\` text,
	\`description\` text,
	\`contacts\` text,
	\`socials\` text,
	\`copyright\` text,
	\`privacy_policy\` text,
	\`cookie_declaration\` text,
	\`filing\` text,
	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS \`sites_i18n_site_id_index\` ON \`sites_i18n\`(\`site_id\`);
CREATE INDEX IF NOT EXISTS \`sites_i18n_language_index\` ON \`sites_i18n\`(\`language\`);
CREATE UNIQUE INDEX IF NOT EXISTS \`sites_i18n_site_language_unique\` ON \`sites_i18n\`(\`site_id\`, \`language\`);
	`;

	sqlite.exec(sql);
	console.log('✅ 创建 sites_i18n 表');
}

/**
 * 执行所有表创建
 */
async function createAllTables() {
	try {
		console.log('🔧 开始创建 sites 相关表...');

		createSitesTable();
		createSitesTranslationsTable();

		console.log('✅ 所有表创建完成！');
	} catch (error) {
		console.error('❌ 表创建失败:', error);
		throw error;
	}
}

// 如果直接运行此脚本，执行创建
if (import.meta.main) {
	createAllTables()
		.then(() => {
			console.log('🎉 表创建完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 表创建失败:', error);
			process.exit(1);
		});
}

export { createAllTables };
