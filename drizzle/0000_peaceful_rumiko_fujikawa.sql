CREATE TABLE `contents` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`level` integer NOT NULL,
	`left` integer NOT NULL,
	`right` integer NOT NULL,
	`description` text,
	`keywords` text,
	`url` text,
	`icon` text,
	`cover` text,
	`images` text,
	`content` text,
	`source` text,
	`stars` integer DEFAULT 0 NOT NULL,
	`type` integer DEFAULT 0 NOT NULL,
	`tags` text,
	`video` text,
	`ref` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`ref`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `contents_i18n` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`html` text,
	`tags` text,
	FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
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
	`prompt` text,
	`click` integer DEFAULT 0 NOT NULL,
	`languages` text,
	`header` text,
	`footer` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sites_name_unique` ON `sites` (`name`);--> statement-breakpoint
CREATE TABLE `sites_i18n` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` text NOT NULL,
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
	`header` text,
	`footer` text,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` text NOT NULL,
	`content_id` integer,
	`name` text,
	`title` text,
	`is_menu` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT 1 NOT NULL,
	`is_auth` integer DEFAULT 0 NOT NULL,
	`prompt` text,
	`html` text,
	`layout` text,
	`click` integer DEFAULT 0 NOT NULL,
	`left_value` integer NOT NULL,
	`right_value` integer NOT NULL,
	`level` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `site_contents_i18n` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_content_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text,
	`html` text,
	FOREIGN KEY (`site_content_id`) REFERENCES `site_contents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_contents_i18n_unique` ON `site_contents_i18n` (`site_content_id`,`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `site_contents_i18n_site_content_id_index` ON `site_contents_i18n` (`site_content_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `site_contents_i18n_language_index` ON `site_contents_i18n` (`language`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`preview` text,
	`last_message_at` integer,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`message_count` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`issuer` text NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`emailVerified` integer DEFAULT false NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
