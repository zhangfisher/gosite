import { db, ProductCategories } from '@/db';
import { sqlite } from '@/db';

/**
 * 初始化产品分类树数据
 *
 * 使用 FlexTree API 创建产品分类的嵌套树结构
 * 必须在 write 方法内执行所有树操作
 */
async function initProductCategories() {
	console.log('🌱 开始初始化产品分类树...\n');

	try {
		// 先检查是否已有数据
		const existingCategories = await db.query.productCategories.findMany();

		if (existingCategories.length > 0) {
			console.log(`⚠️  产品分类表中已有 ${existingCategories.length} 条记录`);
			console.log('💡 建议：先清空表数据再执行初始化');
			console.log('\n📋 现有分类数据:');
			existingCategories.forEach(cat => {
				console.log(`  • ${cat.name.padEnd(30)} | Level: ${cat.level} | ID: ${cat.id}`);
			});
			console.log('\n❌ 初始化操作已取消');
			process.exit(1);
		}

		console.log('✅ 表为空，可以安全初始化\n');

		// 必须在 write 方法内执行树操作
		await ProductCategories.treeManager.write(async () => {
			console.log('📋 正在创建产品分类树结构...\n');

			// 1. 创建根节点
			console.log('🔹 创建根节点: 所有产品');
			await ProductCategories.treeManager.createRoot({
				name: '所有产品'
			});

			// 使用 treeManager.getRoot() 获取根节点
			const rootNode = await ProductCategories.treeManager.getRoot();

			if (!rootNode) {
				throw new Error('无法获取刚创建的根节点');
			}

			console.log(`  ✅ 根节点创建成功 (ID: ${rootNode.id})\n`);

			// 2. 添加一级分类
			console.log('🔹 创建一级分类...');

			const level1Results = await ProductCategories.treeManager.addNodes([
				{ name: '按系统组成' },
				{ name: '按无线技术' },
				{ name: '按应用场景' }
			], rootNode);

			console.log(`  ✅ 一级分类创建成功 (${level1Results.length} 个)`);

			// 保存一级分类节点的ID映射
			const level1Map = new Map();
			level1Results.forEach((node, index) => {
				const names = ['按系统组成', '按无线技术', '按应用场景'];
				level1Map.set(names[index], node);
			});

			// 3. 添加二级分类 - 按系统组成
			console.log('\n🔹 创建"按系统组成"的二级分类...');
			const systemComposeResults = await ProductCategories.treeManager.addNodes([
				{ name: '呼叫器' },
				{ name: '接收主机' },
				{ name: '接收指示屏' },
				{ name: '无线主机' },
				{ name: '接收手表' },
				{ name: '管理主机' },
				{ name: '网关' },
				{ name: '中继器' },
				{ name: '多彩警示灯' },
				{ name: '无线对讲机' },
				{ name: '管理软件' },
				{ name: '配件与辅材' }
			], level1Map.get('按系统组成'));

			console.log(`  ✅ "按系统组成"二级分类创建成功 (${systemComposeResults.length} 个)`);

			// 保存二级分类节点ID映射
			const systemComposeMap = new Map();
			systemComposeResults.forEach((node, index) => {
				const names = ['呼叫器', '接收主机', '接收指示屏', '无线主机', '接收手表', '管理主机', '网关', '中继器', '多彩警示灯', '无线对讲机', '管理软件', '配件与辅材'];
				systemComposeMap.set(names[index], node);
			});

			// 4. 添加三级分类 - 呼叫器的子系列
			console.log('\n🔹 创建"呼叫器"的三级分类...');
			const pagerSeriesResults = await ProductCategories.treeManager.addNodes([
				{ name: '超薄系列' },
				{ name: '汉堡系列' },
				{ name: '86盒系列' },
				{ name: '防水系列' },
				{ name: '告警系列' },
				{ name: '门磁系列' }
			], systemComposeMap.get('呼叫器'));

			console.log(`  ✅ "呼叫器"三级分类创建成功 (${pagerSeriesResults.length} 个)`);

			// 5. 添加二级分类 - 按无线技术
			console.log('\n🔹 创建"按无线技术"的二级分类...');
			const wirelessTechResults = await ProductCategories.treeManager.addNodes([
				{ name: 'OOK/FSK无线技术' },
				{ name: 'LoRA无线技术' },
				{ name: '4G无线呼叫技术' }
			], level1Map.get('按无线技术'));

			console.log(`  ✅ "按无线技术"二级分类创建成功 (${wirelessTechResults.length} 个)`);

			// 6. 添加二级分类 - 按应用场景
			console.log('\n🔹 创建"按应用场景"的二级分类...');
			const scenarioResults = await ProductCategories.treeManager.addNodes([
				{ name: '餐厅/酒店/KTV' }
			], level1Map.get('按应用场景'));

			console.log(`  ✅ "按应用场景"二级分类创建成功 (${scenarioResults.length} 个)`);

			// 7. 添加三级分类 - 餐厅/酒店/KTV的子分类
			console.log('\n🔹 创建"餐厅/酒店/KTV"的三级分类...');
			const restaurantResults = await ProductCategories.treeManager.addNodes([
				{ name: '服务呼叫器(客人)' },
				{ name: '取餐叫号器(服务员)' },
				{ name: '排队叫号器' },
				{ name: '服务指示屏' },
				{ name: '无线对讲机' }
			], scenarioResults[0]);

			console.log(`  ✅ "餐厅/酒店/KTV"三级分类创建成功 (${restaurantResults.length} 个)`);

			// 统计总节点数
			const totalNodes = 1 + // 根节点
				level1Results.length + // 一级分类
				systemComposeResults.length + // 按系统组成的二级分类
				pagerSeriesResults.length + // 呼叫器的三级分类
				wirelessTechResults.length + // 按无线技术的二级分类
				scenarioResults.length + // 按应用场景的二级分类
				restaurantResults.length; // 餐厅/酒店/KTV的三级分类

			console.log('\n🎉 产品分类树初始化完成！');
			console.log(`📊 总共创建 ${totalNodes} 个分类节点\n`);

			// 输出树结构概览
			console.log('🌳 产品分类树结构概览:');
			console.log('└─ 所有产品');
			console.log('   ├─ 按系统组成 (12个子分类)');
			console.log('   │  ├─ 呼叫器 (6个系列)');
			console.log('   │  │  ├─ 超薄系列');
			console.log('   │  │  ├─ 汉堡系列');
			console.log('   │  │  ├─ 86盒系列');
			console.log('   │  │  ├─ 防水系列');
			console.log('   │  │  ├─ 告警系列');
			console.log('   │  │  └─ 门磁系列');
			console.log('   │  ├─ 接收主机');
			console.log('   │  ├─ 接收指示屏');
			console.log('   │  ├─ 无线主机');
			console.log('   │  ├─ 接收手表');
			console.log('   │  ├─ 管理主机');
			console.log('   │  ├─ 网关');
			console.log('   │  ├─ 中继器');
			console.log('   │  ├─ 多彩警示灯');
			console.log('   │  ├─ 无线对讲机');
			console.log('   │  ├─ 管理软件');
			console.log('   │  └─ 配件与辅材');
			console.log('   ├─ 按无线技术 (3个子分类)');
			console.log('   │  ├─ OOK/FSK无线技术');
			console.log('   │  ├─ LoRA无线技术');
			console.log('   │  └─ 4G无线呼叫技术');
			console.log('   └─ 按应用场景 (1个子分类)');
			console.log('     └─ 餐厅/酒店/KTV (5个子分类)');
			console.log('        ├─ 服务呼叫器(客人)');
			console.log('        ├─ 取餐叫号器(服务员)');
			console.log('        ├─ 排队叫号器');
			console.log('        ├─ 服务指示屏');
			console.log('        └─ 无线对讲机');

		});

	} catch (error) {
		console.error('❌ 初始化产品分类失败:', error.message);
		throw error;
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
