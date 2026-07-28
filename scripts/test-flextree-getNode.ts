import { db, ProductCategories } from '@/db';
import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 测试使用 getTree().getNode() 方法
 */
async function testGetTreeNode() {
	console.log('🧪 测试使用 getTree().getNode() 方法...\n');

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

			const tree = ProductCategories.getTree();

			// 使用 getTree().getNode() 获取根节点
			console.log('📋 使用 getTree().getNode() 获取根节点...');
			const rootNode = await tree.getNode(1); // 使用ID获取

			console.log(`  ✅ 获取到根节点: ${rootNode.name} (ID: ${rootNode.id})`);

			// 尝试使用 getNode() 返回的对象添加子节点
			console.log('\n📋 使用 getNode() 返回的对象添加子节点...');
			try {
				const result = await ProductCategories.treeManager.addNodes([
					{ name: '按系统组成' },
					{ name: '按无线技术' },
					{ name: '按应用场景' }
				], rootNode);

				console.log(`  ✅ 添加成功，返回: ${result ? '有返回值' : '无返回值'}`);
				if (Array.isArray(result)) {
					console.log(`  数组长度: ${result.length}`);
					result.forEach((node, index) => {
						console.log(`    节点${index + 1}: ${node.name} (ID: ${node.id})`);
					});
				}
			} catch (e: any) {
				console.log(`  ❌ 添加失败: ${e.message}`);
			}

			// 验证结果
			const allNodes = await db.query.productCategories.findMany();
			console.log(`\n📊 数据库中的节点总数: ${allNodes.length}`);
			allNodes.forEach(node => {
				console.log(`    • ${node.name.padEnd(20)} | Level: ${node.level}`);
			});
		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
		throw error;
	}
}

// 执行测试
console.log('🔍 开始测试 getNode() 方法...\n');
testGetTreeNode()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
