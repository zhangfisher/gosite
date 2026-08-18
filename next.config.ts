import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // bun:sqlite 是 Bun 运行时内置模块，Turbopack 不应将其打包进服务端 chunk，
  // 否则在 dev API 路由的 Node worker 中会因无法解析而 500（影响所有数据库相关路由）。
  serverExternalPackages: ["bun:sqlite"],
};

export default nextConfig;
