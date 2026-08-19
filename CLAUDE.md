# CLAUDE.md

本文件为 Claude Code 提供本仓库的导航。

## 项目概述

多站点建站系统。前台渲染站点内容，后台（`/admin`）管理站点/产品/内容/模板。所有站点数据（菜单、页眉、页脚、正文、多语言翻译）持久化在 SQLite。

## 技术栈

- **Next.js 16.3.1**（App Router）+ **React 19.2.8** + **React Compiler**（`next.config.ts` 中 `reactCompiler: true`，已启用，不要手写 `useMemo`/`useCallback`）
- **TypeScript 6**（严格模式，`tsconfig.json` `types: ["bun"]`）
- **Tailwind CSS 4**（`@import "tailwindcss"` 语法，`@theme inline` 声明 CSS 变量）
- **Shadcn UI**（`components.json` style `base-nova`，组件在 `src/components/ui/`）
- **Bun** 包管理器（`bun.lock`）

> **Next.js 16 有破坏性变更。** 写代码前先查 `node_modules/next/dist/docs/`，留意弃用通知。`AGENTS.md` 同此条。

## 开发命令

```bash
bun dev                # 开发服务器 http://localhost:3000
bun run build          # 生产构建
bun start              # 生产服务器
bun run db:generate    # 改 schema 后生成迁移到 drizzle/
bun run db:migrate     # 应用迁移
bun run db:push        # 开发环境直推 schema（仅 dev）
bun run db:studio      # Drizzle Studio
bun run db:init        # 初始化数据库
```

## 目录结构

```
src/
├── app/
│   ├── layout.tsx           # 根 layout：<html>/<body>、Geist 字体、防 FOUC 暗色脚本
│   ├── (site)/layout.tsx    # 前台外壳（Header/Footer），独立于 admin
│   ├── admin/               # 后台路由（contents/deploy/resources/settings/template/websites）
│   └── blocks/              # 区块预览页（/blocks），React 组件 + page.tsx
├── blocks/                  # 区块 HTML 原型（heros/features/ctas/footers/cards/...，N.html）
├── components/              # Header/Footer/SiteLink + ui/ + admin/layout/
├── config/menu.ts
├── db/                      # 见下「数据库」
├── eventbus/                # fastevent (FastLiteEvent)，AppBus 挂 window（仅 DEV）
├── hooks/                   # use-mobile 等
├── sites/                   # 多站点：siteRegistry + default 站点配置/页面/产品/i18n
├── themes/                  # base.css（公共骨架+语义类）+ green/blue/indigo.css（品牌色板）
├── types/                   # sites/routing/global.d.ts
└── utils/                   # 可复用工具函数（见下「工具函数」），cn.ts 在此
├── themes/                  # base.css（公共骨架+语义类）+ green/blue/indigo.css（品牌色板）
└── types/                   # sites/routing/global.d.ts
```

**前台与后台 layout 互不继承**，各自维护 Header/Footer 外壳。

## 数据库

- **Drizzle ORM 0.45** + **bun:sqlite** 驱动，文件 `data/data.db`（不入版本控制）
- 连接与导出在 `src/db/index.ts`；已 `PRAGMA foreign_keys = ON`
- schema 在 `src/db/schema/`：`contents`、`contents_translations`、`sites`、`sites_translations`
- **FlexTree 3** 管理树形结构，通过自定义 `DrizzleTreeAdapter`（`src/db/utils/treeAdapter.ts`）桥接
- **关键约定：`contents` 表内嵌嵌套集合字段（`left`/`right`/`level`/`type`）。所有树形 CRUD 必须经 FlexTree API，严禁直接 SQL 改 `left`/`right`/`level`。** model 层入口见 `src/db/models/`（`getContents(db)`、`getSites(db)` 返回管理器）。
- 翻译走 `*_translations` 表：每个站点/内容每种语言一条记录。

## 多站点与 i18n

- 站点注册表 `src/sites/index.ts` → `siteRegistry`，当前仅 `default`；类型见 `src/types/sites.ts`（`SiteConfig`：`defaultLanguage`、`languages`、`contacts`、`socials` 等）
- i18n 配置 `src/sites/default/i18n.ts`：用 `bcp47-language-tags`，默认 `zh-CN`，支持 `zh-CN`/`en-US`

## 主题系统

主题 = Tailwind 基础 + `src/themes/base.css`（中性灰阶、暗色变体、语义类如 `.btn-primary`/`.card-glass`/`.heading-1`）+ 一套品牌色板（`green`/`blue`/`indigo`）。

**切换品牌色：改 `src/app/globals.css` 第三个 `@import "../themes/<color>.css"`，不动任何组件代码。**

暗色模式：class 策略，`dark:` 前缀 + `localStorage.theme === 'dark'`，根 layout 内联脚本防 FOUC。

## UI 约定

- 图标用 `lucide-react`，**`strokeWidth={1}`**
- 社交图标用 `react-social-icons`：`<SocialIcon url="<链接>" network="<网络名>" />`
- 路径别名 `@/*` → `./src/*`

## API 集成约定

- **所有 HTTP API 必须基于 `next-rest-framework` 实现**（`route`/`apiRoute` + `routeOperation`/`apiRouteOperation`），以便自动生成 OpenAPI 文档（红框文档页 `/api` 与 `public/api/openapi.json`）。
- 路由文件通过这些导出暴露 `GET/POST/...`；请求体/响应体用 zod schema 描述，自动进入文档。
- **允许的例外**（无法走 NRF 标准请求模型，必须在 `scripts/fix-openapi.ts` 中把对应路径补进 OpenAPI，否则不出现在文档）：
  - 原始流式协议端点，如 tus 上传 `/api/upload`（需裸请求体透传，NRF 会剥离 body）。
  - 第三方框架聚合端点，如 `better-auth` 的 `/api/auth/*`（`toNextJsHandler`）。
  - SSE / 流式响应端点（如 `/api/ai/*` 的部分接口）。
- 新增 API 前先确认是否可用 NRF；属例外情形时必须在 `fix-openapi.ts` 补文档。
- **API 分组（OpenAPI tags）**：每个 NRF 接口通过 `routeOperation({ openApiOperation: { tags: [...] } })` 声明所属分组；redoc 文档按 tag 成组。统一分类：
  - `System`（版本/健康检查）、`Auth`（/api/auth/*）、`Admin`（后台配置/设置）、
  - `AI`（/api/ai/*）、`Content`（内容树/内容管理）、`Upload`（文件上传 /api/upload）。
  - 例外端点（手动注入 `fix-openapi.ts`）也按此分类打 `tags`。

## 工具函数

`src/utils/` 保存可复用的工具函数，**每个函数单独一个文件**（如 `src/utils/<fnName>.ts`）。已无 `src/lib/` 目录。

Shadcn 的 `cn`（类名拼接）也已迁入此处：`src/utils/cn.ts`，`components.json` 的 `aliases.utils` 与 `aliases.lib` 均指向 `@/utils`。

## Domain Docs

单一上下文（single-context）布局约定：根目录 `CONTEXT.md` + `docs/adr/`。详见 `docs/agents/domain.md`。这些文件目前可选——不存在时静默继续，不主动创建。

## 注意

- `src/db/` 下存在大量一次性 `add-*`/`verify-*`/`fix-*` 脚本（历史迁移用），勿作为约定参考；权威定义是 `schema/` 与 `models/`。
- 除非用户明确要求，不主动执行 git 提交/分支操作。
