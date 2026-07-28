import { db, ProductCategories } from '@/db';

/**
 * 测试获取根节点
 */
async function testGetRoot() {
	console.log('🧪 测试获取根节点...\n');

	try {
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 创建根节点...');
			await ProductCategories.treeManager.createRoot({
				name: '测试根节点'
			});

			console.log('📋 使用 treeManager.getRoot() 获取根节点...\n');

			// 使用 FlexTree 的 getRoot 方法
			const rootNode = await ProductCategories.treeManager.getRoot();

			console.log('🎯 getRoot() 返回结果:');
			console.log('  类型:', typeof rootNode);
			console.log('  是否为对象:', typeof rootNode === 'object');
			console.log('  内容:', JSON.stringify(rootNode, null, 2));

			if (rootNode) {
				console.log('\n✅ 成功获取根节点');
				console.log(`  ID: ${rootNode.id}`);
				console.log(`  名称: ${rootNode.name}`);
				console.log(`  层级: ${rootNode.level}`);
				console.log(`  左值: ${rootNode.left}`);
				console.log(`  右值: ${rootNode.right}`);
			} else {
				console.log('\n❌ 未能获取根节点');
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error.message);
		console.error('错误详情:', error);
	}
}

// 执行测试
testGetRoot()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
