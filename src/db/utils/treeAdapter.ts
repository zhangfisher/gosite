/**
 * FlexTree Drizzle ORM 适配器
 *
 * 本项目的 Drizzle 底层驱动即 bun:sqlite（db.$client === bun:sqlite Database），
 * 因此直接继承官方的 flextree-bun-sqlite-adapter，仅保留 { sqlite } 配置签名，
 * 不再自行实现 IFlexTreeAdapter（connected/transaction 等由官方适配器提供）。
 */

import BunSqliteAdapter from 'flextree-bun-sqlite-adapter';
import { Database } from 'bun:sqlite';

/**
 * DrizzleTreeAdapter 适配器配置
 */
export interface DrizzleTreeAdapterConfig {
	// 底层 SQLite 连接（即 Drizzle 的 db.$client）
	sqlite: Database;
}

/**
 * FlexTree DrizzleTreeAdapter 适配器类
 *
 * bun:sqlite 适配器的薄包装，实现 IFlexTreeAdapter 接口
 */
export default class DrizzleTreeAdapter extends BunSqliteAdapter {
	constructor(config: DrizzleTreeAdapterConfig) {
		if (!config?.sqlite) {
			throw new Error('DrizzleTreeAdapter requires sqlite object');
		}
		super(config.sqlite);
	}
}

/**
 * 创建 FlexTree DrizzleTreeAdapter ORM 适配器实例
 * @param config 适配器配置
 * @returns FlexTree 适配器实例
 */
export function createDrizzleTreeAdapter(config: { sqlite: Database }): DrizzleTreeAdapter {
	return new DrizzleTreeAdapter(config);
}
