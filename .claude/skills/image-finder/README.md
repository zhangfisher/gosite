# Image Finder 技能使用指南

## 快速开始

### 1. 配置 API Key

在 `unsplash-downloader.js` 文件顶部配置你的 Unsplash Access Key：

```javascript
const UNSPLASH_ACCESS_KEY = "your_access_key_here" // 替换为你的 Access Key
```

### 2. 获取 Access Key

1. 访问 https://unsplash.com/developers
2. 点击 "New Application"
3. 填写应用信息
4. 获取 Access Key

### 3. 基本使用

```bash
# 下载 5 张自然主题图片（默认）
bun unsplash-downloader.js "nature"

# 下载 10 张办公场景图片
bun unsplash-downloader.js "office" --count 10

# 下载高清横向城市图片
bun unsplash-downloader.js "city" --size full --orientation landscape
```

## 命令参数速查表

| 参数          | 短参数 | 说明               | 默认值      |
| ------------- | ------ | ------------------ | ----------- |
| 关键词        | -      | 搜索关键词（必需） | -           |
| --count       | -c     | 下载数量           | 5           |
| --size        | -s     | 图片尺寸           | regular     |
| --output      | -o     | 输出目录           | ./downloads |
| --orientation | -      | 图片方向           | -           |

## 图片尺寸说明

| 尺寸    | 分辨率   | 用途             |
| ------- | -------- | ---------------- |
| raw     | 原始尺寸 | 高质量输出       |
| full    | 最大尺寸 | 高清显示         |
| regular | 1080px   | 网页显示（推荐） |
| small   | 400px    | 缩略图           |
| thumb   | 200px    | 小图标           |

## 图片方向

- `landscape`：横向图片
- `portrait`：纵向图片
- `squarish`：方形图片

## 输出位置

默认下载到 `./downloads` 目录，可通过 `--output` 参数自定义。

文件名格式：`{photo_id}_{sanitized_description}.jpg`

## 常见问题

### Q: API 配额用完了怎么办？

A: 免费版限制 50 请求/小时，可以：

1. 等待配额重置（每小时）
2. 升级到付费计划
3. 批量下载减少请求次数

### Q: 下载失败怎么办？

A: 检查：

1. 网络连接是否正常
2. API Key 是否正确
3. API 配额是否充足
4. 输出目录是否有写入权限

### Q: 如何批量下载多个关键词？

A: 创建脚本依次执行：

```bash
for keyword in "nature" "city" "office"; do
  bun unsplash-downloader.js "$keyword" --count 5 --output "./images/$keyword"
done
```

## 使用技巧

### 1. 按类别组织图片

```bash
bun unsplash-downloader.js "nature" --output ./images/nature
bun unsplash-downloader.js "business" --output ./images/business
bun unsplash-downloader.js "technology" --output ./images/tech
```

### 2. 构建响应式图片集

```bash
# 下载不同尺寸的同一主题
bun unsplash-downloader.js "office" --count 5 --size full --output ./images/full
bun unsplash-downloader.js "office" --count 5 --size regular --output ./images/regular
bun unsplash-downloader.js "office" --count 5 --size small --output ./images/small
```

### 3. 下载特定方向图片

```bash
# 横向横幅图
bun unsplash-downloader.js "landscape" --orientation landscape --size full

# 纵向海报图
bun unsplash-downloader.js "portrait" --orientation portrait --size full
```

## 版权使用说明

Unsplash 图片可免费用于：

- ✅ 商业项目
- ✅ 网站和应用
- ✅ 印刷品
- ✅ 修改和编辑
- ✅ 分发和发布

需遵守的规则：

- ❌ 不得直接售卖图片本身
- ❌ 不得声称自己是作者
- ❌ 不得使用 Unsplash 商标
- ✅ 建议在使用时标注摄影师

详细许可：https://unsplash.com/license
