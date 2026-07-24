#!/usr/bin/env bun
/**
 * Unsplash 图片下载器
 *
 * 用法：
 *   bun unsplash-downloader.js <关键词> [选项]
 *
 * 示例：
 *   bun unsplash-downloader.js "nature" --count 10
 *   bun unsplash-downloader.js "office" --count 5 --size full --output ./images
 */

// ============================================
// 配置区 - 请在此处配置您的 API Key
// ============================================

const UNSPLASH_ACCESS_KEY = "ZLUvqcIyQTDMJS3poI-yvKqPeDiaVnOtgNKnzjLrPBE" // ⚠️ 请替换为您的 Unsplash Access Key
const UNSPLASH_API_BASE = "https://api.unsplash.com"
const UNSPLASH_API_VERSION = "v1"

// ============================================
// 命令行参数解析
// ============================================

function parseArgs(args) {
    const params = {
        query: "",
        count: 5,
        size: "regular",
        output: "public/images",
        orientation: "",
        help: false,
    }

    const sizeOptions = ["raw", "full", "regular", "small", "thumb"]
    const orientationOptions = ["landscape", "portrait", "squarish"]

    for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        const nextArg = args[i + 1]

        switch (arg) {
            case "--help":
            case "-h":
                params.help = true
                break
            case "--count":
            case "-c":
                params.count = parseInt(nextArg) || 5
                i++
                break
            case "--size":
            case "-s":
                if (sizeOptions.includes(nextArg)) {
                    params.size = nextArg
                } else {
                    console.error(`错误：无效的尺寸选项 "${nextArg}"`)
                    console.error(`可选值：${sizeOptions.join(", ")}`)
                    process.exit(1)
                }
                i++
                break
            case "--output":
            case "-o":
                params.output = nextArg
                i++
                break
            case "--orientation":
                if (orientationOptions.includes(nextArg)) {
                    params.orientation = nextArg
                } else {
                    console.error(`错误：无效的方向选项 "${nextArg}"`)
                    console.error(`可选值：${orientationOptions.join(", ")}`)
                    process.exit(1)
                }
                i++
                break
            default:
                if (!arg.startsWith("--")) {
                    params.query = arg
                }
                break
        }
    }

    return params
}

// ============================================
// 工具函数
// ============================================

/**
 * 查找项目根目录
 * 通过向上查找 package.json 来确定项目根目录
 */
function findProjectRoot() {
    const path = require("path")
    const fs = require("fs")

    let currentDir = process.cwd()

    // 最多向上查找 10 层
    for (let i = 0; i < 10; i++) {
        const packageJsonPath = path.join(currentDir, "package.json")

        if (fs.existsSync(packageJsonPath)) {
            return currentDir
        }

        const parentDir = path.dirname(currentDir)
        if (parentDir === currentDir) {
            // 已到达文件系统根目录
            break
        }
        currentDir = parentDir
    }

    // 如果找不到 package.json，返回当前工作目录
    return process.cwd()
}

/**
 * 清理文件名，移除不安全字符
 */
