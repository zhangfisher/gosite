import type { DrizzleDb } from '@/db';
import { conversations } from '../schema';
import type { Conversation, NewConversation } from '../schema';
import { eq, desc, sql } from 'drizzle-orm';

/**
 * 单条原始会话记录的宽松类型（来自外部导入，字段不固定）
 */
export type RawConversationRecord = Record<string, any>;

/**
 * 导入结果统计
 */
export interface ImportResult {
	inserted: number;
	updated: number;
	dropped: number;
	errors: { id?: string; reason: string }[];
}

/**
 * 导入选项
 */
export interface ImportOptions {
	// 标题/预览截断长度
	maxLength?: number;
	// 是否跳过已有的会话（默认 false，即按 id upsert 更新）
	skipExisting?: boolean;
}

/**
 * 从消息对象/字符串中提取文本内容
 */
function extractMessageText(message: any): string {
	if (message == null) return '';
	if (typeof message === 'string') return message;
	if (typeof message === 'object') {
		const candidate =
			message.content ??
			message.text ??
			message.body ??
			message.message ??
			'';
		if (typeof candidate === 'string') return candidate;
		// content 可能是 [{type, text}] 这类结构
		if (Array.isArray(candidate)) {
			return candidate
				.map((part: any) => (typeof part === 'string' ? part : part?.text ?? ''))
				.join('');
		}
	}
	return '';
}

/**
 * 取首条消息文本（用于标题/预览生成）
 */
function extractFirstMessageText(record: RawConversationRecord): string {
	const messages = record.messages;
	if (Array.isArray(messages)) {
		for (const message of messages) {
			const text = extractMessageText(message).trim();
			if (text) return text;
		}
	}
	return '';
}

/**
 * 多字段回退：返回第一个非 null/非 undefined/非空字符串的值
 */
function pickFirst(...values: any[]): any {
	for (const value of values) {
		if (value !== undefined && value !== null && value !== '') return value;
	}
	return undefined;
}

/**
 * 将任意值规范为毫秒时间戳（数字）
 * - 数字：若小于 1e12 视为秒，自动 ×1000
 * - 可解析的日期字符串 / Date：转为毫秒
 * - 无法解析：返回 undefined
 */
function coerceMs(value: any): number | undefined {
	if (value == null || value === '') return undefined;
	if (value instanceof Date) return value.getTime();
	if (typeof value === 'number') {
		if (!Number.isFinite(value)) return undefined;
		return value < 1e12 ? value * 1000 : value;
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		// 纯数字字符串
		if (/^\d+(\.\d+)?$/.test(trimmed)) {
			const num = Number(trimmed);
			return num < 1e12 ? num * 1000 : num;
		}
		const parsed = Date.parse(trimmed);
		if (!Number.isNaN(parsed)) return parsed;
	}
	return undefined;
}

/**
 * 截断文本
 */
