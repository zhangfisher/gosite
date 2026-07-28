import { db, ProductCategories } from '@/db';

/**
 * 测试添加子节点的最终版本
 */
async function testAddNodes() {
	console.log('🧪 测试添加子节点（最终版）...\n');

	try {
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 创建根节点...');
			await ProductCategories.treeManager.createRoot({
				name: '测试根节点'
			});

			const rootNode = await ProductCategories.treeManager.getRoot();
			console.log(`  ✅ 根节点创建成功 (ID: ${rootNode.id}, 名称: ${rootNode.name})\n`);

			console.log('📋 测试不同的参数传递方式...\n');

			console.log('  方式1: 传递节点对象');
			try {
				await ProductCategories.treeManager.addNodes([
					{ name: '子节点A' }
				], rootNode);
				console.log('  ✅ 方式1成功\n');
			} catch (e1: any) {
				console.log(`  ❌ 方式1失败: ${e1.message}\n`);
			}

			console.log('  方式2: 传递节点ID');
			try {
				await ProductCategories.treeManager.addNodes([
					{ name: '子节点B' }
				], rootNode.id);
				console.log('  ✅ 方式2成功\n');
			} catch (e2: any) {
				console.log(`  ❌ 方式2失败: ${e2.message}\n`);
			}

			console.log('  方式3: 传递节点名称');
			try {
				await ProductCategories.treeManager.addNodes([
					{ name: '子节点C' }
				], rootNode.name);
				console.log('  ✅ 方式3成功\n');
			} catch (e3: any) {
				console.log(`  ❌ 方式3失败: ${e3.message}\n`);
			}

			// 验证数据库中的节点
			console.log('📊 验证数据库中的节点:');
			const allNodes = await db.query.productCategories.findMany({
				orderBy: (categories, { asc }) => [asc(categories.id)]
			});

			console.log(`  总节点数: ${allNodes.length}`);
			console.log('  节点列表:');
			allNodes.forEach(node => {
				console.log(`    • ${node.name.padEnd(15)} | ID: ${node.id} | Level: ${node.level} | Left: ${node.left} | Right: ${node.right}`);
			});

			if (allNodes.length > 1) {
				console.log('\n🎉 成功创建子节点！');
			} else {
				console.log('\n⚠️  未能成功创建子节点');
			}

		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
	}
}

// 执行测试
testAddNodes()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
