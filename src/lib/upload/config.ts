/**
 * 上传配置与路径校验助手
 *
 * 集中处理：从全局配置读取并合并 `upload` 配置、解析白名单、校验文件类型、
 * 以及把客户端传入的相对子路径收敛到 `public/upload` 根下（防越界）。
 *
 * 这些纯函数被 tus 服务端（运行时校验）与（未来的）前端 upload client 共用，
 * 保证「服务端校验」与「客户端提示」使用同一套规则。
 */
import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import { DEFAULT_UPLOAD_CONFIG, type AdminConfig, type UploadConfig } from "@/types/settings";

/** 合并默认值与用户配置 */
export function resolveUploadConfig(partial?: Partial<UploadConfig>): UploadConfig {
	return { ...DEFAULT_UPLOAD_CONFIG, ...(partial ?? {}) };
}

/**
 * 实时读取全局上传配置（每次都从库加载，确保后台修改后立即生效，无需重启）。
 */
export async function getUploadConfig(): Promise<UploadConfig> {
	const s = await new Settings<AdminConfig>(ADMIN_USER_ID).load();
	const raw = (s.get("upload") as Partial<UploadConfig> | undefined) ?? {};
	return resolveUploadConfig(raw);
}

/** 解析后的类型白名单 */
export interface AcceptRule {
	/** 小写扩展名（含点），如 `.png` */
	exts: string[];
	/** 小写 MIME / MIME 通配，如 `image/*` */
	mimes: string[];
}

/** 将 `accept` 字符串数组解析为扩展名与 MIME 两类规则 */
export function parseAccept(accept?: string[]): AcceptRule {
	const exts: string[] = [];
	const mimes: string[] = [];
	for (const raw of accept ?? []) {
		const a = raw.trim().toLowerCase();
		if (!a) continue;
		if (a.startsWith(".")) exts.push(a);
		else if (a.includes("/")) mimes.push(a);
		else exts.push("." + a);
	}
	return { exts, mimes };
}

/**
 * 判断文件名 / MIME 是否命中白名单。
 * @param filename 原始文件名（用于扩展名匹配）
 * @param filetype 文件的 MIME（用于 MIME / 通配匹配，可空）
 */
export function matchAccept(
	filename: string | undefined,
	filetype: string | undefined,
	rule: AcceptRule,
): boolean {
	if (rule.exts.length === 0 && rule.mimes.length === 0) return true;

	const lower = (filename ?? "").toLowerCase();
	const ext = lower.includes(".") ? lower.slice(lower.lastIndexOf(".")) : "";
	if (ext && rule.exts.includes(ext)) return true;

	const ft = (filetype ?? "").toLowerCase();
	if (!ft) return false;
	for (const m of rule.mimes) {
		if (m === ft) return true;
		if (m.endsWith("/*") && ft.startsWith(m.slice(0, m.indexOf("/") + 1))) {
			return true;
		}
	}
	return false;
}

/**
 * 把客户端传入的相对子路径收敛为安全形式：
 * - 去除前导 `/` 与结尾 `/`
 * - 拒绝包含 `..`、`.`、`//`、空段或非法字符的路径
 * - 返回相对于上传根的子路径（不含根）
 *
 * 越界或非法返回 `null`。空值回退到 `"tmp"`。
 */
export function sanitizeUploadPath(raw: string | undefined): string | null {
	let p = (raw ?? "").trim().replace(/\\/g, "/");
	if (!p) return "tmp";
	p = p.replace(/^\/+/, "").replace(/\/+$/, "");
	if (!p) return "tmp";

	const segments = p.split("/");
	for (const seg of segments) {
		if (seg === "" || seg === "." || seg === "..") return null;
	}
	// 仅允许：字母数字、下划线、连字符、点、中文与常见 Unicode、斜杠
	if (!/^[\w.\-一-龥/]+$/.test(p)) return null;
	return p;
}

/** 单文件大小上限（字节）；未配置时返回 Infinity（不限制） */
export function maxBytesOf(config: UploadConfig): number {
	const mb = config.maxFileSizeMB;
	if (!mb || mb <= 0) return Infinity;
	return mb * 1024 * 1024;
}
