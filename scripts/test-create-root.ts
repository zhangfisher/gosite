import { db, ProductCategories } from '@/db';

/**
 * 测试创建根节点
 */
async function testCreateRoot() {
	console.log('🧪 测试创建根节点...\n');

	try {
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 调用 createRoot 方法...\n');

			const rootResult = await ProductCategories.treeManager.createRoot({
				name: '测试根节点'
			});

			console.log('🎯 createRoot 返回结果:');
			console.log('  类型:', typeof rootResult);
			console.log('  是否为数组:', Array.isArray(rootResult));
			console.log('  内容:', JSON.stringify(rootResult, null, 2));

			if (rootResult) {
				if (Array.isArray(rootResult)) {
					console.log(`\n✅ 创建成功，返回数组，包含 ${rootResult.length} 个节点`);
					if (rootResult.length > 0) {
						console.log('  第一个节点:', rootResult[0]);
					}
				} else {
					console.log('\n✅ 创建成功，返回单个节点对象');
					console.log('  节点信息:', rootResult);
				}
			} else {
				console.log('\n❌ 创建失败，返回值为 null 或 undefined');
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error.message);
		console.error('错误详情:', error);
	}
}

// 执行测试
testCreateRoot()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
