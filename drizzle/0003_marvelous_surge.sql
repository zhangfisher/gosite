PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`level` integer NOT NULL,
	`left` integer NOT NULL,
	`right` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`icon` text,
	`cover` text,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "level", "left", "right", "created_at", "updated_at", "icon", "cover", "description") SELECT "id", "name", "level", "left", "right", "created_at", "updated_at", "icon", "cover", "description" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;