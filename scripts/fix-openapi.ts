import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// NRF 在 Windows 下生成 openapi.json 时，getRouteName 会在将反斜杠规范为
// 正斜杠之前就尝试剥离 "/route.ts"，导致 App Router 路径变成
// "/api/version/route.ts" 而非 "/api/version"。这里对路径 key 做修正：
// 先把反斜杠统一为正斜杠，再去掉末尾的 /route.(ts|js)。
const target = process.argv[2] ?? join(process.cwd(), 'public', 'api', 'openapi.json');

const spec = JSON.parse(readFileSync(target, 'utf-8'));

if (spec.paths) {
  const fixed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(spec.paths)) {
    const normalized = key.replace(/\\/g, '/').replace(/\/route\.(ts|js)$/, '');
    fixed[normalized] = value;
  }
  spec.paths = fixed;
  writeFileSync(target, JSON.stringify(spec, null, 2) + '\n');
  console.info(`Fixed OpenAPI paths in ${target}`);
} else {
  console.info('No paths found, nothing to fix.');
}

// ---------------------------------------------------------------------------
// 注入无法通过 next-rest-framework 自动生成的端点（运行时限制）：
//  - /api/upload：tus 协议原始流，由普通 route handler 暴露
//  - /api/ai/chat、/api/ai/request：SSE 流式响应（better-auth/AI 例外）
// 这些端点按 CLAUDE.md 的「API 集成约定」在此手动补文档，并打上对应 tag。
// ---------------------------------------------------------------------------

const sseResponse = {
  description: 'Server-Sent Events 流式响应',
  content: { 'text/event-stream': { schema: { type: 'string' } } },
};

const uploadTag = ['Upload'];
const aiTag = ['AI'];

spec.paths['/api/upload'] = {
  ...(spec.paths['/api/upload'] ?? {}),
  options: {
    tags: uploadTag,
    summary: 'tus 预检（CORS/能力协商）',
    operationId: 'uploadOptions',
    responses: { 204: { description: 'OK' } },
  },
  post: {
    tags: uploadTag,
    summary: '创建上传（tus CREATION）',
    operationId: 'uploadCreate',
    responses: {
      201: {
        description: '已创建上传位置',
        headers: { Location: { schema: { type: 'string' } } },
      },
    },
  },
};

spec.paths['/api/upload/{path}'] = {
  ...(spec.paths['/api/upload/{path}'] ?? {}),
  parameters: [
    {
      name: 'path',
      in: 'path',
      required: true,
      description: '文件 id（含相对路径，如 contents/5/files/<hex>）',
      schema: { type: 'string' },
    },
  ],
  head: {
    tags: uploadTag,
    summary: '查询上传进度（tus）',
    operationId: 'uploadHead',
    responses: {
      200: { description: '上传偏移量', headers: { 'Upload-Offset': { schema: { type: 'integer' } } } },
      404: { description: '未找到上传' },
    },
  },
  patch: {
    tags: uploadTag,
    summary: '续传数据（tus PATCH）',
    operationId: 'uploadPatch',
    responses: {
      204: { description: '已接收分片' },
      403: { description: '校验失败' },
    },
  },
  delete: {
    tags: uploadTag,
    summary: '取消上传（tus）',
    operationId: 'uploadDelete',
    responses: { 204: { description: '已删除' }, 404: { description: '未找到' } },
  },
};

spec.paths['/api/ai/chat'] = {
  post: {
    tags: aiTag,
    summary: 'AI 对话（SSE 流式）',
    operationId: 'aiChat',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              conversationId: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['message'],
          },
        },
      },
    },
    responses: { 200: sseResponse, 401: { description: '未授权' } },
  },
};

spec.paths['/api/ai/request'] = {
  post: {
    tags: aiTag,
    summary: 'AI 请求（SSE 流式，原始协议）',
    operationId: 'aiRequestPost',
    responses: { 200: sseResponse, 401: { description: '未授权' } },
  },
  get: {
    tags: aiTag,
    summary: 'AI 请求（SSE 流式，GET 轮询/订阅）',
    operationId: 'aiRequestGet',
    responses: { 200: sseResponse, 401: { description: '未授权' } },
  },
};

writeFileSync(target, JSON.stringify(spec, null, 2) + '\n');
console.info('Injected /api/upload (tus) and /api/ai/chat, /api/ai/request (SSE) paths into OpenAPI.');
