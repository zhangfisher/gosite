/**
 * 数据库种子脚本
 *
 * 用于初始化默认站点数据与默认管理员账号
 */
import { db } from './index';
import { sites, sitesI18n } from './schema';
import { user } from './schema/auth';
import { settings } from './schema/settings';
import { contents } from './schema/contents';
import { eq } from 'drizzle-orm';
import { auth } from '../lib/auth';
import { ADMIN_USER_ID, DEFAULT_SETTINGS } from '../lib/settings';
import { getContents } from './models/Contents';

/**
 * 默认站点配置
 */
const defaultSiteConfig = {
	name: 'default',
	title: '默认站点',
	description: '默认站点描述',
	logo: '',
	cover: '',
	keywords: '',
	contacts: {
		address: '福建省泉州市丰泽区科技路育成基地',
		phone: '0086-15906005001',
		email: 'hyt@huanyutong.com',
		support: '4009988188',
		worktimes: '周一至周五 9:00-18:00',
	},
	socials: {
		facebook: 'https://www.facebook.com/meeyi.intercom',
		x: 'https://twitter.com/MEEYI_HYT',
		youtube: 'https://youtube.com/@meeyi1999',
		whatsapp: 'https://wa.me/8615392123519?text=',
	},
	copyright: '© 2008-2026 福建环宇通信息科技股份公司 版权所有',
	privacyPolicy: '',
	cookieDeclaration: '',
	filing: '闽ICP备16038990号',
	languages: 'zh-CN,en-US',
};

/**
 * 种子站点数据
 */
async function seedSites() {
	try {
		console.log('🌱 开始种子站点数据...');

		// 检查是否已存在默认站点
		const existingSite = await db
			.select()
			.from(sites)
			.where(eq(sites.name, 'default'))
			.limit(1);

		if (existingSite.length > 0) {
			console.log('✅ 默认站点已存在，跳过种子数据');
			return;
		}

		// 创建默认站点
		const [newSite] = await db.insert(sites).values({
			name: defaultSiteConfig.name,
			title: defaultSiteConfig.title,
			description: defaultSiteConfig.description,
			logo: defaultSiteConfig.logo,
			cover: defaultSiteConfig.cover,
			keywords: defaultSiteConfig.keywords,
			contacts: JSON.stringify(defaultSiteConfig.contacts),
			socials: JSON.stringify(defaultSiteConfig.socials),
			copyright: defaultSiteConfig.copyright,
			privacyPolicy: defaultSiteConfig.privacyPolicy,
			cookieDeclaration: defaultSiteConfig.cookieDeclaration,
			filing: defaultSiteConfig.filing,
			languages: defaultSiteConfig.languages,
		}).returning();

		console.log(`✅ 创建站点: ${newSite.name} (ID: ${newSite.id})`);
 
		// 创建英文翻译
		await db.insert(sitesI18n).values({
			siteId: newSite.id,
			language: 'en-US',
			title: 'Default Site',
			description: 'Default site description',
			contacts: JSON.stringify({
				address: 'Fengze District, Quanzhou, Fujian Province, Science and Technology Road, Yucheng Base',
				phone: '0086-15906005001',
				email: 'hyt@huanyutong.com',
				support: '4009988188',
				worktimes: 'Monday to Friday 9:00-18:00',
			}),
			socials: JSON.stringify(defaultSiteConfig.socials),
			copyright: '© 2008-2026 Fujian Huanyutong Information Technology Co., Ltd. All rights reserved',
			privacyPolicy: '',
			cookieDeclaration: '',
			filing: 'Min ICP preparation 16038990',
		});

		console.log('✅ 创建英文翻译');
		console.log('🎉 站点数据种子完成！');
	} catch (error) {
		console.error('❌ 站点数据种子失败:', error);
		throw error;
	}
}

/**
 * 种子默认管理员账号
 *
 * 通过 better-auth 的 signUpEmail 创建，密码会被正确哈希存储。
 * 仅在 user 表为空时执行，重复运行不会报错。
 */
