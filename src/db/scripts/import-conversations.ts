/**
 * 会话导入脚本
 *
 * 从 JSON 文件导入 AI 会话原始记录到 conversations 表。
 *
 * 用法：
 *   bun run src/db/scripts/import-conversations.ts <path-to-json> [--skip-existing] [--max-length=120]
 *
 * JSON 文件内容可以是：
 *   - 一个对象数组：[ { id, userId, ... }, ... ]
 *   - 或一个包含 records 字段的对象：{ "records": [ ... ] }
 */
import { readFileSync } from 'fs';
import { db, closeDatabase, Conversations } from '../index';

interface CliOptions {
	skipExisting: boolean;
	maxLength: number;
}

function parseArgs(argv: string[]): { filePath?: string; options: CliOptions } {
	const options: CliOptions = { skipExisting: false, maxLength: 120 };
	let filePath: string | undefined;

	for (const arg of argv) {
		if (arg === '--skip-existing') {
			options.skipExisting = true;
		} else if (arg.startsWith('--max-length=')) {
			const value = Number(arg.split('=')[1]);
			if (Number.isFinite(value) && value > 0) options.maxLength = value;
		} else if (!arg.startsWith('--')) {
			filePath = arg;
		}
	}

	return { filePath, options };
}

function loadRecords(filePath: string): Record<string, any>[] {
	const raw = readFileSync(filePath, 'utf-8');
	const parsed = JSON.parse(raw);

	if (Array.isArray(parsed)) return parsed;
	if (parsed && Array.isArray(parsed.records)) return parsed.records;
	throw new Error('JSON 文件必须是一个数组，或包含 records 数组的对象');
}

async function main() {
	const { filePath, options } = parseArgs(process.argv.slice(2));

	if (!filePath) {
		console.error('❌ 请提供 JSON 文件路径');
		console.error(
			'用法: bun run src/db/scripts/import-conversations.ts <path-to-json> [--skip-existing] [--max-length=120]'
		);
		process.exit(1);
	}

	console.log(`📂 读取文件: ${filePath}`);
	const records = loadRecords(filePath);
	console.log(`📥 解析到 ${records.length} 条记录`);

	const result = await Conversations.importFromRecords(records, {
		skipExisting: options.skipExisting,
		maxLength: options.maxLength,
	});

	console.log('✅ 导入完成:');
	console.log(`   新增: ${result.inserted}`);
	console.log(`   更新: ${result.updated}`);
	console.log(`   丢弃: ${result.dropped}`);
	if (result.errors.length > 0) {
		console.log('⚠️  错误/丢弃详情:');
		for (const err of result.errors.slice(0, 20)) {
			console.log(`   - [${err.id ?? '无 id'}] ${err.reason}`);
		}
		if (result.errors.length > 20) {
			console.log(`   ... 其余 ${result.errors.length - 20} 条省略`);
		}
	}
}

if (import.meta.main) {
	main()
		.then(() => {
			closeDatabase();
			process.exit(0);
		})
		.catch((error) => {
			console.error('💥 导入失败:', error);
			closeDatabase();
			process.exit(1);
		});
}

export { loadRecords, parseArgs };
