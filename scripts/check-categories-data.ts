import { db, ProductCategories } from '@/db';

/**
 * 检查产品分类表当前状态
 */
async function checkCategoriesStatus() {
	console.log('🔍 检查产品分类表当前状态...\n');

	try {
		// 获取树结构
		const tree = ProductCategories.getTree();
		const allNodes = await tree.getNodes();

		console.log(`📊 当前产品分类表状态:`);
		console.log(`  • 总节点数: ${allNodes.length}`);

		if (allNodes.length === 0) {
			console.log('  • 状态: 空表，需要初始化数据');
			console.log('\n✅ 可以安全执行初始化操作');
			return true;
		} else {
			console.log('  • 状态: 已有数据');
			console.log('\n🌳 现有分类树结构:');

			// 按层级分组显示
			const nodesByLevel = new Map();
			allNodes.forEach(node => {
				const level = node.level;
				if (!nodesByLevel.has(level)) {
					nodesByLevel.set(level, []);
				}
				nodesByLevel.get(level).push(node);
			});

			// 显示各级节点
			const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);
			sortedLevels.forEach(level => {
				const nodes = nodesByLevel.get(level);
				console.log(`\n  Level ${level} (${nodes.length} 个节点):`);
				nodes.forEach(node => {
					const indent = '  '.repeat(level + 2);
					console.log(`${indent}• ${node.name} (ID: ${node.id})`);
				});
			});

			console.log('\n⚠️  表中已有数据，请确认是否要清空后重新初始化');
			return false;
		}

	} catch (error) {
		console.error('❌ 检查状态失败:', error.message);
		throw error;
	}
}

// 执行检查
checkCategoriesStatus()
	.then((canInit) => {
		if (canInit) {
			console.log('\n🟢 可以执行初始化操作');
			process.exit(0);
		} else {
			console.log('\n🔴 需要先处理现有数据');
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error('\n❌ 检查失败:', error);
		process.exit(1);
	});
