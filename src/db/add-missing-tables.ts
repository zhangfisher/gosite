/**
 * 添加缺少的 product_category_relations 表
 */
import { sqlite } from './index';

function createProductCategoryRelationsTable() {
	const sql = `
-- 创建产品分类关联表（中间表）
-- 用于实现产品和分类的多对多关系
CREATE TABLE IF NOT EXISTS \`product_category_relations\` (
	\`product_id\` integer NOT NULL,
	\`category_id\` integer NOT NULL,
	\`created_at\` integer NOT NULL DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS \`product_category_relations_product_id_index\` ON \`product_category_relations\`(\`product_id\`);
CREATE INDEX IF NOT EXISTS \`product_category_relations_category_id_index\` ON \`product_category_relations\`(\`category_id\`);
-- 创建复合唯一索引，确保同一个产品不会重复关联到同一个分类
CREATE UNIQUE INDEX IF NOT EXISTS \`product_category_relations_unique\` ON \`product_category_relations\`(\`product_id\`, \`category_id\`);
	`;

	sqlite.exec(sql);
	console.log('✅ 创建 product_category_relations 表');
}

function createProductsTranslationsTable() {
	const sql = `
-- 创建产品翻译表
CREATE TABLE IF NOT EXISTS \`products_translations\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`product_id\` integer NOT NULL,
	\`language\` text NOT NULL,
	\`title\` text NOT NULL,
	\`content\` text NOT NULL,
	\`html\` text,
	\`tags\` text,
	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS \`products_translations_product_id_index\` ON \`products_translations\`(\`product_id\`);
CREATE INDEX IF NOT EXISTS \`products_translations_language_index\` ON \`products_translations\`(\`language\`);
CREATE UNIQUE INDEX IF NOT EXISTS \`products_translations_product_language_unique\` ON \`products_translations\`(\`product_id\`, \`language\`);
	`;

	sqlite.exec(sql);
	console.log('✅ 创建 products_translations 表');
}

function createProductCategoriesTranslationsTable() {
	const sql = `
-- 创建产品分类翻译表
CREATE TABLE IF NOT EXISTS \`product_categories_translations\` (
	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	\`category_id\` integer NOT NULL,
	\`language\` text NOT NULL,
	\`title\` text NOT NULL,
	\`description\` text,
	FOREIGN KEY (\`category_id\`) REFERENCES \`product_categories\`(\`id\`) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS \`product_categories_translations_category_id_index\` ON \`product_categories_translations\`(\`category_id\`);
CREATE INDEX IF NOT EXISTS \`product_categories_translations_language_index\` ON \`product_categories_translations\`(\`language\`);
CREATE UNIQUE INDEX IF NOT EXISTS \`product_categories_translations_category_language_unique\` ON \`product_categories_translations\`(\`category_id\`, \`language\`);
	`;

	sqlite.exec(sql);
	console.log('✅ 创建 product_categories_translations 表');
}

async function addMissingTables() {
	try {
		console.log('🔧 开始添加缺少的表...\n');

		// 检查并添加 product_category_relations 表
		const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='product_category_relations'").get() as { name: string } | undefined;
		if (!tables) {
			createProductCategoryRelationsTable();
		} else {
			console.log('ℹ️ product_category_relations 表已存在');
		}

		// 检查并添加其他可能缺少的表
		const productsTranslations = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products_translations'").get() as { name: string } | undefined;
		if (!productsTranslations) {
			createProductsTranslationsTable();
		} else {
			console.log('ℹ️ products_translations 表已存在');
		}

		const categoriesTranslations = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='product_categories_translations'").get() as { name: string } | undefined;
		if (!categoriesTranslations) {
			createProductCategoriesTranslationsTable();
		} else {
			console.log('ℹ️ product_categories_translations 表已存在');
		}

		console.log('\n✅ 所有缺少的表已添加完成！');
	} catch (error) {
		console.error('❌ 添加表失败:', error);
		throw error;
	}
}

if (import.meta.main) {
	addMissingTables()
		.then(() => {
			console.log('\n🎉 完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 失败:', error);
			process.exit(1);
		});
}

export { addMissingTables };
