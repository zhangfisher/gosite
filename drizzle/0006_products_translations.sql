-- 创建产品翻译表
-- 用于存储产品的多语言翻译内容
CREATE TABLE `products_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`html` text,
	`tags` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
);

-- 为 products 表添加 html 字段
ALTER TABLE `products` ADD COLUMN `html` text;

-- 创建索引以提高查询性能
CREATE INDEX `products_translations_product_id_index` ON `products_translations`(`product_id`);
CREATE INDEX `products_translations_language_index` ON `products_translations`(`language`);
CREATE UNIQUE INDEX `products_translations_product_language_unique` ON `products_translations`(`product_id`, `language`);
