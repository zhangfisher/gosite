import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

/**
 * 配置表
 *
 * 用于保存每个用户的配置数据，其中 admin 用户的配置即整个应用的配置。
 * settings 字段以 JSON 字符串形式存储。
 */
export const settings = sqliteTable("settings", {
	// 主键（短随机ID）
	id: text("id").primaryKey().$defaultFn(() => nanoid()),

	// 用户标识（admin 即超级管理员，其配置等同于应用全局配置）
	userId: text("user_id").notNull().unique(),

	// 配置内容（JSON 字符串）
	settings: text("settings").notNull(),

	// 创建时间
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),

	// 更新时间
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export type SettingsRow = typeof settings.$inferSelect;
export type NewSettingsRow = typeof settings.$inferInsert;