function truncate(text: string, maxLength: number): string {
	if (!text) return text;
	return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

/**
 * AI 会话 CRUD + 导入管理器
 */
export function getConversations(db: DrizzleDb) {
	return {
		/**
		 * 创建新会话
		 */
		async create(conversation: NewConversation): Promise<Conversation> {
			const [created] = await db.insert(conversations).values(conversation).returning();
			return created;
		},

		/**
		 * 根据 ID 查找会话
		 */
		async findById(id: string): Promise<Conversation | null> {
			const [conversation] = await db
				.select()
				.from(conversations)
				.where(eq(conversations.id, id))
				.limit(1);
			return conversation || null;
		},

		/**
		 * 根据用户 ID 查找会话
		 */
		async findByUserId(
			userId: string,
			options?: { limit?: number; offset?: number }
		): Promise<Conversation[]> {
			const { limit, offset } = options || {};
			const orderBy = desc(conversations.lastMessageAt);
			let query: any = db
				.select()
				.from(conversations)
				.where(eq(conversations.userId, userId))
				.orderBy(orderBy);
			if (limit !== undefined) query = query.limit(limit);
			if (offset !== undefined) query = query.offset(offset);
			return query;
		},

		/**
		 * 列出会话（默认按最后消息时间倒序）
		 */
		async findAll(options?: {
			limit?: number;
			offset?: number;
			orderBy?: 'asc' | 'desc';
		}): Promise<Conversation[]> {
			const { limit, offset, orderBy = 'desc' } = options || {};
			const orderByClause =
				orderBy === 'asc'
					? conversations.lastMessageAt
					: desc(conversations.lastMessageAt);

			let query: any = db.select().from(conversations).orderBy(orderByClause);
			if (limit !== undefined) query = query.limit(limit);
			if (offset !== undefined) query = query.offset(offset);
			return query;
		},

		/**
		 * 更新会话
		 */
		async update(id: string, data: Partial<NewConversation>): Promise<Conversation | null> {
			const [updated] = await db
				.update(conversations)
				.set({ ...data, updatedAt: Date.now() })
				.where(eq(conversations.id, id))
				.returning();
			return updated || null;
		},

		/**
		 * 删除会话
		 */
		async delete(id: string): Promise<boolean> {
			const result = await db
				.delete(conversations)
				.where(eq(conversations.id, id))
				.returning();
			return result.length > 0;
		},

		/**
		 * 统计会话总数（可按用户过滤）
		 */
		async count(userId?: string): Promise<number> {
			const result = await db
				.select({ count: sql<number>`count(*)` })
				.from(conversations)
				.where(userId ? eq(conversations.userId, userId) : undefined);
			return Number(result[0]?.count || 0);
		},

		/**
		 * 从原始记录数组导入会话
		 *
		 * 规则：
		 * - id 缺失/为空 → 丢弃
		 * - userId 缺失/为空 → 丢弃
		 * - title：记录 title → 首条消息文本 → preview 片段 → '未命名会话'
		 * - preview：preview → lastMessage → snippet → summary → 首条消息文本 → ''
		 * - lastMessageAt：lastMessageAt/updatedAt/timestamp/lastActivityAt 多字段回退，统一为毫秒
		 * - createdAt：createdAt → lastMessageAt → 当前时间
		 * - messageCount：messageCount → messages 数组长度 → 0
		 * - 按 id 幂等 upsert（已存在则更新）
		 *
		 * @returns 导入统计
		 */
		async importFromRecords(
			records: RawConversationRecord[],
			options?: ImportOptions
		): Promise<ImportResult> {
			const maxLength = options?.maxLength ?? 120;
			const skipExisting = options?.skipExisting ?? false;
			const result: ImportResult = { inserted: 0, updated: 0, dropped: 0, errors: [] };

			for (const record of records || []) {
				try {
					const id = record?.id;
					if (id === undefined || id === null || id === '') {
						result.dropped++;
						result.errors.push({ reason: '缺少必需字段 id' });
						continue;
					}

					const userId = pickFirst(record.userId, record.user_id);
					if (userId === undefined || userId === '') {
						result.dropped++;
						result.errors.push({ id: String(id), reason: '缺少必需字段 userId' });
						continue;
					}

					const firstMessageText = extractFirstMessageText(record);
					const previewSource = pickFirst(
						record.preview,
						record.lastMessage,
						record.snippet,
						record.summary,
						firstMessageText
					);
					const titleSource = pickFirst(
						record.title,
						firstMessageText,
						previewSource
					);

					const lastMessageAt = coerceMs(
						pickFirst(
							record.lastMessageAt,
							record.last_message_at,
							record.updatedAt,
							record.timestamp,
							record.lastActivityAt
						)
					);
					const createdAt = coerceMs(
						pickFirst(record.createdAt, record.created_at, lastMessageAt)
					);

					let messageCount = 0;
					const explicitCount = pickFirst(record.messageCount, record.message_count);
					if (typeof explicitCount === 'number' && Number.isFinite(explicitCount)) {
						messageCount = explicitCount;
					} else if (Array.isArray(record.messages)) {
						messageCount = record.messages.length;
					}

					const value: NewConversation = {
						id: String(id),
						title: titleSource ? truncate(String(titleSource), maxLength) : '未命名会话',
						preview: previewSource ? truncate(String(previewSource), maxLength) : null,
						lastMessageAt: lastMessageAt ?? null,
						createdAt: createdAt ?? Date.now(),
						userId: String(userId),
						messageCount,
						updatedAt: Date.now(),
					};

					const existed = (await this.findById(value.id)) !== null;
					if (skipExisting && existed) {
						result.dropped++;
						continue;
					}

					await db
						.insert(conversations)
						.values(value)
						.onConflictDoUpdate({
							target: conversations.id,
							set: {
								title: value.title,
								preview: value.preview,
								lastMessageAt: value.lastMessageAt,
								createdAt: value.createdAt,
								userId: value.userId,
								messageCount: value.messageCount,
								updatedAt: value.updatedAt,
							},
						});

					if (existed) result.updated++;
					else result.inserted++;
				} catch (error) {
					result.dropped++;
					result.errors.push({
						id: record?.id !== undefined ? String(record.id) : undefined,
						reason: error instanceof Error ? error.message : String(error),
					});
				}
			}

			return result;
		},
	};
}
