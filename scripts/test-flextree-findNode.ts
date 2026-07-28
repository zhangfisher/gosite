import { db, ProductCategories } from '@/db';
import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 测试使用 treeManager.findNode() 方法
 */
async function testFindNode() {
	console.log('🧪 测试使用 treeManager.findNode() 方法...\n');

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

			// 使用 getRoot() 获取根节点
			const rootNode = await ProductCategories.treeManager.getRoot();
			console.log(`  ✅ 根节点: ${rootNode.name} (ID: ${rootNode.id})`);

			// 尝试使用 findNode() 获取节点
			console.log('\n📋 测试 findNode() 方法...');
			try {
				const foundNode = await ProductCategories.treeManager.findNode(rootNode.id);
				console.log(`  ✅ findNode() 成功: ${foundNode.name} (ID: ${foundNode.id})`);
				console.log(`  节点对象类型: ${typeof foundNode}`);
				console.log(`  节点对象:`, JSON.stringify(foundNode, null, 2));
			} catch (e: any) {
				console.log(`  ❌ findNode() 失败: ${e.message}`);
			}

			// 尝试使用 findNode() 返回的对象添加子节点
			console.log('\n📋 使用根节点对象添加子节点...');
			try {
				const result = await ProductCategories.treeManager.addNodes([
					{ name: '按系统组成' },
					{ name: '按无线技术' },
					{ name: '按应用场景' }
				], rootNode);

				console.log(`  ✅ 添加成功`);
				if (result) {
					console.log(`  返回类型: ${typeof result}`);
					if (Array.isArray(result)) {
						console.log(`  数组长度: ${result.length}`);
						result.forEach((node, index) => {
							console.log(`    节点${index + 1}: ${node.name} (ID: ${node.id})`);
						});
					}
				}
			} catch (e: any) {
				console.log(`  ❌ 添加失败: ${e.message}`);
			}

			// 验证结果
			const allNodes = await db.query.productCategories.findMany({
				orderBy: (categories, { asc }) => [asc(categories.id)]
			});
			console.log(`\n📊 数据库中的节点总数: ${allNodes.length}`);
			if (allNodes.length > 1) {
				console.log('  成功创建的节点:');
				allNodes.forEach(node => {
					console.log(`    • ${node.name.padEnd(20)} | Level: ${node.level} | Left: ${node.left} | Right: ${node.right}`);
				});
				console.log('\n🎉 成功使用 FlexTree API 创建子节点！');
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
		throw error;
	}
}

// 执行测试
console.log('🔍 开始测试 findNode() 方法...\n');
testFindNode()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
