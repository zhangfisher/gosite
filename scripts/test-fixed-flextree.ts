import { db, ProductCategories } from '@/db';
import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 测试修复后的 FlexTree API
 */
async function testFixedFlexTree() {
	console.log('🧪 测试修复后的 FlexTree API...\n');

	try {
		// 先清空表
		console.log('🗑️  清空产品分类表...');
		const sqlite = new Database(join(import.meta.dir, '../data/data.db'));
		sqlite.exec('DELETE FROM product_categories_translations');
		sqlite.exec('DELETE FROM product_categories');
		sqlite.exec("DELETE FROM sqlite_sequence WHERE name='product_categories'");
		sqlite.exec("DELETE FROM sqlite_sequence WHERE name='product_categories_translations'");
		sqlite.close();
		console.log('  ✅ 表已清空\n');

		// 测试创建根节点和子节点
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 测试创建根节点...');
			await ProductCategories.treeManager.createRoot({
				name: '所有产品'
			});

			const rootNode = await ProductCategories.treeManager.getRoot();
			console.log(`  ✅ 根节点创建成功 (ID: ${rootNode.id}, 名称: ${rootNode.name})\n`);

			console.log('📋 测试添加子节点...');

			// 尝试不同的参数格式
			console.log('  方式1: 传递节点ID');
			try {
				const result1 = await ProductCategories.treeManager.addNodes([
					{ name: '按系统组成' },
					{ name: '按无线技术' },
					{ name: '按应用场景' }
				], rootNode.id);
				console.log(`  ✅ 方式1成功，返回: ${Array.isArray(result1) ? result1.length + '个节点' : typeof result1}`);
			} catch (e1: any) {
				console.log(`  ❌ 方式1失败: ${e1.message}`);
			}

			// 验证结果
			const allNodes = await db.query.productCategories.findMany({
				orderBy: (categories, { asc }) => [asc(categories.id)]
			});

			console.log(`\n📊 数据库中的节点总数: ${allNodes.length}`);
			if (allNodes.length > 1) {
				console.log('  节点列表:');
				allNodes.forEach(node => {
					console.log(`    • ${node.name.padEnd(20)} | ID: ${node.id} | Level: ${node.level} | Left: ${node.left} | Right: ${node.right}`);
				});
				console.log('\n🎉 成功使用 FlexTree API 创建产品分类！');
			} else {
				console.log('⚠️  未能成功创建子节点');
			}
		});

	} catch (error) {
		console.error('❌ 测试失败:', error);
		throw error;
	}
}

// 执行测试
console.log('🔍 开始测试修复后的 FlexTree API...\n');
testFixedFlexTree()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
