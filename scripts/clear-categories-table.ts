import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 清空产品分类表
 *
 * ⚠️  警告：此操作将删除所有产品分类数据和相关的翻译数据
 */
async function clearCategoriesTable() {
	console.log('🧹 准备清空产品分类表...\n');

	// 连接数据库
	const db = new Database(join(import.meta.dir, '../data/data.db'));

	try {
		// 检查当前数据状态
		console.log('📊 当前数据状态:');

		const categoryCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };
		const translationCount = db.query('SELECT COUNT(*) as count FROM product_categories_translations').get() as { count: number };

		console.log(`  • product_categories: ${categoryCount.count} 条记录`);
		console.log(`  • product_categories_translations: ${translationCount.count} 条记录`);

		if (categoryCount.count === 0) {
			console.log('\n✅ 表已经是空的，无需清空');
			db.close();
			return;
		}

		console.log('\n⚠️  即将删除所有产品分类数据和翻译数据');
		console.log('🔄 开始清空操作...\n');

		// 禁用外键约束检查
		db.exec('PRAGMA foreign_keys=OFF');

		// 由于有外键约束，需要先删除翻译表数据
		console.log('📋 删除翻译表数据...');
		const deleteTranslationsResult = db.exec('DELETE FROM product_categories_translations');
		console.log(`  ✅ 已删除 ${deleteTranslationsResult} 条翻译记录`);

		// 删除产品分类数据
		console.log('📋 删除产品分类数据...');
		const deleteCategoriesResult = db.exec('DELETE FROM product_categories');
		console.log(`  ✅ 已删除 ${deleteCategoriesResult} 条分类记录`);

		// 重置自增ID
		console.log('📋 重置自增ID...');
		db.exec("DELETE FROM sqlite_sequence WHERE name='product_categories'");
		db.exec("DELETE FROM sqlite_sequence WHERE name='product_categories_translations'");
		console.log('  ✅ 自增ID已重置');

		// 重新启用外键约束
		db.exec('PRAGMA foreign_keys=ON');

		// 验证清空结果
		const finalCategoryCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };
		const finalTranslationCount = db.query('SELECT COUNT(*) as count FROM product_categories_translations').get() as { count: number };

		console.log('\n🎯 清空结果验证:');
		console.log(`  • product_categories: ${finalCategoryCount.count} 条记录`);
		console.log(`  • product_categories_translations: ${finalTranslationCount.count} 条记录`);

		if (finalCategoryCount.count === 0 && finalTranslationCount.count === 0) {
			console.log('\n🎉 产品分类表清空成功！');
			console.log('✅ 现在可以安全执行初始化操作\n');
		} else {
			console.log('\n❌ 清空操作可能未完全成功，请检查数据库');
		}

	} catch (error) {
		console.error('❌ 清空操作失败:', error.message);
		throw error;
	} finally {
		db.close();
	}
}

// 执行清空操作
console.log('🗑️  开始清空产品分类表...\n');
clearCategoriesTable()
	.then(() => {
		console.log('✅ 清空操作完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 清空操作失败:', error);
		process.exit(1);
	});