function sanitizeFilename(name) {
    if (!name) return "photo"
    // 移除或替换不安全的文件名字符
    return name
        .replace(/[<>:"/\\|?*]/g, "_")
        .replace(/\s+/g, "_")
        .substring(0, 50) // 限制长度
}

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           Unsplash 图片下载器                              ║
╚════════════════════════════════════════════════════════════╝

用法：
  bun unsplash-downloader.js <关键词> [选项]

参数：
  关键词                  搜索关键词（必需）
  --count, -c <数量>      下载数量，默认 5
  --size, -s <尺寸>       图片尺寸：raw|full|regular|small|thumb，默认 regular
  --output, -o <目录>     输出目录，默认 public/images
  --orientation <方向>    图片方向：landscape|portrait|squarish
  --help, -h              显示帮助信息

示例：
  # 下载 10 张自然主题图片
  bun unsplash-downloader.js "nature" --count 10

  # 下载 5 张高清办公场景图片
  bun unsplash-downloader.js "office" --count 5 --size full

  # 下载横向城市图片到自定义目录
  bun unsplash-downloader.js "city" --orientation landscape --output ./my-images

图片尺寸说明：
  - raw     : 原始尺寸（可自定义参数）
  - full    : 最大尺寸 JPG
  - regular : 1080px 宽度（推荐）
  - small   : 400px 宽度
  - thumb   : 200px 宽度

注意事项：
  ⚠️ 使用前请在脚本顶部配置 UNSPLASH_ACCESS_KEY
  ⚠️ Unsplash API 免费版限制：50 请求/小时
  ⚠️ 每次搜索最多返回 30 张图片
`)
}

// ============================================
// Unsplash API 调用
// ============================================

/**
 * 搜索 Unsplash 图片
 */
async function searchPhotos(query, count, orientation) {
    if (
        !UNSPLASH_ACCESS_KEY ||
        UNSPLASH_ACCESS_KEY === "your_access_key_here"
    ) {
        throw new Error(
            "⚠️ 请先在脚本顶部配置 UNSPLASH_ACCESS_KEY\n" +
                "获取方式：https://unsplash.com/developers",
        )
    }

    const url = new URL(`${UNSPLASH_API_BASE}/search/photos`)
    url.searchParams.append("query", query)
    url.searchParams.append("per_page", Math.min(count, 30).toString())
    if (orientation) {
        url.searchParams.append("orientation", orientation)
    }

    console.log(`🔍 正在搜索 "${query}"...`)

    const response = await fetch(url, {
        headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            "Accept-Version": UNSPLASH_API_VERSION,
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(
            `API 请求失败：${response.status} - ${JSON.stringify(error.errors)}`,
        )
    }

    // 显示速率限制信息
    const remaining = response.headers.get("X-Ratelimit-Remaining")
    const limit = response.headers.get("X-Ratelimit-Limit")
    if (remaining && limit) {
        console.log(`📊 API 配额：${remaining}/${limit} 剩余`)
    }

    const data = await response.json()
    console.log(
        `✅ 找到 ${data.total} 张图片，获取前 ${data.results.length} 张`,
    )

    return data.results
}

/**
 * 触发下载追踪（用于 Unsplash 统计）
 */
async function trackDownload(photoId) {
    try {
        await fetch(`${UNSPLASH_API_BASE}/photos/${photoId}/download`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                "Accept-Version": UNSPLASH_API_VERSION,
            },
        })
    } catch (error) {
        // 下载追踪失败不影响主流程
        // console.warn('下载追踪失败:', error.message);
    }
}

// ============================================
// 图片下载
// ============================================

/**
 * 下载单张图片
 */
async function downloadImage(imageUrl, outputPath, filename, index, total) {
    return new Promise((resolve, reject) => {
        const https = require("https")
        const fs = require("fs")
        const path = require("path")

        const filepath = path.join(outputPath, filename)
        const file = fs.createWriteStream(filepath)

        console.log(`  [${index + 1}/${total}] ⬇️  下载: ${filename}`)

        https
            .get(imageUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`下载失败：${response.statusCode}`))
                    return
                }

                response.pipe(file)

                file.on("finish", () => {
                    file.close()
                    const stats = fs.statSync(filepath)
                    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
                    console.log(
                        `  [${index + 1}/${total}] ✅ 完成: ${filename} (${sizeMB} MB)`,
                    )
                    resolve(filepath)
                })
            })
            .on("error", (err) => {
                fs.unlink(filepath, () => {}) // 删除不完整的文件
                reject(err)
            })
    })
}

/**
 * 批量下载图片
 */
async function downloadPhotos(photos, size, outputDir, query) {
    const fs = require("fs")
    const path = require("path")

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
        console.log(`📁 创建输出目录：${outputDir}`)
    }

    const downloadedFiles = []
    const errors = []

    console.log("\n📥 开始下载图片...\n")

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]

        try {
            // 获取图片 URL
            const imageUrl = photo.urls[size]

            // 生成文件名：使用关键词而非图片描述
            const sanitizedQuery = sanitizeFilename(query)
            const filename = `${sanitizedQuery}_${photo.id}.jpg`

            // 下载图片
            const filepath = await downloadImage(
                imageUrl,
                outputDir,
                filename,
                i,
                photos.length,
            )
            downloadedFiles.push(filepath)

            // 触发下载追踪
            await trackDownload(photo.id)
        } catch (error) {
            console.error(
                `  [${i + 1}/${photos.length}] ❌ 失败: ${error.message}`,
            )
            errors.push({ photo, error: error.message })
        }
    }

    return { downloadedFiles, errors }
}

// ============================================
// 主流程
// ============================================

async function main() {
    const args = process.argv.slice(2)
    const params = parseArgs(args)

    // 显示帮助信息
    if (params.help) {
        showHelp()
        process.exit(0)
    }

    // 验证必需参数
    if (!params.query) {
        console.error("❌ 错误：请提供搜索关键词\n")
        showHelp()
        process.exit(0)
    }

    // 查找项目根目录并转换输出路径为绝对路径
    const path = require("path")
    const projectRoot = findProjectRoot()

    // 如果输出路径是相对路径，则基于项目根目录解析
    if (!path.isAbsolute(params.output)) {
        params.output = path.resolve(projectRoot, params.output)
    }

    console.log("\n🖼️  Unsplash 图片下载器")
    console.log("━".repeat(50))

    try {
        // 1. 搜索图片
        const photos = await searchPhotos(
            params.query,
            params.count,
            params.orientation,
        )

        if (photos.length === 0) {
            console.log("\n⚠️  未找到匹配的图片")
            process.exit(0)
        }

        // 2. 下载图片
        const { downloadedFiles, errors } = await downloadPhotos(
            photos,
            params.size,
            params.output,
            params.query,
        )

        // 3. 显示统计信息
        console.log("\n" + "━".repeat(50))
        console.log("📊 下载完成统计：")
        console.log(`  ✅ 成功：${downloadedFiles.length} 张`)
        console.log(`  ❌ 失败：${errors.length} 张`)
        console.log(`  📁 位置：${params.output}`)

        // 显示所有下载的图片路径
        if (downloadedFiles.length > 0) {
            console.log("\n📝 下载的图片：")
            downloadedFiles.forEach((filepath, index) => {
                console.log(`  ${index + 1}. ${filepath}`)
            })
        }

        if (errors.length > 0) {
            console.log("\n⚠️  下载失败的图片：")
            errors.forEach(({ photo, error }) => {
                console.log(`  - ${photo.id}: ${error}`)
            })
        }

        console.log("\n✨ 所有操作完成！\n")
    } catch (error) {
        console.error("\n❌ 发生错误：")
        console.error(error.message)
        console.error("\n请检查：")
        console.error("  1. API Key 是否正确配置")
        console.error("  2. 网络连接是否正常")
        console.error("  3. API 配额是否充足")
        console.error("")
        process.exit(1)
    }
}

// 运行主流程
main()
