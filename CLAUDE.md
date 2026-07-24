# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **Next.js 16.2.11** 的现代 Web 应用，使用 **React 19** 和 **React Compiler**，采用最新的 **Tailwind CSS 4** 和 **DaisyUI** 组件库。

**⚠️ 重要：** Next.js 16 有重大变更，API、约定和文件结构可能与训练数据不同。在编写任何代码之前，请阅读 `node_modules/next/dist/docs/` 中的相关指南。注意弃用通知。

## 开发命令

```bash
# 启动开发服务器 (http://localhost:3000)
bun dev
# 或
npm run dev

# 生产构建
bun run build
# 或
npm run build

# 启动生产服务器
bun start
# 或
npm start
```

**注意：** 项目使用 Bun 作为包管理器（bun.lock），但也支持 npm。

## 关键技术栈

### 核心框架

- **Next.js 16.2.11** - 使用 App Router 架构
- **React 19.2.4** + **React Compiler** (已启用)
- **TypeScript 5** (严格模式)

### 样式系统

- **Tailwind CSS 4** - 最新版本，使用新的 `@import "tailwindcss"` 语法
- **CSS 变量主题系统** - 支持多主题皮肤切换，声明在themes/\*.css中，在 globals.css 按需引用，支持暗色模式
- 不要在globals.css 中编写样式。

### 重要配置

**React Compiler 已启用** (`next.config.ts`):

- React Compiler 会自动优化组件性能
- 不再需要手动使用 `useMemo`、`useCallback` 等 API
- 让 React Compiler 处理性能优化

**路径别名** (`tsconfig.json`):

- `@/*` 映射到 `./src/*`
- 使用时：`import { foo } from "@/components/bar"`

## 项目结构

```
src/
└── app/                      # App Router 目录
    ├── layout.tsx           # 根布局
    ├── page.tsx             # 首页
    ├── globals.css          # 全局样式 (Tailwind CSS 4 语法)
    └── favicon.ico          # 网站图标
```

**Tailwind CSS 4 的重要变化：**

- 不再使用 `tailwind.config.js` 文件
- 使用 `@import "tailwindcss"` 而不是传统的插件方式
- 主题配置通过 `@theme inline` 在 CSS 中直接定义
- CSS 变量用于颜色主题切换

## 开发注意事项

1. **阅读 Next.js 16 文档** - `node_modules/next/dist/docs/` 中的最新文档
2. **React Compiler 优化** - 信任 React Compiler 处理性能优化
3. **TypeScript 严格模式** - 确保类型安全
4. **暗色模式支持** - 使用 `dark:` 前缀和 CSS 变量
5. **路径别名** - 优先使用 `@/` 导入路径

## 相关文档

- [Next.js 16 文档](https://nextjs.org/docs)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Tailwind CSS 4 文档](https://tailwindcss.com/docs)
- [DaisyUI 文档](https://daisyui.com/docs)
