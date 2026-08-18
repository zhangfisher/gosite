import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// NRF 在 Windows 下生成 openapi.json 时，getRouteName 会在将反斜杠规范为
// 正斜杠之前就尝试剥离 "/route.ts"，导致 App Router 路径变成
// "/api/version/route.ts" 而非 "/api/version"。这里对路径 key 做修正。
const target = process.argv[2] ?? join(process.cwd(), 'public', 'api', 'openapi.json');

const spec = JSON.parse(readFileSync(target, 'utf-8'));

if (spec.paths) {
  const fixed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(spec.paths)) {
    const normalized = key.replace(/\/route\.(ts|js)$/, '');
    fixed[normalized] = value;
  }
  spec.paths = fixed;
  writeFileSync(target, JSON.stringify(spec, null, 2) + '\n');
  console.info(`Fixed OpenAPI paths in ${target}`);
} else {
  console.info('No paths found, nothing to fix.');
}
