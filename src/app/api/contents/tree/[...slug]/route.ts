/**
 * 内容树 REST API（基于 flextree-rest）
 *
 * 挂载于 `/api/contents/tree`，树注册名为 `contents`。
 * 提供树的遍历、CRUD、移动、复制、重排序等全部操作。
 *
 * 注意：flextree-rest 的 nextjs 适配器会把 `req.body` 作为一次性 Web 流再次
 * `new Request(body, duplex:"half")` 转发，Next 16 下该流无法被二次读取，
 * 导致 move / copy 等带 body 的请求解析 JSON 失败（INVALID_BODY）或抛 500。
 * 这里把请求体读成字符串后重新包成可读流再交给适配器；无 body 的请求
 * （GET / moveup / movedown）则直接透传，避免该缺陷。
 */
import { FlexTreeApiService } from "flextree-rest";
import { createNextjsHandler } from "flextree-rest/nextjs";
import { contentManager } from "@/modules/contens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const service = new FlexTreeApiService({
	openapi: {
		enabled: true,
		info: {
			title: "Contents Tree API",
			version: "1.0.0",
			description: "内容管理树（flextree-rest）",
		},
	},
	onError: (err) => {
		console.error("[flextree-rest onError]", err);
		return undefined;
	},
});

// 注册 contents 树（单树模式，无 treeId）。fields 白名单用于 where 平铺等值过滤。
service.register("contents", contentManager.tree, {
	fields: ["id", "name", "title", "type", "level", "url", "tags"],
});

const rawHandler = createNextjsHandler(service);

type NextCtx = { params: { slug: string[] } | Promise<{ slug: string[] }> };
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** 读取请求体文本（Next 16 下 getReader 比 text()/arrayBuffer() 更可靠） */
async function readBody(req: Request): Promise<string> {
	if (!req.body) return "";
	const reader = req.body.getReader();
	const chunks: Uint8Array[] = [];
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) chunks.push(value);
	}
	if (chunks.length === 0) return "";
	const total = chunks.reduce((n, c) => n + c.length, 0);
	const merged = new Uint8Array(total);
	let offset = 0;
	for (const c of chunks) {
		merged.set(c, offset);
		offset += c.length;
	}
	return new TextDecoder().decode(merged);
}

async function forward(
	req: Request,
	ctx: NextCtx,
	method: Method,
): Promise<Response> {
	const params = await ctx.params;
	const hasBody =
		req.method === "POST" || req.method === "PATCH" || req.method === "PUT";
	if (hasBody) {
		const full = await readBody(req);
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(full));
				controller.close();
			},
		});
		const inner = new Request(req.url, {
			method: req.method,
			headers: req.headers,
			body: stream,
			duplex: "half",
		});
		return rawHandler[method](inner, { params: { path: params.slug } });
	}
	return rawHandler[method](req, { params: { path: params.slug } });
}

export const GET = (req: Request, ctx: NextCtx) => forward(req, ctx, "GET");
export const POST = (req: Request, ctx: NextCtx) => forward(req, ctx, "POST");
export const PATCH = (req: Request, ctx: NextCtx) => forward(req, ctx, "PATCH");
export const PUT = (req: Request, ctx: NextCtx) => forward(req, ctx, "PUT");
export const DELETE = (req: Request, ctx: NextCtx) => forward(req, ctx, "DELETE");
