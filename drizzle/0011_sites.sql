-- 创建站点表
-- 用于存储多站点的基本信息
CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL UNIQUE,
	`title` text NOT NULL,
	`logo` text,
	`cover` text,
	`description` text,
	`keywords` text,
	`contacts` text,
	`socials` text,
	`copyright` text,
	`privacy_policy` text,
	`cookie_declaration` text,
	`filing` text,
	`languages` text,
	`created_at` integer NOT NULL DEFAULT (strftime('%s', 'now')),
	`updated_at` integer NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- 创建站点翻译表
-- 用于存储站点的多语言翻译内容
CREATE TABLE `sites_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text,
	`keywords` text,
	`description` text,
	`contacts` text,
	`socials` text,
	`copyright` text,
	`privacy_policy` text,
	`cookie_declaration` text,
	`filing` text,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX `sites_name_index` ON `sites`(`name`);
CREATE INDEX `sites_translations_site_id_index` ON `sites_translations`(`site_id`);
CREATE INDEX `sites_translations_language_index` ON `sites_translations`(`language`);
CREATE UNIQUE INDEX `sites_translations_site_language_unique` ON `sites_translations`(`site_id`, `language`);
