CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`keywords` text NOT NULL,
	`icon` text NOT NULL,
	`images` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
