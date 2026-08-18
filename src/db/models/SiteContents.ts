import type { DrizzleDb } from '@/db';
import type { SiteContent } from '../schema';
import DrizzleTreeAdapter from '../utils/treeAdapter';
import { FlexTree, FlexTreeManager } from 'flextree';

/**
 * 站点内容 CRUD / 树形 管理器
 *
 * 基于 flextree 的多树（multi-tree）模式管理 site_contents 表：
 * - 每个站点（siteId）即一棵独立的树，flextree 的 treeId 映射到 site_id 列；
 * - 同表可并存多个站点的多棵树，互不干扰。
 */
export function getSiteContents(db: DrizzleDb) {
	// 创建适配器实例
	const drizzleTreeAdapter = new DrizzleTreeAdapter({ sqlite: db.$client });

	type SiteContentNodeFields = {
		siteId: string;
		contentId: number | null;
		name: string | null;
		title: string | null;
		isMenu: number;
		visible: number;
		isAuth: number;
		prompt: string | null;
		html: string | null;
		click: number;
		createdAt: Date;
		updatedAt: Date;
	};

	/**
	 * 获取指定站点的树管理器（多树：treeId === siteId）
	 *
	 * @param siteId - 站点ID，同时作为 flextree 的 treeId
	 */
	function getTreeManager(siteId: string) {
		return new FlexTreeManager<
			SiteContentNodeFields,
			{
				id: ['id', number];
				treeId: ['site_id', string];
				name: 'name';
				level: 'level';
				leftValue: 'left_value';
				rightValue: 'right_value';
			}
		>('site_contents', {
			adapter: drizzleTreeAdapter,
			treeId: siteId,
			fields: {
				id: 'id',
				treeId: 'site_id',
				name: 'name',
				level: 'level',
				leftValue: 'left_value',
				rightValue: 'right_value',
			},
		});
	}

	/**
	 * 获取指定站点的 FlexTree 实例
	 */
	function getTree(siteId: string) {
		return new FlexTree<
			SiteContentNodeFields,
			{
				id: ['id', number];
				treeId: ['site_id', string];
				name: 'name';
				level: 'level';
				leftValue: 'left_value';
				rightValue: 'right_value';
			}
		>('site_contents', {
			adapter: drizzleTreeAdapter,
			treeId: siteId,
			fields: {
				id: 'id',
				treeId: 'site_id',
				name: 'name',
				level: 'level',
				leftValue: 'left_value',
				rightValue: 'right_value',
			},
		});
	}

	return {
		/** 按站点ID获取树管理器 */
		getTreeManager,
		/** 按站点ID获取 FlexTree 实例 */
		getTree,
	};
}
