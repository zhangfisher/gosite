-- 为产品分类表添加 HTML 字段
ALTER TABLE `product_categories` ADD COLUMN `html` text;

-- 为产品分类翻译表添加 HTML 字段
ALTER TABLE `product_categories_translations` ADD COLUMN `html` text;
