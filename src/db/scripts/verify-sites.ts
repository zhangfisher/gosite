/**
 * 验证 sites 表数据
 */
import { db, sites, sitesTranslations } from '../index';
import { eq } from 'drizzle-orm';

async function verifySites() {
	try {
		console.log('🔍 验证 sites 表数据...\n');

		// 获取所有站点
		const allSites = await db.select().from(sites);
		console.log(`📊 站点总数: ${allSites.length}\n`);

		// 显示每个站点的详细信息
		for (const site of allSites) {
			console.log(`🌐 站点 ${site.id}:`);
			console.log(`   名称: ${site.name}`);
			console.log(`   标题: ${site.title}`);
			console.log(`   描述: ${site.description}`);
			console.log(`   支持语言: ${site.languages}`);
			console.log(`   创建时间: ${new Date(site.createdAt * 1000).toLocaleString('zh-CN')}`);
			console.log();

			// 获取该站点的翻译
			const translations = await db.select()
				.from(sitesTranslations)
				.where(eq(sitesTranslations.siteId, site.id));

			console.log(`   📝 翻译 (${translations.length} 条):`);
			for (const trans of translations) {
				console.log(`      ${trans.language}: ${trans.title}`);
			}
			console.log();
		}

		// 验证默认站点的详细信息
		console.log('🔍 详细验证默认站点...\n');
		const defaultSite = await db.select()
			.from(sites)
			.where(eq(sites.name, 'default'))
			.limit(1);

		if (defaultSite.length > 0) {
			const site = defaultSite[0];
			const contacts = JSON.parse(site.contacts || '{}');
			const socials = JSON.parse(site.socials || '{}');

			console.log('📍 联系信息:');
			console.log(`   地址: ${contacts.address}`);
			console.log(`   电话: ${contacts.phone}`);
			console.log(`   邮箱: ${contacts.email}`);
			console.log(`   客服: ${contacts.support}`);
			console.log(`   工作时间: ${contacts.worktimes}`);
			console.log();

			console.log('🔗 社交媒体:');
			console.log(`   Facebook: ${socials.facebook}`);
			console.log(`   X (Twitter): ${socials.x}`);
			console.log(`   YouTube: ${socials.youtube}`);
			console.log(`   WhatsApp: ${socials.whatsapp}`);
			console.log();

			console.log('⚖️ 法律信息:');
			console.log(`   版权: ${site.copyright}`);
			console.log(`   备案: ${site.filing}`);
			console.log();

			// 验证翻译内容
			console.log('🌍 翻译验证:');
			const zhTrans = await db.select()
				.from(sitesTranslations)
				.where(eq(sitesTranslations.siteId, site.id))
				.where(eq(sitesTranslations.language, 'zh-CN'))
				.limit(1);

			const enTrans = await db.select()
				.from(sitesTranslations)
				.where(eq(sitesTranslations.siteId, site.id))
				.where(eq(sitesTranslations.language, 'en-US'))
				.limit(1);

			if (zhTrans.length > 0) {
				console.log('   ✅ 中文翻译存在');
				const zhContacts = JSON.parse(zhTrans[0].contacts || '{}');
				console.log(`      地址: ${zhContacts.address}`);
			}

			if (enTrans.length > 0) {
				console.log('   ✅ 英文翻译存在');
				const enContacts = JSON.parse(enTrans[0].contacts || '{}');
				console.log(`      地址: ${enContacts.address}`);
			}
		}

		console.log('✅ 验证完成！');
	} catch (error) {
		console.error('❌ 验证失败:', error);
		throw error;
	}
}

// 如果直接运行此脚本，执行验证
if (import.meta.main) {
	verifySites()
		.then(() => {
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 验证失败:', error);
			process.exit(1);
		});
}

export { verifySites };
