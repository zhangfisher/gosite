# 主题切换指南

## 🎨 语义化主题系统

这是一个基于 Tailwind CSS v4 的语义化主题系统，允许您通过简单的配置更改来切换整个应用的视觉风格，而不需要修改任何组件代码。

## 🔄 如何切换主题

### 方法一：修改 globals.css（推荐）

在 `src/app/globals.css` 中修改导入语句：

```css
/* 使用 Indigo 主题 */
@import "../themes/indigo.css";

/* 使用 Blue 主题 */
@import "../themes/blue.css";

/* 使用 Green 主题（如果存在） */
@import "../themes/green.css";
```

### 方法二：创建新主题

1. **复制现有主题文件**
```bash
cp src/themes/indigo.css src/themes/purple.css
```

2. **修改颜色值**
在 `@theme` 块中修改 `--color-theme-*` 的值：

```css
@theme {
  /* 将 indigo 颜色值替换为 purple 颜色值 */
  --color-theme-50: oklch(96.9% 0.016 293.756);
  --color-theme-100: oklch(94.3% 0.029 294.588);
  --color-theme-600: oklch(54.1% 0.281 293.009);
  /* ... 其他颜色 */
}
```

3. **应用新主题**
在 `globals.css` 中导入新主题：
```css
@import "../themes/purple.css";
```

## 📂 现有主题

| 主题文件 | 颜色系统 | 描述 |
|---------|---------|------|
| `indigo.css` | Indigo (靛蓝) | 默认主题，专业商务风格 |
| `blue.css` | Blue (蓝色) | 清新现代风格 |

## 🎨 颜色命名规范

### 语义化颜色变量

所有主题都使用统一的语义化命名：

```css
--color-theme-50   /* 最浅的主题色 */
--color-theme-100
--color-theme-200
--color-theme-300
--color-theme-400
--color-theme-500
--color-theme-600  /* 主要按钮色 */
--color-theme-700  /* 图标强调色 */
--color-theme-800
--color-theme-900
--color-theme-950  /* 最深的主题色 */
```

### 在组件中使用

组件只使用语义化的颜色类名：

```tsx
/* ✅ 正确 - 使用语义化颜色 */
<button className="btn-primary">主要按钮</button>
<div className="stat-number">1.2万+</div>
<svg className="check-icon" />

/* ❌ 错误 - 不要使用具体的颜色名称 */
<button className="bg-indigo-600">按钮</button>
<div className="text-blue-600">数字</div>
```

## 🔧 组件类系统

每个主题文件都包含统一的组件类：

### 按钮组件
- `.btn-primary` - 主要按钮（实心主题色）
- `.btn-secondary` - 次要按钮（描边样式）

### 卡片组件
- `.card` - 标准卡片
- `.card-accent` - 强调卡片（带主题色边框）

### 图标组件
- `.icon-box` - 图标容器（带主题色背景）
- `.check-icon` - 对勾图标

### 排版组件
- `.heading-1` - 一级标题
- `.heading-2` - 二级标题  
- `.heading-3` - 三级标题
- `.text-primary` - 主要文字
- `.text-secondary` - 次要文字
- `.text-muted` - 弱化文字

### 其他组件
- `.stat-number` - 统计数字
- `.container-responsive` - 响应式容器

## 🎯 主题设计原则

1. **一致性** - 所有主题使用相同的组件类结构
2. **语义化** - 使用 `theme-*` 而不是具体颜色名
3. **可维护性** - 颜色集中管理，易于更新
4. **可扩展性** - 轻松添加新主题

## 🚀 实际应用示例

### 创建自定义主题

假设您想为特定客户创建一个品牌主题：

```css
/* src/themes/client-brand.css */
@import "tailwindcss";

@theme {
  /* 使用客户品牌的绿色系统 */
  --color-theme-50: oklch(98.2% 0.018 155.826);
  --color-theme-100: oklch(96.2% 0.044 156.743);
  --color-theme-600: oklch(62.7% 0.194 149.214);
  --color-theme-700: oklch(52.7% 0.154 150.069);
  /* ... 其他颜色保持相同的命名结构 */
}

/* 其余组件类保持不变... */
```

然后在 `globals.css` 中：
```css
@import "@/themes/client-brand.css";
```

## 🎨 颜色选择建议

选择主题色时，确保：

1. **足够的对比度** - 主要文本和背景之间有良好的对比
2. **一致的视觉层次** - 50-950 色阶形成完整的视觉深度
3. **品牌一致性** - 颜色符合品牌识别系统
4. **可访问性** - 满足 WCAG 对比度要求

## 🔍 故障排除

### 颜色没有生效？
1. 确保主题文件已正确导入到 `globals.css`
2. 检查组件是否使用了正确的语义化类名
3. 清除浏览器缓存并重新构建

### CSS 警告信息？
编辑器中显示的 `Unknown at rule @theme` 等警告是正常的，因为 CSS 语言服务器还没有完全支持 Tailwind CSS v4 的新语法。这些不会影响实际功能。

## 📚 相关资源

- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [主题变量文档](https://tailwindcss.com/docs/theme)
- [颜色系统指南](https://tailwindcss.com/docs/colors)