-- 修复缺失的 stars 字段
-- 由于 SQLite 限制，需要重新创建表

-- 处理 products 表
CREATE TABLE `products_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`keywords` text NOT NULL,
	`icon` text NOT NULL,
	`images` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`cover` text,
	`tags` text,
	`video` text,
	`stars` integer DEFAULT 0 NOT NULL
);

INSERT INTO `products_new`
SELECT *, 0 as stars FROM `products`;

DROP TABLE `products`;
ALTER TABLE `products_new` RENAME TO `products`;

-- 处理 product_categories 表
CREATE TABLE `product_categories_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`left` integer NOT NULL,
	`right` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`icon` text,
	`cover` text,
	`description` text,
	`tags` text,
	`video` text,
	`stars` integer DEFAULT 0 NOT NULL
);

INSERT INTO `product_categories_new`
SELECT *, 0 as stars FROM `product_categories`;

DROP TABLE `product_categories`;
ALTER TABLE `product_categories_new` RENAME TO `product_categories`;
