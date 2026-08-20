/**
 * 内容树 REST API（基于 flextree-rest）
 *
 * 挂载于 `/api/contents/tree`，树注册名为 `contents`。
 * 提供树的遍历、CRUD、移动、复制、重排序等全部操作：
 *
 * - GET    /api/contents/tree/contents              → 导出整棵树（toJson）
 * - GET    /api/contents/tree/contents/nodes        → 节点列表（?level=0 取根，支持 where 过滤与分页）
 * - POST   /api/contents/tree/contents/nodes        → 新增节点（body: { nodes, at, pos }）
 * - GET    /api/contents/tree/contents/nodes/:id    → 获取节点
 * - PATCH  /api/contents/tree/contents/nodes/:id    → 更新节点字段
 * - DELETE /api/contents/tree/contents/nodes/:id    → 删除节点
 * - POST   /api/contents/tree/contents/nodes/:id/move       → 移动
 * - POST   /api/contents/tree/contents/nodes/:id/copy       → 复制
 * - POST   /api/contents/tree/contents/nodes/:id/moveup     → 上移
 * - POST   /api/contents/tree/contents/nodes/:id/movedown   → 下移
 * - GET    /api/contents/tree/contents/nodes/:id/children   → 直接子节点
 * - GET    /api/contents/tree/contents/nodes/:id/descendants→ 后代节点
 * - ...（详见 flextree-rest OpenAPI：GET /api/contents/tree/openapi.json）
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
});

// 注册 contents 树（单树模式，无 treeId）。fields 白名单用于 where 平铺等值过滤。
// 复用 contentManager.tree 的同一 FlexTreeManager 实例，避免多实例缓存不一致。
service.register("contents", contentManager.tree, {
	fields: ["id", "name", "title", "type", "level", "url", "tags"],
});

const rawHandler = createNextjsHandler(service);
const basePath = "/api/contents/tree";

type NextCtx = { params: { slug: string[] } | Promise<{ slug: string[] }> };

function wrap(
	method: (req: Request, ctx: { params: { path: string[] } }) => Promise<Response>,
) {
	return async (req: Request, ctx: NextCtx) => {
		const params = await ctx.params;
		return method(req, { params: { path: params.slug } });
	};
}

export const GET = wrap(rawHandler.GET);
export const POST = wrap(rawHandler.POST);
export const PATCH = wrap(rawHandler.PATCH);
export const PUT = wrap(rawHandler.PUT);
export const DELETE = wrap(rawHandler.DELETE);