async function seedAdmin() {
	try {
		console.log('👤 开始种子管理员账号...');

		const result = db.$client.query('SELECT count(*) as n FROM user').get() as {
			n: number;
		};
		if (result.n > 0) {
			console.log('✅ 已存在用户，跳过管理员创建');
			return;
		}

		const username = process.env.ADMIN_USERNAME || 'admin';
		const email = process.env.ADMIN_EMAIL || 'admin@example.com';
		const password = process.env.ADMIN_PASSWORD || '22182666@hyt';
		const name = process.env.ADMIN_NAME || 'Admin';

		await auth.api.signUpEmail({
			body: { username, email, password, name },
			headers: new Headers(),
		});

		// 将首个账号提升为 admin 角色，使其可使用后台管理功能
		await db.update(user).set({ role: "admin" }).where(eq(user.email, email));

		console.log(`✅ 已创建管理员账号：用户名=${username}，邮箱=${email}`);
	} catch (error) {
		console.error('❌ 管理员账号种子失败:', error);
		throw error;
	}
}

/**
 * 种子默认配置数据
 *
 * 为超级管理员（admin）写入一条默认配置记录，其配置等同于整个应用的配置。
 * 仅在 settings 表中不存在 admin 记录时执行，重复运行不会报错。
 */
async function seedSettings() {
	try {
		console.log('⚙️  开始种子配置数据...');

		const existing = await db
			.select({ id: settings.id })
			.from(settings)
			.where(eq(settings.userId, ADMIN_USER_ID))
			.limit(1);

		if (existing.length > 0) {
			console.log('✅ 管理员配置已存在，跳过种子数据');
			return;
		}

		await db.insert(settings).values({
			userId: ADMIN_USER_ID,
			settings: JSON.stringify(DEFAULT_SETTINGS),
		});

		console.log(`✅ 已创建管理员（${ADMIN_USER_ID}）默认配置`);
	} catch (error) {
		console.error('❌ 配置数据种子失败:', error);
		throw error;
	}
}

/**
 * 种子默认内容树数据
 *
 * 使用 flextree API 创建内容管理树：
 * - 根节点：所有内容
 * - 子节点：产品、解决方案、服务、新闻
 * - 启用回收站
 *
 * 仅在 contents 表为空时执行，重复运行不会报错。
 */
async function seedContents() {
	try {
		console.log('📄 开始种子内容树数据...');

		// 检查是否已有内容数据
		const existing = await db.select({ id: contents.id }).from(contents).limit(1);
		if (existing.length > 0) {
			console.log('✅ 内容树已存在，跳过种子数据');
			return;
		}

		const { treeManager } = getContents(db);
		const now = Date.now();

		await treeManager.write(async () => {
			// 创建根节点（flextree 用属性名拼 SQL，需用数据库列名）
			await treeManager.createRoot({
				name: 'all',
				title: '所有内容',
				type: 0,
				'created_at': now,
				'updated_at': now,
			} as never);

			// 添加子节点
			await treeManager.addNodes([
				{
					name: 'products',
					title: '产品',
					type: 0,
					'created_at': now,
					'updated_at': now,
				},
				{
					name: 'solutions',
					title: '解决方案',
					type: 0,
					'created_at': now,
					'updated_at': now,
				},
				{
					name: 'services',
					title: '服务',
					type: 0,
					'created_at': now,
					'updated_at': now,
				},
				{
					name: 'news',
					title: '新闻',
					type: 0,
					'created_at': now,
					'updated_at': now,
				},
			] as never);
		});

		console.log('✅ 内容树种子完成：根节点「所有内容」+ 子节点「产品、解决方案、服务、新闻」');
	} catch (error) {
		console.error('❌ 内容树种子失败:', error);
		throw error;
	}
}

/**
 * 执行所有种子数据
 */
async function seedAll() {
	try {
		console.log('🌱 开始数据库种子...');
		await seedSites();
		await seedAdmin();
		await seedSettings();
		await seedContents();
		console.log('✅ 数据库种子完成！');
	} catch (error) {
		console.error('❌ 数据库种子失败:', error);
		throw error;
	}
}

// 如果直接运行此脚本，执行种子数据
if (import.meta.main) {
	seedAll()
		.then(() => {
			console.log('🎉 种子数据完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 种子数据失败:', error);
			process.exit(1);
		});
}

export { seedSites, seedAdmin, seedSettings, seedContents, seedAll };
