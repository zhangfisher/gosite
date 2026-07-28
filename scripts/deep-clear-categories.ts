import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 深度清空产品分类表
 *
 * 完全重置表数据和结构
 */
async function deepClearCategories() {
	console.log('🧹 深度清空产品分类表...\n');

	const db = new Database(join(import.meta.dir, '../data/data.db'));

	try {
		// 检查当前数据状态
		const categoryCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };
		console.log(`📊 当前记录数: ${categoryCount.count}`);

		// 禁用外键约束
		db.exec('PRAGMA foreign_keys=OFF');

		// 删除所有数据
		console.log('🗑️  删除所有数据...');
		db.exec('DELETE FROM product_categories_translations');
		db.exec('DELETE FROM product_categories');

		// 重置自增ID
		console.log('🔄 重置自增ID...');
		db.exec("DELETE FROM sqlite_sequence WHERE name='product_categories'");
		db.exec("DELETE FROM sqlite_sequence WHERE name='product_categories_translations'");

		// 重新启用外键约束
		db.exec('PRAGMA foreign_keys=ON');

		// 验证结果
		const finalCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };

		console.log(`\n🎯 最终记录数: ${finalCount.count}`);

		if (finalCount.count === 0) {
			console.log('✅ 表已完全清空');
		} else {
			console.log('❌ 清空失败，表中仍有数据');
		}

		// 检查表结构
		console.log('\n📋 验证表结构...');
		const columns = db.query("PRAGMA table_info(product_categories)").all() as any[];
		console.log(`✅ 表结构正常，包含 ${columns.length} 个字段`);

	} catch (error) {
		console.error('❌ 清空失败:', error.message);
		throw error;
	} finally {
		db.close();
	}
}

// 执行清空
deepClearCategories()
	.then(() => {
		console.log('\n✅ 深度清空完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 清空失败:', error);
		process.exit(1);
	});
