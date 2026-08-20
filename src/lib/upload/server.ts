/**
 * 文件上传服务端（单例），提供可扩展的事件订阅机制。
 *
 * 基于 `@tus/server` + `@tus/file-store`，将文件落盘到 `public/upload` 下，
 * 对外可访问 URL 前缀为 `/upload/`。每次上传创建时实时读取全局 `upload` 配置，
 * 校验大小 / 类型 / 路径，并强制路径落在上传根内。
 *
 * 扩展机制：其他模块可以通过 `getUploadServer().on('upload', callback)`
 * 订阅文件上传完成事件，在 callback 中接收完整的上传信息。
 *
 * 用法示例：
 * ```ts
 * import { getUploadServer } from "@/lib/upload/server";
 *
 * const server = getUploadServer();
 * server.on('upload', async (event) => {
 *   // event.url    → 公开可访问的 URL（/upload/...）
 *   // event.id     → tus 文件 ID
 *   // event.name   → 文件名
 *   // event.size   → 文件大小（字节）
 *   // event.metadata → 上传时附加的元数据
 *   // await saveToDatabase(event);
 * });
 * ```
 */
import { EventEmitter } from "node:events";
import path from "node:path";
import crypto from "node:crypto";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import type { Upload } from "@tus/utils";

import {
	getUploadConfig,
	parseAccept,
	matchAccept,
	sanitizeUploadPath,
	maxBytesOf,
} from "./config";

/** 上传根目录（仓库根的 public/upload） */
export const UPLOAD_ROOT = path.join(process.cwd(), "public", "upload");

/** 对外可访问的 URL 前缀（对应 public/upload） */
export const UPLOAD_PUBLIC_PREFIX = "/upload";

// ------------------------------------------------------------------
// UploadEvent：传递给 `upload` 事件订阅者的数据结构
// ------------------------------------------------------------------

/** 文件上传完成事件 */
export interface UploadEvent {
	/** tus 文件 ID（含子路径，如 `contents/5/abc123`） */	id: string;
	/** 公开可访问的 URL（如 `/upload/contents/5/abc123`） */	url: string;
	/** 文件名（来自元数据） */	name: string;
	/** 文件大小（字节），未知时为 undefined */	size: number | undefined;
	/** 上传时附加的元数据 */	metadata: Record<string, string | null> | undefined;
	/** 原始 tus Upload 对象 */	upload: Upload;
}

// ------------------------------------------------------------------
// UploadServer：在 tus Server 基础上扩展 EventEmitter
// ------------------------------------------------------------------

/** UploadServer 事件映射 */
export interface UploadServerEvents {
	/** 文件上传完成 */	upload: [event: UploadEvent];
}

/**
 * 文件上传服务，封装 `@tus/server` 并提供事件订阅能力。
 *
 * 继承 `EventEmitter`，支持以下事件：
 * - `upload`：文件上传完成时触发，回调接收 {@link UploadEvent}
 */
export class UploadServer extends EventEmitter<UploadServerEvents> {
	/** 底层 tus Server 实例 */
	readonly tus: Server;

	constructor() {
		super();

		// 捕获 UploadServer 实例引用，供 onUploadFinish 回调中使用
		const self = this;

		const server = new Server({
			// 必须与路由挂载路径一致
			path: "/api/upload",
			datastore: new FileStore({ directory: UPLOAD_ROOT }),
			allowedOrigins: ["*"],

			// 返回 "<相对子路径>/<随机id>"，既作为存储路径也作为 URL id
			namingFunction(_req, metadata) {
				const id = crypto.randomBytes(16).toString("hex");
				const sub = (metadata?.path as string) || "tmp";
				return `${sub}/${id}`;
			},

			// tus 上传 URL（含多段 id）；客户端据此推导公开 URL
			generateUrl(_req, { proto, host, id }) {
				return `${proto}://${host}/api/upload/${id}`;
			},

			// 从完整 URL 还原多段 id（catch-all 路由下 id 含斜杠）
			getFileIdFromRequest(req, lastPath) {
				const url = new URL(req.url);
				const base = "/api/upload/";
				if (url.pathname.startsWith(base)) {
					return decodeURIComponent(url.pathname.slice(base.length));
				}
				return lastPath;
			},

			async onUploadCreate(req, upload) {
				const cfg = await getUploadConfig();
				const meta = (upload.metadata ?? {}) as Record<string, string>;

				// 1) 大小
				const maxBytes = maxBytesOf(cfg);
				if (upload.size != null && maxBytes !== Infinity && upload.size > maxBytes) {
					throw {
						status_code: 413,
						body: `文件超过大小上限 ${cfg.maxFileSizeMB}MB`,
					};
				}

				// 2) 类型（扩展名 / MIME 白名单）
				const rule = parseAccept(cfg.accept);
				if (!matchAccept(meta.filename, meta.filetype, rule)) {
					throw { status_code: 415, body: "不支持的文件类型" };
				}

				// 3) 路径越界校验（必须落在上传根下）
				const sub = sanitizeUploadPath(meta.path);
				if (!sub) {
					throw { status_code: 403, body: "非法的上传路径" };
				}

				// 把收敛后的子路径写回元数据，供 namingFunction 使用
				return { metadata: { ...meta, path: sub } };
			},

			// 上传完成后触发自定义 upload 事件
			async onUploadFinish(_req, upload) {
				const meta = (upload.metadata ?? {}) as Record<string, string>;
				const filename = meta.filename || meta.name || "unknown";

				// 从 tus URL 推导公开 URL
				const publicUrl = `${UPLOAD_PUBLIC_PREFIX}/${upload.id}`;

				const event: UploadEvent = {
					id: upload.id,
					url: publicUrl,
					name: filename,
					size: upload.size,
					metadata: upload.metadata,
					upload,
				};

				// 在下一个微任务中触发，避免阻塞 tus 响应流程
				queueMicrotask(() => self.emit("upload", event));

				return {};
			},
		});

		this.tus = server;
	}

	/** 转发 tus 请求到底层 Server */	handleWeb(req: Request): Promise<Response> {
		return this.tus.handleWeb(req);
	}
}

// ------------------------------------------------------------------
// 全局单例
// ------------------------------------------------------------------

declare global {
	// eslint-disable-next-line no-var
	var __uploadServer: UploadServer | undefined;
}

/**
 * 获取（惰性创建）文件上传服务单例。
 *
 * 其他模块可通过返回的实例订阅上传事件：
 * ```ts
 * const server = getUploadServer();
 * server.on('upload', async (event) => { ... });
 * ```
 */
export function getUploadServer(): UploadServer {
	if (!globalThis.__uploadServer) {
		globalThis.__uploadServer = new UploadServer();
	}
	return globalThis.__uploadServer;
}

/** @deprecated 使用 `getUploadServer` 代替 */
export function getTusServer(): UploadServer {
	return getUploadServer();
}

/**
 * 全局单例，可直接导入使用：
 * ```ts
 * import { uploadServer } from "@/lib/upload/server";
 * uploadServer.on('upload', async (event) => { ... });
 * ```
 */
export const uploadServer = getUploadServer();
