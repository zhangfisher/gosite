import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Better Auth 表结构（camelCase 字段名，与 better-auth 通用模型一致）
 *
 * 通过 drizzleAdapter 接入，字段命名遵循 better-auth 默认约定，
 * 因此无需额外声明字段映射（fields）。
 */

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	username: text("username").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" })
		.notNull()
		.default(false),
	image: text("image"),
	// admin 插件字段
	role: text("role").notNull().default("user"),
	banned: integer("banned", { mode: "boolean" })
		.notNull()
		.default(false),
	banReason: text("banReason"),
	banExpires: integer("banExpires", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updatedAt", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	// admin 插件字段（用于 impersonation 审计）
	impersonatedBy: text("impersonatedBy"),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	issuer: text("issuer").notNull(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(
		() => new Date(),
	),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(
		() => new Date(),
	),
});
