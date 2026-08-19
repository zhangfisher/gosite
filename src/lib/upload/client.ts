"use client";

/**
 * 前端可调用的上传客户端（headless，无 UI）
 *
 * 封装 `@uppy/core` + `@uppy/tus`，对接 `/api/upload` 的 tus 服务端。
 * 后端已在校验环节统一处理大小 / 类型 / 路径，客户端仅负责发起分片续传上传，
 * 并把 tus 上传地址转换为对外的公开 URL（`/upload/...`）。
 *
 * 用法：
 * ```ts
 * const { url } = await uploadFile(file, { path: "contents/5/files" });
 * ```
 */
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

/** 把 tus 上传地址（/api/upload/...）转为公开可访问地址（/upload/...） */
export function tusUrlToPublicUrl(tusUrl: string): string {
	try {
		const u = new URL(tusUrl);
		return u.pathname.replace(/^\/api\/upload\//, "/upload/");
	} catch {
		return tusUrl.replace(/^\/api\/upload\//, "/upload/");
	}
}

export interface UploadOptions {
	/** 相对于上传根的子路径，如 `contents/5/files` 或 `contents/5/images` */
	path: string;
	/** tus 端点，默认 `/api/upload` */
	endpoint?: string;
	/** 附加到文件的元数据（会随 tus Upload-Metadata 发送） */
	meta?: Record<string, string>;
	/** 进度回调（已上传 / 总字节） */
	onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
	/** 错误回调 */
	onError?: (err: Error) => void;
}

export interface UploadResult {
	/** 公开可访问的 URL（/upload/...） */
	url: string;
	/** tus 上传地址 */
	tusUrl: string;
	/** 文件名 */
	name: string;
}

/**
 * 上传单个文件，返回公开 URL。
 * 默认 `autoProceed`，调用即开始；失败 reject。
 */
export function uploadFile(file: File, opts: UploadOptions): Promise<UploadResult> {
	const endpoint = opts.endpoint ?? "/api/upload";

	return new Promise<UploadResult>((resolve, reject) => {
		const uppy = new Uppy({
			autoProceed: true,
			meta: { path: opts.path },
			restrictions: {},
		}).use(Tus, {
			endpoint,
			chunkSize: 5 * 1024 * 1024,
			retryDelays: [0, 1000, 3000, 5000],
		});

		uppy.on("upload-progress", (_file: any, progress: any) => {
			opts.onProgress?.(progress?.bytesUploaded ?? 0, progress?.bytesTotal ?? 0);
		});

		uppy.on("error", (err: unknown) => {
			const e = err instanceof Error ? err : new Error(String(err));
			opts.onError?.(e);
			reject(e);
		});

		uppy.on("complete", (result: any) => {
			const f = (result?.successful ?? [])[0];
			const tusUrl: string | undefined = f?.uploadURL;
			if (!tusUrl) {
				reject(new Error("上传完成但未返回地址"));
				return;
			}
			resolve({
				url: tusUrlToPublicUrl(tusUrl),
				tusUrl,
				name: f?.name ?? file.name,
			});
		});

		uppy.addFile({
			name: file.name,
			type: file.type,
			data: file,
			meta: { path: opts.path, ...(opts.meta ?? {}) },
		});
	});
}

/** 上传多个文件（并发），返回各自结果；任一失败则整体 reject */
export function uploadFiles(files: File[], opts: UploadOptions): Promise<UploadResult[]> {
	return Promise.all(files.map((f) => uploadFile(f, opts)));
}

/** 可复用客户端对象（如需保持 Uppy 实例复用，可基于此类扩展） */
export const uploadClient = { uploadFile, uploadFiles, tusUrlToPublicUrl };
