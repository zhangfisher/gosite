-- 为 products 表添加 stars, tags, video 字段
ALTER TABLE `products` ADD COLUMN `stars` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `tags` text;--> statement-breakpoint
ALTER TABLE `products` ADD COLUMN `video` text;--> statement-breakpoint

-- 为 product_categories 表添加 stars, tags, video 字段
ALTER TABLE `product_categories` ADD COLUMN `stars` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `product_categories` ADD COLUMN `tags` text;--> statement-breakpoint
ALTER TABLE `product_categories` ADD COLUMN `video` text;
