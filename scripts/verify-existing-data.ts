import { db, ProductCategories } from '@/db';

/**
 * 验证现有数据是否能被FlexTree正确读取
 */
async function verifyExistingData() {
	console.log('🔍 验证现有数据是否能被FlexTree正确读取...\n');

	try {
		// 检查现有数据
		const allNodes = await db.query.productCategories.findMany({
			orderBy: (categories, { asc }) => [asc(categories.left)]
		});

		console.log(`📊 数据库中现有节点数: ${allNodes.length}`);

		if (allNodes.length === 0) {
			console.log('  ⚠️  数据库为空，需要先创建数据');
			return;
		}

		// 测试FlexTree读取功能
		console.log('\n📋 测试FlexTree读取功能...');

		await ProductCategories.treeManager.write(async () => {
			// 测试getRoot
			const rootNode = await ProductCategories.treeManager.getRoot();
			if (rootNode) {
				console.log('  ✅ getRoot() 成功');
				console.log(`    根节点: ${rootNode.name} (ID: ${rootNode.id})`);
			} else {
				console.log('  ❌ getRoot() 失败');
			}

			// 测试findNode
			try {
				const testNode = await ProductCategories.treeManager.findNode(2);
				if (testNode) {
					console.log('  ✅ findNode() 成功');
					console.log(`    找到节点: ${testNode.name} (ID: ${testNode.id})`);
				}
			} catch (e: any) {
				console.log(`  ❌ findNode() 失败: ${e.message}`);
			}

			// 显示树结构
			console.log('\n🌳 现有数据树结构:');
			displayTree(allNodes, 0, 1, Math.max(...allNodes.map(n => n.right)));
		});

		console.log('\n✅ FlexTree读取功能验证完成');

	} catch (error) {
		console.error('❌ 验证失败:', error);
		throw error;
	}
}

function displayTree(nodes: any[], level: number, minLeft: number, maxRight: number) {
	const currentLevelNodes = nodes.filter(n =>
		n.level === level &&
		n.left > minLeft &&
		n.right < maxRight
	);

	currentLevelNodes.forEach(node => {
		const indent = '│  '.repeat(level);
		const prefix = level === 0 ? '🔹 ' : '├─ ';
		console.log(`${indent}${prefix}${node.name} (ID: ${node.id}, L:${node.left}, R:${node.right})`);

		// 递归显示子节点
		if (node.right - node.left > 1) {
			displayTree(nodes, level + 1, node.left, node.right);
		}
	});
}

// 执行验证
verifyExistingData()
	.then(() => {
		console.log('\n✅ 验证完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 验证失败:', error);
		process.exit(1);
	});
