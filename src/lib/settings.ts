/**
 * 全局配置（Settings）
 *
 * 提供统一的配置读写能力：
 * - `Settings` 类：针对任意 userId 加载/保存其配置（settings 为 JSON 字段）
 * - `AdminSettings`：全局单例，对应超级管理员（userId = "admin"）的配置，
 *   等同于整个应用的配置，在应用启动时自动加载。
 *
 * 使用示例：
 * ```ts
 * const adminSettings = new Settings("admin")
 * await adminSettings.load()
 * const siteName = adminSettings.get("siteName")
 *
 * // 全局单例（已随应用启动加载）
 * import { AdminSettings } from "@/lib/settings"
 * const siteName = AdminSettings.get("siteName")
 * ```
 */
import { db } from "@/db";
import { settings as settingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/** 超级管理员（应用全局配置）的用户标识 */
export const ADMIN_USER_ID = "admin";

import type {
	AdminConfig,
	AiProviderConfig,
	AiSettings,
	ServicesSettings,
	UploadConfig,
} from "@/types/settings";
import { DEFAULT_UPLOAD_CONFIG } from "@/types/settings";

export type {
	AdminConfig,
	AiProviderConfig,
	AiSettings,
	ServicesSettings,
};

/** 默认配置（应用级） */
export const DEFAULT_SETTINGS: AdminConfig = {
	siteName: "GoSite",
	siteDescription: "",
	defaultLocale: "zh-CN",
	locales: ["zh-CN", "en-US"],
	theme: "system",
	maintenanceMode: false,
	ai: { providers: [], maxConcurrentConversations: 5 },
	services: {},
	upload: DEFAULT_UPLOAD_CONFIG,
};

/**
 * 配置类
 *
 * 针对单个 userId 管理其 JSON 配置。支持并发安全的加载（多次 load 只会
 * 真正查询一次数据库）。
 */
export class Settings<T extends Record<string, unknown> = AdminConfig> {
	private readonly userId: string;
	private data: T;
	private loaded = false;
	private loadPromise: Promise<void> | null = null;

	constructor(userId: string, defaults?: Partial<T>) {
		this.userId = userId;
		this.data = { ...DEFAULT_SETTINGS, ...(defaults ?? {}) } as unknown as T;
	}

	/** 当前用户的标识 */
	getUserId(): string {
		return this.userId;
	}

	/** 是否已从数据库加载 */
	isLoaded(): boolean {
		return this.loaded;
	}

	/**
	 * 从数据库加载配置
	 *
	 * 若数据库中不存在该用户记录，则保留默认值（仍标记为已加载）。
	 * 并发调用安全：同一实例只会查询一次数据库。
	 */
	async load(): Promise<this> {
		if (!this.loadPromise) {
			this.loadPromise = this.doLoad();
		}
		await this.loadPromise;
		return this;
	}

	private async doLoad(): Promise<void> {
		const rows = await db
			.select()
			.from(settingsTable)
			.where(eq(settingsTable.userId, this.userId))
			.limit(1);

		if (rows.length > 0) {
			const raw = rows[0].settings;
			const parsed =
				typeof raw === "string" ? JSON.parse(raw) : raw;
			this.data = { ...DEFAULT_SETTINGS, ...(parsed ?? {}) };
		}
		this.loaded = true;
	}

	/**
	 * 重新从数据库加载配置
	 */
	async reload(): Promise<this> {
		this.loadPromise = null;
		return this.load();
	}

	/**
	 * 读取某个配置项
	 */
	get<K extends keyof T>(key: K): T[K] {
		return this.data[key];
	}

	/**
	 * 读取全部配置
	 */
	all(): T {
		return this.data;
	}

	/**
	 * 保存配置
	 *
	 * @param partial 需要合并/覆盖的配置项；省略则仅写入当前内存中的数据
	 */
	async save(partial?: Partial<T>): Promise<this> {
		if (partial) {
			this.data = { ...this.data, ...partial };
		}

		const json = JSON.stringify(this.data);
		const existing = await db
			.select({ id: settingsTable.id })
			.from(settingsTable)
			.where(eq(settingsTable.userId, this.userId))
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(settingsTable)
				.set({ settings: json, updatedAt: new Date() })
				.where(eq(settingsTable.id, existing[0].id));
		} else {
			await db.insert(settingsTable).values({
				userId: this.userId,
				settings: json,
			});
		}
		this.loaded = true;
		return this;
	}

	/**
	 * 设置单个配置项并持久化
	 */
	async set<K extends keyof T>(key: K, value: T[K]): Promise<this> {
		return this.save({ [key]: value } as unknown as Partial<T>);
	}
}

declare global {
	// eslint-disable-next-line no-var
	var __adminSettings: Settings<AdminConfig> | undefined;
}

/**
 * 获取（或惰性创建）AdminSettings 全局单例
 *
 * 单例保存在 globalThis 上，避免开发模式下模块热重载导致重复实例化。
 */
export function getAdminSettings(): Settings<AdminConfig> {
	if (!globalThis.__adminSettings) {
		globalThis.__adminSettings = new Settings(ADMIN_USER_ID);
	}
	return globalThis.__adminSettings;
}

/**
 * 初始化 AdminSettings：在应用启动时调用一次，加载管理员的配置。
 */
export async function initAdminSettings(): Promise<Settings<AdminConfig>> {
	const instance = getAdminSettings();
	await instance.load();
	return instance;
}

/**
 * AdminSettings 全局对象
 *
 * 对应超级管理员（userId = "admin"）的配置，即整个应用的全局配置。
 * 请确保在应用启动时已调用 `initAdminSettings()`（instrumentation 中已处理）。
 */
export const AdminSettings: Settings<AdminConfig> = getAdminSettings();
