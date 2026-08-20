/**
 * 通用文件上传服务（tus 协议）
 *
 * 挂载于 `/api/upload`（可选 catch-all），由 `@tus/server` 的 `handleWeb` 直接处理
 * 所有 tus 方法（POST 创建 / PATCH 续传 / HEAD 查询 / DELETE 取消 / OPTIONS）。
 *
 * 鉴权、大小/类型/路径校验在 `src/lib/upload/server.ts` 的 `onUploadCreate` 钩子中完成。
 * 文件落盘于 `public/upload/<path>/<id>`，对外 URL 为 `/upload/<path>/<id>`。
 */
import { getUploadServer } from "@/lib/upload/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const server = getUploadServer();

export const GET = (req: Request) => server.handleWeb(req);
export const POST = (req: Request) => server.handleWeb(req);
export const PATCH = (req: Request) => server.handleWeb(req);
export const DELETE = (req: Request) => server.handleWeb(req);
export const OPTIONS = (req: Request) => server.handleWeb(req);
export const HEAD = (req: Request) => server.handleWeb(req);
