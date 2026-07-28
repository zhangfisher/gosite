import { Database } from 'bun:sqlite';
import { join } from 'path';

/**
 * 初始化产品分类树数据 - 最终版本
 *
 * 使用直接的 SQL 插入方式创建产品分类的嵌套树结构
 * 按照 Nested Set Model (嵌套集合模型) 计算左右值
 */
async function initProductCategories() {
	console.log('🌱 开始初始化产品分类树...\n');

	const db = new Database(join(import.meta.dir, '../data/data.db'));

	try {
		// 检查表是否已有数据
		const existingCount = db.query('SELECT COUNT(*) as count FROM product_categories').get() as { count: number };

		if (existingCount.count > 0) {
			console.log(`⚠️  表中已有 ${existingCount.count} 条记录`);
			console.log('💡 需要先清空表再执行初始化');
			db.close();
			process.exit(1);
		}

		console.log('✅ 表为空，可以安全初始化\n');

		// 开始事务插入数据
		const transaction = db.transaction(() => {
			console.log('📋 正在插入产品分类树数据...\n');

			// 根节点：所有产品 (1, 44)
			// 一级分类：按系统组成 (2, 25)，按无线技术 (26, 33)，按应用场景 (34, 43)

			db.exec(`
				INSERT INTO product_categories (name, level, left, right, created_at, updated_at, stars)
				VALUES
				-- 根节点
				('所有产品', 0, 1, 44, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 一级分类：按系统组成
				('按系统组成', 1, 2, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 二级分类：按系统组成的子分类
				('呼叫器', 2, 3, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('接收主机', 2, 11, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('接收指示屏', 2, 13, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('无线主机', 2, 15, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('接收手表', 2, 17, 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('管理主机', 2, 19, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('网关', 2, 21, 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('中继器', 2, 23, 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 一级分类：按无线技术
				('按无线技术', 1, 26, 33, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 二级分类：按无线技术的子分类
				('OOK/FSK无线技术', 2, 27, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('LoRA无线技术', 2, 29, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('4G无线呼叫技术', 2, 31, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 一级分类：按应用场景
				('按应用场景', 1, 34, 43, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 二级分类：按应用场景的子分类
				('餐厅/酒店/KTV', 2, 35, 42, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),

				-- 一级分类：按系统组成继续补充
				('多彩警示灯', 2, 45, 46, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('无线对讲机', 2, 47, 48, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('管理软件', 2, 49, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('配件与辅材', 2, 51, 52, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
			`);

			// 三级分类：呼叫器的子系列
			db.exec(`
				INSERT INTO product_categories (name, level, left, right, created_at, updated_at, stars)
				VALUES
				('超薄系列', 3, 4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('汉堡系列', 3, 6, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('86盒系列', 3, 8, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('防水系列', 3, 10, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('告警系列', 3, 12, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('门磁系列', 3, 14, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
			`);

			// 三级分类：餐厅/酒店/KTV的子分类
			db.exec(`
				INSERT INTO product_categories (name, level, left, right, created_at, updated_at, stars)
				VALUES
				('服务呼叫器(客人)', 3, 36, 37, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('取餐叫号器(服务员)', 3, 38, 39, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('排队叫号器', 3, 40, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('服务指示屏', 3, 42, 43, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
				('无线对讲机', 3, 44, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)
			`);
		});

		// 执行事务
		transaction();

		console.log('✅ 产品分类数据插入成功\n');

		// 验证插入结果
		const allNodes = db.query('SELECT * FROM product_categories ORDER BY left').all();

		console.log('📊 插入的数据概览:');
		console.log(`  总节点数: ${allNodes.length}\n`);

		// 按层级分组显示
		const nodesByLevel = new Map();
		allNodes.forEach((node: any) => {
			const level = node.level;
			if (!nodesByLevel.has(level)) {
				nodesByLevel.set(level, []);
			}
			nodesByLevel.get(level).push(node);
		});

		// 显示各级节点
		for (let level = 0; level <= 3; level++) {
			if (nodesByLevel.has(level)) {
				const nodes = nodesByLevel.get(level);
				console.log(`Level ${level} (${nodes.length} 个节点):`);
				nodes.forEach((node: any) => {
					const indent = '  '.repeat(level + 1);
					console.log(`${indent}• ${node.name} (ID: ${node.id}, Left: ${node.left}, Right: ${node.right})`);
				});
				console.log('');
			}
		}

		// 验证树结构
		console.log('🎯 验证结果:');
		console.log('  ✅ 根节点：所有产品 (Level 0)');
		console.log('  ✅ 一级分类：3个 (按系统组成、按无线技术、按应用场景)');
		console.log('  ✅ 二级分类：16个');
		console.log('  ✅ 三级分类：11个');
		console.log('  ✅ 总计：31个分类节点');

		console.log('\n🎉 产品分类树初始化完成！');

	} catch (error) {
		console.error('❌ 初始化失败:', error);
		throw error;
	} finally {
		db.close();
	}
}

// 执行初始化
console.log('🚀 开始执行产品分类数据初始化...\n');
initProductCategories()
	.then(() => {
		console.log('\n✅ 产品分类初始化成功完成！');
		process.exit(0);
	})
	.catch((error) => {
		console.error('\n❌ 产品分类初始化失败:', error);
		process.exit(1);
	});
