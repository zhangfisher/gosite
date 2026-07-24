---
name: image-finder
description: 根据输入的关键词从 Unsplash 下载符合的图片到本地。支持自定义下载数量、图片尺寸、输出目录和图片方向。当用户需要下载图片、搜索图片、获取图片素材时使用此技能。
---

# Image Finder - Unsplash 图片下载器

从 Unsplash 平台根据关键词搜索并下载高质量图片到本地目录。

## 核心功能

1. **关键词搜索**：根据输入的关键词搜索相关图片
2. **批量下载**：支持一次下载多张图片
3. **自定义参数**：支持自定义图片尺寸、数量、方向等
4. **自动保存**：下载的图片自动保存到指定目录
5. **智能命名**：图片文件名包含 ID 和描述信息

## 使用场景

- 网站开发：下载示例图片用于开发测试
- 设计素材：获取高质量免费图片资源
- 内容创作：为文章和页面寻找配图
- 原型设计：快速获取设计所需图片素材

## 技术依赖

- **Unsplash API**：使用 Unsplash 官方 API 搜索图片
- **Node.js HTTPS**：使用原生 HTTPS 模块下载图片
- **文件系统操作**：自动创建目录和保存文件

## 参数说明

### 必需参数

- `关键词`：搜索关键词，如 "nature"、"office"、"city" 等

### 可选参数

- `--count, -c`：下载数量，默认 5 张，最多 30 张
- `--size, -s`：图片尺寸，可选值：
    - `raw`：原始尺寸（可自定义参数）
    - `full`：最大尺寸 JPG
    - `regular`：1080px 宽度（推荐）
    - `small`：400px 宽度
    - `thumb`：200px 宽度
- `--output, -o`：输出目录，默认 `public/images`
- `--orientation`：图片方向，可选值：
    - `landscape`：横向
    - `portrait`：纵向
    - `squarish`：方形

## 使用示例

### 基础用法

下载 5 张自然主题图片（默认数量）：

```
bun scripts/unsplash-downloader.js "nature"
```

### 自定义数量

下载 10 张办公场景图片：

```
bun scripts/unsplash-downloader.js "office" --count 10
```

### 指定图片尺寸

下载 5 张高清城市图片（full 尺寸）：

```
bun scripts/unsplash-downloader.js "city" --count 5 --size full
```

### 指定图片方向

下载横向风景图片：

```
bun scripts/unsplash-downloader.js "landscape" --orientation landscape
```

### 自定义输出目录

下载图片到指定目录：

```
bun scripts/unsplash-downloader.js "technology" --output ./public/images
```

### 组合参数

下载 15 张纵向医疗图片到自定义目录：

```
bun scripts/unsplash-downloader.js "medical" --count 15 --size regular --orientation portrait --output ./images/medical
```

## 输出说明

### 文件命名格式

下载的图片文件名格式：`{关键词}_{photo_id}.jpg`

例如：`hospital_nMyM7fxpokE.jpg`、`nature_abc123def456.jpg`

### 目录结构

```
public/images/                    # 默认输出目录（项目根目录）
├── nature_abc123def456.jpg      # 下载的图片文件（关键词_图片ID.jpg）
├── nature_xyz789ghi012.jpg
└── ...
```

### 下载结果反馈

下载完成后会显示：

- 搜索到的图片总数
- API 配额使用情况
- 成功下载的图片数量
- 失败的图片及原因
- 图片保存位置
- **所有下载图片的完整路径列表**

## 注意事项

### API 配置

⚠️ **使用前必须配置 Unsplash Access Key**

1. 访问 https://unsplash.com/developers 注册开发者账号
2. 创建新应用获取 Access Key
3. 在 `unsplash-downloader.js` 文件顶部配置 `UNSPLASH_ACCESS_KEY`

### API 限制

- **速率限制**：免费版 50 请求/小时
- **单次搜索**：最多返回 30 张图片
- **图片尺寸**：不同尺寸有不同的大小限制

### 网络要求

- 需要稳定的网络连接
- 下载大尺寸图片时需要较长时间
- 建议在网络良好环境下使用

### 版权说明

Unsplash 图片可免费使用，包括：

- 商业用途
- 修改和裁剪
- 分发和发布

但需遵守：

- 不得直接售卖图片
- 不得声称自己是图片作者
- 不得使用 Unsplash 商标

## 故障排除

### API Key 错误

错误：`⚠️ 请先在脚本顶部配置 UNSPLASH_ACCESS_KEY`

解决：在脚本顶部配置正确的 Access Key

### 网络连接失败

错误：`API 请求失败` 或 `下载失败`

解决：

1. 检查网络连接
2. 确认 API 服务可用
3. 检查防火墙设置

### 配额超限

错误：API 请求返回 403 状态码

解决：等待配额重置或升级 API 计划

### 目录权限问题

错误：无法创建输出目录或保存文件

解决：

1. 检查目录权限
2. 使用有写入权限的目录
3. 手动创建输出目录

## 高级用法

### 批量下载不同类别

```bash
# 下载多类别的图片
bun scripts/unsplash-downloader.js "nature" --count 10 --output ./images/nature
bun scripts/unsplash-downloader.js "technology" --count 10 --output ./images/technology
bun scripts/unsplash-downloader.js "business" --count 10 --output ./images/business
```

### 构建图片库

为项目构建完整的图片素材库：

```bash
# 高质量主图
bun scripts/unsplash-downloader.js "hero" --count 5 --size full --output ./images/hero

# 缩略图
bun scripts/unsplash-downloader.js "thumbnail" --count 20 --size thumb --output ./images/thumbs

# 背景图
bun scripts/unsplash-downloader.js "background" --count 10 --size regular --orientation landscape --output ./images/backgrounds
```

### 自动化脚本

在项目中创建自动化脚本下载所需图片：

```bash
# 开发环境初始化脚本
bun scripts/download-sample-images.sh
```

## 性能优化

### 下载速度

- 使用小尺寸图片（small、thumb）加快下载速度
- 避免在高峰时段使用 API
- 合理设置下载数量

### 存储优化

- 定期清理不需要的图片
- 使用合适的图片尺寸
- 考虑使用图片压缩工具

## 常用关键词

### 自然风景

- `nature`, `landscape`, `mountain`, `ocean`, `forest`, `sunset`, `sky`

### 办公商业

- `office`, `business`, `meeting`, `workspace`, `technology`, `computer`

### 人物肖像

- `person`, `portrait`, `team`, `professional`, `happy`, `smiling`

### 建筑城市

- `architecture`, `city`, `building`, `street`, `urban`, `interior`

### 抽象纹理

- `abstract`, `texture`, `pattern`, `color`, `minimal`, `geometric`

### 食物餐饮

- `food`, `restaurant`, `coffee`, `dining`, `cooking`, `fresh`

## 相关资源

- Unsplash 官网：https://unsplash.com
- Unsplash API 文档：https://unsplash.com/developers
- Unsplash 许可证：https://unsplash.com/license
