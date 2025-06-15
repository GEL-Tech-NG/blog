DROP INDEX `idx_post_id` ON `PostSeoMeta`;--> statement-breakpoint
ALTER TABLE `PostSeoMeta` ADD CONSTRAINT `PostSeoMeta_post_id_unique` UNIQUE(`post_id`);--> statement-breakpoint
ALTER TABLE `PostSeoMeta` ADD CONSTRAINT `idx_post_id` UNIQUE(`post_id`);