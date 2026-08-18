/**
 * 管理员（全局）配置类型
 *
 * 对应超级管理员（userId = "admin"）的配置，即整个应用的全局配置，
 * 持久化于 `settings` 表的 JSON 字段中。
 */

/** 主题 */
export type Theme = "light" | "dark" | "system";

/** 单个 AI 提供者配置 */
export interface AiProviderConfig {
	/** 唯一标识 */
	id: string;
	/** 显示名称 */
	name: string;
	/** 提供者类型，如 openai / deepseek / anthropic / custom */
	provider: string;
	/** 自定义基础地址（可选，兼容 OpenAI 兼容网关） */
	baseURL?: string;
	/** API Key */
	apiKey?: string;
	/** 默认使用的模型 */
	model: string;
	/** 是否启用 */
	enabled: boolean;
}

/** AI 相关配置 */
export interface AiSettings {
	/** 提供者列表 */
	providers: AiProviderConfig[];
	/** 默认模型（provider/model 形式，便于直接引用） */
	defaultModel?: string;
}

/** 第三方服务配置（如邮件服务 Resend 等） */
export interface ServicesSettings {
	resend?: {
		apiKey?: string;
		from?: string;
	};
}

/** 管理员（应用级）全局配置结构 */
export interface AdminConfig {
	/** 站点名称 */
	siteName: string;
	/** 站点描述 */
	siteDescription: string;
	/** 默认语言 */
	defaultLocale: string;
	/** 支持的语言列表 */
	locales: string[];
	/** 主题 */
	theme: Theme;
	/** 维护模式 */
	maintenanceMode: boolean;
	/** AI 相关配置 */
	ai?: AiSettings;
	/** 第三方服务配置 */
	services?: ServicesSettings;
	/** 任意自定义配置 */
	[key: string]: unknown;
}

/** 默认管理员配置 */
export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
	siteName: "GoSite",
	siteDescription: "",
	defaultLocale: "zh-CN",
	locales: ["zh-CN", "en-US"],
	theme: "system",
	maintenanceMode: false,
	ai: { providers: [] },
	services: {},
};
