ALTER TABLE `PostSeoMeta` ADD `image` varchar(255);--> statement-breakpoint
ALTER TABLE `PostSeoMeta` ADD `keywords` varchar(255);--> statement-breakpoint
ALTER TABLE `PostSeoMeta` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `PostSeoMeta` ADD `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;