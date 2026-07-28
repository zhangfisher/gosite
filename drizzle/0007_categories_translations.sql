-- 创建产品分类翻译表
-- 用于存储产品分类的多语言翻译内容
CREATE TABLE `product_categories_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_category_id` integer NOT NULL,
	`language` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`tags` text,
	FOREIGN KEY (`product_category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX `product_categories_translations_product_category_id_index` ON `product_categories_translations`(`product_category_id`);
CREATE INDEX `product_categories_translations_language_index` ON `product_categories_translations`(`language`);
CREATE UNIQUE INDEX `product_categories_translations_category_language_unique` ON `product_categories_translations`(`product_category_id`, `language`);
