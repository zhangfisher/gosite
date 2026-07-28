import { db, ProductCategories } from '@/db';
import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 测试各种参数格式
 */
async function testVariousFormats() {
	console.log('🧪 测试各种参数格式...\n');

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

			// 测试不同的参数格式
			const testCases = [
				{ name: '数字ID', param: rootNode.id },
				{ name: '字符串ID', param: String(rootNode.id) },
				{ name: '节点名称', param: rootNode.name },
				{ name: '节点对象', param: rootNode },
				{ name: '简化节点对象', param: { id: rootNode.id, name: rootNode.name } },
			];

			for (const testCase of testCases) {
				console.log(`📋 测试: ${testCase.name}`);
				console.log(`  参数类型: ${typeof testCase.param}`);
				console.log(`  参数值:`, typeof testCase.param === 'object' ? `{ id: ${testCase.param.id}, name: "${testCase.param.name}" }` : testCase.param);

				try {
					const result = await ProductCategories.treeManager.addNodes([
						{ name: `测试子节点-${testCase.name}` }
					], testCase.param as any);

					console.log(`  ✅ 成功！返回: ${result ? '有返回值' : '无返回值'}`);

					// 如果成功，就不再测试其他格式
					if (result) {
						console.log(`\n🎉 找到正确的参数格式: ${testCase.name}`);

						// 验证结果
						const allNodes = await db.query.productCategories.findMany();
						console.log(`\n📊 数据库节点总数: ${allNodes.length}`);
						if (allNodes.length > 1) {
							console.log('  成功创建的节点:');
							allNodes.forEach(node => {
								console.log(`    • ${node.name.padEnd(25)} | Level: ${node.level}`);
							});
						}
						break; // 找到成功的格式就退出
					}
				} catch (e: any) {
					console.log(`  ❌ 失败: ${e.message}`);
				}
				console.log('');
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
		throw error;
	}
}

// 执行测试
console.log('🔍 开始测试各种参数格式...\n');
testVariousFormats()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
