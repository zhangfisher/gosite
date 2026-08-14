# AppBus 使用说明

## 概述

`AppBus` 是全局事件总线，基于 `fastevent` 实现，支持类型安全的事件订阅和发布。

## 开发环境全局访问

在开发环境下，`AppBus` 会被挂载到 `window` 对象上，可以在浏览器控制台中直接访问：

```javascript
// 浏览器控制台
window.AppBus
```

## 内置事件

### `route:update`

当路由切换时自动触发。

**数据结构：**
```typescript
{
    title: string;  // 页面标题
    url: string;    // 路由路径
}
```

**自动触发位置：** [RootLayout](../layout/index.tsx) 组件通过 `useLocation` 监听路由变化。

## 基本用法

### 发布事件

```typescript
import { AppBus } from "@/eventbus";

AppBus.emit("route:update", {
    title: "首页",
    url: "/"
});
```

### 订阅事件（使用 Hook）

```typescript
import { useEvent } from "@/hooks/useEvent";

function MyComponent() {
    useEvent("route:update", (data) => {
        console.log("路由变化:", data.title, data.url);
    });

    return <div>...</div>;
}
```

### 订阅事件（手动管理）

```typescript
import { AppBus } from "@/eventbus";

const subscriber = AppBus.on("route:update", (data) => {
    console.log("路由变化:", data.title, data.url);
});

// 取消订阅
subscriber.off();
```

## 定义新事件

在 `src/eventbus/index.ts` 中添加新的事件定义：

```typescript
export type AppEvents = TransformedEvents<{
    "route:update": {
        title: string;
        url: string;
    };
    // 新事件
    "user:login": {
        userId: string;
        username: string;
    };
}>;
```

## 类型安全

所有事件都是类型安全的，TypeScript 会自动推断事件数据类型：

```typescript
// ✅ 类型正确
AppBus.emit("route:update", { title: "首页", url: "/" });

// ❌ 类型错误
AppBus.emit("route:update", { title: "首页" }); // 缺少 url
```
