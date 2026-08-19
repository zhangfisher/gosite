/**
 * tus 上传服务端（单例）
 *
 * 基于 `@tus/server` + `@tus/file-store`，将文件落盘到 `public/upload` 下，
 * 对外可访问 URL 前缀为 `/upload/`。每次上传创建时实时读取全局 `upload` 配置，
 * 校验大小 / 类型 / 路径，并强制路径落在上传根内。
 *
 * 通过 `createNextjsHandler` 的等价方式挂载：在
 * `app/api/upload/[[...slug]]/route.ts` 中调用 `getTusServer().handleWeb(req)`。
 */
import path from "node:path";
import crypto from "node:crypto";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";

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

function buildServer(): Server {
	return new Server({
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
	});
}

declare global {
	// eslint-disable-next-line no-var
	var __tusServer: Server | undefined;
}

/** 获取（惰性创建）tus 服务端单例 */
export function getTusServer(): Server {
	if (!globalThis.__tusServer) {
		globalThis.__tusServer = buildServer();
	}
	return globalThis.__tusServer;
}
