import { db, ProductCategories } from '@/db';

/**
 * 测试添加子节点
 */
async function testAddNodes() {
	console.log('🧪 测试添加子节点...\n');

	try {
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 创建根节点...');
			await ProductCategories.treeManager.createRoot({
				name: '测试根节点'
			});

			const rootNode = await ProductCategories.treeManager.getRoot();
			console.log(`  ✅ 根节点创建成功 (ID: ${rootNode.id})\n`);

			console.log('📋 添加子节点到根节点...');
			console.log('  尝试方式1: 传递节点对象');
			try {
				const addResult1 = await ProductCategories.treeManager.addNodes([
					{ name: '子节点A' }
				], rootNode);
				console.log('  ✅ 方式1成功，返回:', addResult1);
			} catch (e1) {
				console.log('  ❌ 方式1失败:', e1.message);
			}

			console.log('\n  尝试方式2: 传递节点ID');
			try {
				const addResult2 = await ProductCategories.treeManager.addNodes([
					{ name: '子节点B' }
				], rootNode.id);
				console.log('  ✅ 方式2成功，返回:', addResult2);
			} catch (e2) {
				console.log('  ❌ 方式2失败:', e2.message);
			}

			console.log('\n  尝试方式3: 传递节点名称');
			try {
				const addResult3 = await ProductCategories.treeManager.addNodes([
					{ name: '子节点C' }
				], rootNode.name);
				console.log('  ✅ 方式3成功，返回:', addResult3);
			} catch (e3) {
				console.log('  ❌ 方式3失败:', e3.message);
			}

			console.log('🎯 addNodes 返回结果:');
			console.log('  类型:', typeof addResult);
			console.log('  是否为数组:', Array.isArray(addResult));

			if (Array.isArray(addResult)) {
				console.log(`  数组长度: ${addResult.length}`);
				if (addResult.length > 0) {
					console.log('  第一个节点:', addResult[0]);
					console.log('  所有节点名称:', addResult.map(n => n.name));
				}
			} else if (addResult && typeof addResult === 'object') {
				console.log('  单个对象:', addResult);
			} else {
				console.log('  返回值:', addResult);
			}

			// 验证节点是否真正创建
			const allNodes = await db.query.productCategories.findMany();
			console.log(`\n📊 数据库中的节点总数: ${allNodes.length}`);
			console.log('所有节点:');
			allNodes.forEach(node => {
				console.log(`  • ${node.name.padEnd(20)} | Level: ${node.level} | ID: ${node.id} | Left: ${node.left} | Right: ${node.right}`);
			});

		});

	} catch (error) {
		console.error('❌ 测试失败:', error.message);
		console.error('错误详情:', error);
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
