import { Database } from "bun:sqlite";
import { join } from "path";

const db = new Database(join(process.cwd(), "data", "data.db"));
db.run("PRAGMA foreign_keys = ON");

// 先删除旧表（含外键依赖），保证可重复执行
db.run("DROP TABLE IF EXISTS session");
db.run("DROP TABLE IF EXISTS account");
db.run("DROP TABLE IF EXISTS verification");
db.run("DROP TABLE IF EXISTS user");

const statements = [
	`CREATE TABLE IF NOT EXISTS user (
		id text PRIMARY KEY,
		name text NOT NULL,
		email text NOT NULL UNIQUE,
		username text NOT NULL UNIQUE,
		emailVerified integer NOT NULL DEFAULT 0,
		image text,
		createdAt integer NOT NULL,
		updatedAt integer NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS session (
		id text PRIMARY KEY,
		expiresAt integer NOT NULL,
		token text NOT NULL UNIQUE,
		createdAt integer NOT NULL,
		updatedAt integer NOT NULL,
		ipAddress text,
		userAgent text,
		userId text NOT NULL REFERENCES user(id) ON DELETE CASCADE
	)`,
	`CREATE TABLE IF NOT EXISTS account (
		id text PRIMARY KEY,
		issuer text NOT NULL,
		accountId text NOT NULL,
		providerId text NOT NULL,
		userId text NOT NULL REFERENCES user(id) ON DELETE CASCADE,
		accessToken text,
		refreshToken text,
		idToken text,
		accessTokenExpiresAt integer,
		refreshTokenExpiresAt integer,
		scope text,
		password text,
		createdAt integer NOT NULL,
		updatedAt integer NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS verification (
		id text PRIMARY KEY,
		identifier text NOT NULL,
		value text NOT NULL,
		expiresAt integer NOT NULL,
		createdAt integer NOT NULL,
		updatedAt integer NOT NULL
	)`,
];

for (const s of statements) {
	db.run(s);
}

const tables = db
	.query(
		"SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user','session','account','verification')",
	)
	.all();
console.log("created tables:", tables.map((t: any) => t.name).join(", "));
db.close();
