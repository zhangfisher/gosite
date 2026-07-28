/**
 * FlexTree Drizzle ORM 适配器
 *
 * 为 FlexTree 提供基于 Drizzle ORM 和 SQLite 的数据库适配器
 * 实现 IFlexTreeAdapter 接口
 */

import type { IFlexTreeAdapter, FlexTreeManager } from 'flextree';
import { Database } from 'bun:sqlite';

/**
 * DrizzleTreeAdapter 适配器配置
 */
export interface DrizzleTreeAdapterConfig {
	// 底层 SQLite 连接
	sqlite: Database;
}

/**
 * FlexTree DrizzleTreeAdapter 适配器类
 *
 * 实现 IFlexTreeAdapter 接口，为 FlexTree 提供数据库操作能力
 */
export default class DrizzleTreeAdapter implements IFlexTreeAdapter {
	private _db: Database;
	private _ready: boolean = true;
	private _treeManager?: FlexTreeManager;

	constructor(config: DrizzleTreeAdapterConfig) {
		if (!config.sqlite) {
			throw new Error('DrizzleTreeAdapter requires sqlite object');
		}

		this._db = config.sqlite;
	}

	/**
	 * 数据库是否准备就绪
	 */
	get ready(): boolean {
		return this._ready;
	}

	/**
	 * 返回数据库实例对象
	 * 仅在测试中使用
	 */
	get db(): any {
		return this._db;
	}

	/**
	 * 绑定树管理器
	 * @param treeManager FlexTree 树管理器实例
	 */
	bind(treeManager: FlexTreeManager): void {
		this._treeManager = treeManager;
	}

	/**
	 * 打开数据库连接（由于数据库是外部传入的，此方法只做简单确认）
	 * @param config 可选的配置（被忽略）
	 * @returns 数据库实例
	 */
	async open(config?: any): Promise<any> {
		// 数据库连接在构造时已提供，直接返回
		return this._db;
	}

	/**
	 * 执行 SQL 语句
	 * @param sqls SQL 语句或语句数组
	 */
	async exec(sqls: string | string[]): Promise<void> {
		if (typeof sqls === 'string') {
			sqls = [sqls];
		}

		// 使用事务执行多个 SQL 语句
		const transaction = this._db.transaction(() => {
			for (const sql of sqls) {
				// 使用 run 而不是 exec 来避免弃用警告
				this._db.run(sql);
			}
		});

		transaction();
	}

	/**
	 * 执行查询并返回结果集
	 * @param sql SQL 查询语句
	 * @returns 查询结果数组
	 */
	async getRows<T = any>(sql: string): Promise<T[]> {
		try {
			const stmt = this._db.prepare(sql);
			return stmt.all() as T[];
		} catch (error: any) {
			throw new Error(`Query failed: ${error.message}`);
		}
	}

	/**
	 * 执行查询并返回标量值
	 * @param sql SQL 查询语句
	 * @returns 标量值（单个值）
	 */
	async getScalar<T = number>(sql: string): Promise<T> {
		try {
			const stmt = this._db.prepare(sql);

			// Bun 的 SQLite 不支持 .pluck()，需要手动提取第一列
			const result = stmt.get() as any;

			// 如果没有结果，返回 undefined
			if (!result) {
				return undefined as T;
			}

			// 获取第一列的值（SQL 查询的结果是对象或直接值）
			if (typeof result === 'object') {
				const keys = Object.keys(result);
				return result[keys[0]] as T;
			}

			return result as T;
		} catch (error: any) {
			throw new Error(`Scalar query failed: ${error.message}`);
		}
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