import { db, ProductCategories } from '@/db';
import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 测试单个节点的添加
 */
async function testSingleNodeAdd() {
	console.log('🧪 测试单个节点的添加...\n');

	try {
		// 清空表
		const sqlite = new Database(join(import.meta.dir, '../data/data.db'));
		sqlite.exec('DELETE FROM product_categories');
		sqlite.exec("DELETE FROM sqlite_sequence WHERE name='product_categories'");
		sqlite.close();

		await ProductCategories.treeManager.write(async () => {
			// 创建根节点
			console.log('📋 创建根节点...');
			await ProductCategories.treeManager.createRoot({
				name: '所有产品'
			});

			const rootNode = await ProductCategories.treeManager.getRoot();
			console.log(`  ✅ 根节点: ${rootNode.name} (ID: ${rootNode.id})\n`);

			// 测试单个节点添加
			console.log('📋 测试添加单个子节点...');
			try {
				const result = await ProductCategories.treeManager.addNodes([
					{ name: '按系统组成' }
				], rootNode.id);

				console.log(`  ✅ 成功！返回: ${result}`);

				// 如果成功，验证结果
				const allNodes = await db.query.productCategories.findMany({
					orderBy: (categories, { asc }) => [asc(categories.id)]
				});
				console.log(`\n📊 数据库节点总数: ${allNodes.length}`);
				allNodes.forEach(node => {
					console.log(`    • ${node.name.padEnd(20)} | Level: ${node.level} | Left: ${node.left} | Right: ${node.right}`);
				});

				if (allNodes.length === 2) {
					console.log('\n🎉 单个节点添加成功！');
				}
			} catch (e: any) {
				console.log(`  ❌ 失败: ${e.message}`);
				console.log(`  错误详情:`, e);
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
		throw error;
	}
}

// 执行测试
console.log('🔍 开始测试单个节点添加...\n');
testSingleNodeAdd()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
