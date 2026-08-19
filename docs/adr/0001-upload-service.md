# ADR 0001 — 文件上传服务采用 tus 协议

- 状态：已采纳（Accepted）
- 日期：2026-08-19
- 决策人：gosite 团队

## 背景

需要为后台提供一个**通用的文件上传服务**，要求：上传到服务器、可配置大小与类型、
上传路径相对「上传根」且只能落在 `public/upload` 下。前端（后续）将使用 Uppy 发起上传。

## 决策

1. **协议选型：tus（可断点续传）**。`/api/upload` 由 `@tus/server` 提供 tus 端点
   （`app/api/upload/[[...slug]]/route.ts`，`runtime='nodejs'`，调用 `handleWeb`）。
   客户端用 `@uppy/tus`（或 `src/lib/upload/client.ts` 封装）对接。
2. **落盘位置固定为 `public/upload/`**，对外 URL 前缀 `/upload/`。
   多段 id（`contents/<id>/files/<随机id>`）通过 `namingFunction` + `getFileIdFromRequest`
   实现，使 `PATCH/DELETE` 路由在 catch-all 下稳定。
3. **配置驱动校验**：每次上传创建时实时读取全局 `AdminConfig.upload`
   （`maxFileSizeMB` / `accept` / `maxFiles`），校验大小、类型与路径；
   路径经 `sanitizeUploadPath` 收敛，越界（含 `..`、绝对路径、盘符）即拒。
4. 新增 `UploadConfig` 类型与 `DEFAULT_UPLOAD_CONFIG`，在**内容设置页**维护（前端本期未做）。

## 备选方案

- **XHRUpload（普通 multipart）**：实现更简单，但无断点续传，大文件体验差。
- **`@uppy/companion` 中转**：引入额外服务进程，过重。

## 后果

- 优点：大文件可续传；服务端校验与客户端提示共用 `src/lib/upload/config.ts` 的规则；
  上传根被强制约束，避免任意写盘的安全风险。
- 代价：引入 `@tus/server` / `@tus/file-store`（需在 `next.config.ts` 的
  `serverExternalPackages` 排除，避免 Turbopack 打包报错）；tus 协议对客户端稍重。
- 注意：Windows + Turbopack dev 下对 `@tus/*` 创建符号链接可能有权限告警，
  属开发环境限制，不影响生产 `next build/start`（已 externalize）。
