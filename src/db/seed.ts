/**
 * 数据库种子脚本
 *
 * 用于初始化默认站点数据
 */
import { db } from './index';
import { sites, sitesTranslations } from './schema';

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
			.where((site) => site.name === 'default')
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
		await db.insert(sitesTranslations).values({
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
 * 执行所有种子数据
 */
async function seedAll() {
	try {
		console.log('🌱 开始数据库种子...');
		await seedSites();
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

export { seedSites, seedAll };
