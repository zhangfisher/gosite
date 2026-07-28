import { db } from '@/db';

/**
 * 显示完整的产品分类树结构
 */
async function displayCategoriesTree() {
	console.log('🌳 显示完整产品分类树结构\n');
	console.log('═══════════════════════════════════════════════════════\n');

	try {
		// 获取所有节点，按 left 值排序
		const allNodes = await db.query.productCategories.findMany({
			orderBy: (categories, { asc }) => [asc(categories.left)]
		});

		console.log(`📊 总节点数: ${allNodes.length}\n`);

		// 递归显示树结构
		function displayTree(parentId: number | null, level: number, parentLeft: number, parentRight: number) {
			const indent = '│  '.repeat(level);
			const targetLevel = level + 1;

			// 找到当前层级的所有节点
			const currentLevelNodes = allNodes.filter(node =>
				node.level === targetLevel &&
				node.left > parentLeft &&
				node.right < parentRight
			);

			currentLevelNodes.forEach((node, index) => {
				const isLast = index === currentLevelNodes.length - 1;
				const prefix = isLast ? '└─ ' : '├─ ';

				console.log(`${indent}${prefix}${node.name} (ID: ${node.id})`);

				// 递归显示子节点
				if (node.right - node.left > 1) {
					displayTree(node.id, node.level, node.left, node.right);
				}
			});
		}

		// 获取根节点
		const rootNode = allNodes.find(node => node.level === 0);
		if (rootNode) {
			console.log(`🔹 ${rootNode.name} (ID: ${rootNode.id})`);
			displayTree(rootNode.id, rootNode.level, rootNode.left, rootNode.right);
		}

		console.log('\n═══════════════════════════════════════════════════════\n');

		// 统计信息
		const nodesByLevel = new Map();
		allNodes.forEach(node => {
			const level = node.level;
			if (!nodesByLevel.has(level)) {
				nodesByLevel.set(level, []);
			}
			nodesByLevel.get(level).push(node);
		});

		console.log('📈 各层级统计:');
		for (let level = 0; level <= 3; level++) {
			if (nodesByLevel.has(level)) {
				const count = nodesByLevel.get(level).length;
				console.log(`  Level ${level}: ${count} 个节点`);
			}
		}

		console.log('\n🎯 分类层级结构:');
		console.log('  • Level 0: 根节点 (所有产品)');
		console.log('  • Level 1: 一级分类 (3个主要分类)');
		console.log('  • Level 2: 二级分类 (具体分类)');
		console.log('  • Level 3: 三级分类 (详细系列)');

		console.log('\n✅ 产品分类树结构显示完成！');

	} catch (error) {
		console.error('❌ 显示失败:', error);
		throw error;
	}
}

// 执行显示
console.log('🌲 开始显示产品分类树...\n');
displayCategoriesTree()
	.then(() => {
		console.log('\n✅ 显示完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 显示失败:', error);
		process.exit(1);
	});
