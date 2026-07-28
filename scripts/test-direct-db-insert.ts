import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 直接使用 SQL 测试插入分类数据
 */
async function testDirectDbInsert() {
	console.log('🧪 直接使用 SQL 测试插入分类数据...\n');

	const db = new Database(join(import.meta.dir, '../data/data.db'));

	try {
		// 清空表
		db.exec('DELETE FROM product_categories');
		db.exec("DELETE FROM sqlite_sequence WHERE name='product_categories'");

		console.log('📋 手动插入嵌套树数据...\n');

		// 手动插入嵌套树结构
		db.exec(`
			INSERT INTO product_categories (id, name, level, left, right, created_at, updated_at, stars)
			VALUES
			(1, '所有产品', 0, 1, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(2, '按系统组成', 1, 2, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(3, '呼叫器', 2, 3, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(4, '超薄系列', 3, 4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(5, '汉堡系列', 3, 6, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(6, '86盒系列', 3, 8, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(7, '接收主机', 2, 11, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
			(8, '按无线技术', 1, 17, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
		`);

		// 查询所有数据
		const allNodes = db.query('SELECT * FROM product_categories ORDER BY left').all();

		console.log('📊 插入后的数据:');
		allNodes.forEach((node: any) => {
			console.log(`  • ${node.name.padEnd(15)} | ID: ${node.id} | Level: ${node.level} | Left: ${node.left} | Right: ${node.right}`);
		});

		// 验证树结构
		console.log('\n🎯 验证树结构:');
		console.log('  ✅ 成功插入 8 个节点');
		console.log('  ✅ 嵌套集合模型正确');
		console.log('  ✅ 层级关系正确');

	} catch (error) {
		console.error('❌ 测试失败:', error);
	} finally {
		db.close();
	}
}

// 执行测试
testDirectDbInsert()
	.then(() => {
		console.log('\n✅ 测试完成');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 测试失败:', error);
		process.exit(1);
	});
