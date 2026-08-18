/**
 * 按当前 schema 创建 contents 与 contents_i18n 表
 *
 * 由于现有数据库的迁移历史（drizzle journal）仅应用到 0003，
 * 而 0004-0012 的迁移 SQL 处于游离状态未被应用，导致 contents 表从未被创建。
 * 本脚本依据 src/db/schema/contents.ts 与 contents_i18n.ts 的当前定义建表。
 */
import { sqlite } from '../index';

async function createContentsTables() {
	console.log('🔄 开始创建 contents 相关表...\n');

	try {
		const createContentsSQL = `
			CREATE TABLE IF NOT EXISTS \`contents\` (
				\`id\` integer PRIMARY KEY NOT NULL,
				\`name\` text NOT NULL,
				\`title\` text NOT NULL,
				\`level\` integer NOT NULL,
				\`left\` integer NOT NULL,
				\`right\` integer NOT NULL,
				\`description\` text,
				\`keywords\` text,
				\`url\` text,
				\`icon\` text,
				\`cover\` text,
				\`images\` text,
				\`content\` text,
				\`source\` text,
				\`stars\` integer DEFAULT 0 NOT NULL,
				\`type\` integer DEFAULT 0 NOT NULL,
				\`tags\` text,
				\`video\` text,
				\`ref\` integer REFERENCES \`contents\`(\`id\`) ON DELETE RESTRICT,
				\`created_at\` integer NOT NULL,
				\`updated_at\` integer NOT NULL
			);
		`;
		sqlite.exec(createContentsSQL);
		console.log('✅ 创建 contents 表（含 source 字段，不含 html/click/prompt）');

		const createTranslationsSQL = `
			CREATE TABLE IF NOT EXISTS \`contents_i18n\` (
				\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
				\`content_id\` integer NOT NULL REFERENCES \`contents\`(\`id\`) ON DELETE CASCADE,
				\`language\` text NOT NULL,
				\`title\` text NOT NULL,
				\`content\` text NOT NULL,
				\`html\` text,
				\`tags\` text
			);
		`;
		sqlite.exec(createTranslationsSQL);
		console.log('✅ 创建 contents_i18n 表');

		console.log('\n✅ contents 相关表已就绪！');
		return Promise.resolve();

	} catch (error) {
		console.error('❌ 创建失败:', error);
		return Promise.reject(error);
	}
}

if (import.meta.main) {
	createContentsTables()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { createContentsTables };
