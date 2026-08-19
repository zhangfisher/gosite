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
	/**
	 * 全局系统提示词。
	 * 作为所有 AI 对话的基础系统提示（与默认提示及按会话注入的提示组合）。
	 */
	prompt?: string;
	/**
	 * 同时进行的 AI 聊天对话数量上限。
	 * 超过后新的聊天请求将被拒绝。
	 */
	maxConcurrentConversations?: number;
	/**
	 * 对话空闲超时（分钟）。
	 * 活跃会话在指定分钟数内无活动（无新消息、也无模型输出）时自动销毁，
	 * 以避免长期占用进程资源。默认 20 分钟。
	 */
	conversationTimeoutMin?: number;
}

/** 第三方服务配置（如邮件服务 Resend 等） */
export interface ServicesSettings {
	resend?: {
		apiKey?: string;
		from?: string;
	};
}

/**
 * 文件上传配置
 *
 * 持久化于全局配置（admin 用户 settings 的 JSON）的 `upload` 键下，
 * 由 `/api/upload` 的 tus 服务端在每次上传创建时实时读取并据此校验。
 */
export interface UploadConfig {
	/** 单文件大小上限（MB） */
	maxFileSizeMB?: number;
	/**
	 * 允许的文件类型白名单，元素可为：
	 * - 扩展名：`.pdf`、`.png`（大小写不敏感）
	 * - MIME / MIME 通配：`image/*`、`application/pdf`
	 * 为空或省略表示不限制类型。
	 */
	accept?: string[];
	/** 允许的最大文件数量（用于前端提示与并发控制） */
	maxFiles?: number;
}

/** 默认上传配置 */
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
	maxFileSizeMB: 200,
	accept: ["image/*", ".pdf", ".doc", ".docx", ".txt", ".zip", ".mp4", ".webm"],
	maxFiles: 20,
};

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
	/** 文件上传配置 */
	upload?: UploadConfig;
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
	ai: { providers: [], maxConcurrentConversations: 5, conversationTimeoutMin: 20 },
	services: {},
	upload: DEFAULT_UPLOAD_CONFIG,
};
