/**
 * DB 版 claude-agent-sdk SessionStore
 *
 * 将每个 agent 会话的 JSONL 转录条目以 JSON 数组形式持久化到
 * `conversation_transcripts` 表，从而实现跨进程 / 跨重启的 resume。
 *
 * 设计要点：
 * - `append` 在 SDK 子进程本地写入成功后调用，按 sessionId 追加条目（以 uuid 做幂等）。
 * - `load` 在 resume 时被调用一次，返回此前持久化的条目（从无则 null）。
 * - `listSessions` / `delete` 供会话列表与删除使用。
 */
import type {
	SessionKey,
	SessionStore,
	SessionStoreEntry,
} from "@anthropic-ai/claude-agent-sdk";
import { db } from "@/db";
import { conversationTranscripts } from "@/db/schema";
import { eq } from "drizzle-orm";

export class DbSessionStore implements SessionStore {
	async append(
		key: SessionKey,
		entries: SessionStoreEntry[],
	): Promise<void> {
		const [row] = await db
			.select()
			.from(conversationTranscripts)
			.where(eq(conversationTranscripts.sessionId, key.sessionId))
			.limit(1);

		const current: SessionStoreEntry[] = row
			? (JSON.parse(row.entries) as SessionStoreEntry[])
			: [];

		// 以 uuid 做幂等：跳过已存在的条目
		const seen = new Set(
			current.filter((e) => e.uuid).map((e) => e.uuid as string),
		);
		for (const entry of entries) {
			if (entry.uuid && seen.has(entry.uuid)) continue;
			current.push(entry);
			if (entry.uuid) seen.add(entry.uuid);
		}

		const payload = JSON.stringify(current);
		if (row) {
			await db
				.update(conversationTranscripts)
				.set({ entries: payload, updatedAt: Date.now() })
				.where(eq(conversationTranscripts.sessionId, key.sessionId));
		} else {
			await db.insert(conversationTranscripts).values({
				sessionId: key.sessionId,
				projectKey: key.projectKey,
				entries: payload,
			});
		}
	}

	async load(key: SessionKey): Promise<SessionStoreEntry[] | null> {
		const [row] = await db
			.select()
			.from(conversationTranscripts)
			.where(eq(conversationTranscripts.sessionId, key.sessionId))
			.limit(1);
		if (!row) return null;
		return JSON.parse(row.entries) as SessionStoreEntry[];
	}

	async listSessions(projectKey: string) {
		const rows = await db
			.select({
				sessionId: conversationTranscripts.sessionId,
				updatedAt: conversationTranscripts.updatedAt,
			})
			.from(conversationTranscripts)
			.where(eq(conversationTranscripts.projectKey, projectKey));
		return rows.map((r) => ({ sessionId: r.sessionId, mtime: r.updatedAt }));
	}

	async delete(key: SessionKey): Promise<void> {
		await db
			.delete(conversationTranscripts)
			.where(eq(conversationTranscripts.sessionId, key.sessionId));
	}
}
