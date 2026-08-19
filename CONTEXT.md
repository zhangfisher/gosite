# CONTEXT.md — GoSite 领域模型

> 本文件仅作为**术语表（glossary）**，不承载实现细节与规格。术语在讨论中一旦确定即在此沉淀。

## 内容节点（Content Node）
`contents` 表中的一行记录，采用嵌套集合模型（Nested Set Model）组织层级：
关键字段为 `id` / `name` / `level` / `left` / `right`，业务字段包括 `title` / `type` /
`content` / `description` / `images` / `files` / `tags` / `video` / `url` / `cover` 等。
本期编辑**基础行**，不触及 `contents_i18n` 翻译表。

## 内容树（Content Tree）
对 `contents` 表的树形结构，由 FlexTree（嵌套集合）管理。通过 `FlexTreeApiService`
以注册名 **`contents`** 暴露为 REST API，挂载于 `/api/contents`（catch-all）。
路由内部将请求 URL 重写为 `/contents/<path>` 以匹配 `/:tree/nodes` 模板，
故前端树数据源即 `/api/contents/nodes`。
提供的核心能力：节点遍历、CRUD、`move` / `copy` / `moveup` / `movedown`。

## 上传根路径（Upload Root）
服务器上**固定**为 `public/upload/`。所有文件落盘于此目录下，对外可访问的 URL
前缀为 `/upload/`。客户端**不得**指定根以外的绝对路径。

## 上传路径（Upload Path）
上传请求（tus 元数据）中携带的、**相对上传根**的子路径，受全局上传配置与越界校验约束。
内容管理场景的默认路径：
- 普通文件 → `contents/<contentId>/files`
- 图片文件 → `contents/<contentId>/images`

## 上传配置（Upload Config）
全局配置 `AdminConfig.upload`，持久化于 `settings` 表（admin 用户）的 JSON 中。
字段含 `maxFileSizeMB` / `accept`（扩展名或 MIME 白名单）/ `maxFiles`。
在**内容（content）设置页**中维护。

## 文件列（Files / Images Columns）
`contents.files` 与 `contents.images`，均为**逗号分隔的相对 public 路径**字符串，
记录该内容节点关联的文件与图片。无独立文件表。

## 内容编辑器（Content Editor）
使用 **cherry-markdown**（腾讯开源、框架无关的 Markdown 编辑器，支持编辑与预览）。
在前端以客户端组件动态加载（不 SSR），绑定 `contents.content` 字段。

## 通用上传组件（Upload Component）
可复用 React 客户端组件：Uppy Dashboard + `@uppy/tus`，指向 `/api/upload`（tus 服务端）。
接收 `path` prop（默认按当前内容节点推导 `contents/<id>/files` 或 `/images`），
也供「属性」中的封面图等场景复用。

## 上传协议（Upload Protocol）
采用 **tus** 可断点续传协议。`/api/upload` 由 `@tus/server` 提供服务端，
多段资源 id（`contents/<id>/files/<随机id>`）保证 `PATCH/DELETE` 路由稳定；
文件落盘于 `public/upload/<id>`，对外 URL 为 `/upload/<id>`。
