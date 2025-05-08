CREATE TABLE `UserMeta` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`is_pro_member` boolean DEFAULT false,
	`last_login` timestamp DEFAULT CURRENT_TIMESTAMP,
	`last_login_ip` varchar(50),
	`last_login_location` varchar(255),
	`last_login_device` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `UserMeta_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `NewsLetterSubscribers` DROP INDEX `status_index`;--> statement-breakpoint
ALTER TABLE `NewsLetterSubscribers` DROP INDEX `verification_status_index`;--> statement-breakpoint
ALTER TABLE `Categories` DROP INDEX `slug_unique_index`;--> statement-breakpoint
ALTER TABLE `Posts` DROP INDEX `slug_unique_index`;--> statement-breakpoint
ALTER TABLE `Tags` DROP INDEX `slug_unique_index`;--> statement-breakpoint
DROP INDEX `name_index` ON `Categories`;--> statement-breakpoint
DROP INDEX `name_index` ON `Tags`;--> statement-breakpoint
ALTER TABLE `EmailEvents` MODIFY COLUMN `event_type` enum('sent','delivered','delivery_delayed','bounced','complained','opened','clicked') NOT NULL;--> statement-breakpoint
ALTER TABLE `NewsLetterSubscribers` MODIFY COLUMN `status` enum('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed';--> statement-breakpoint
ALTER TABLE `NewsLetterSubscribers` MODIFY COLUMN `verification_status` enum('verified','unverified') NOT NULL DEFAULT 'unverified';--> statement-breakpoint
ALTER TABLE `PostViewAnalytics` MODIFY COLUMN `session_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Posts` drop column `published_at`;--> statement-breakpoint
ALTER TABLE `Posts` ADD `published_at` timestamp GENERATED ALWAYS AS ((CASE WHEN status = 'published' THEN updated_at ELSE NULL END)) STORED;--> statement-breakpoint
ALTER TABLE `Posts` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `NewsLetters` ADD CONSTRAINT `content_id_index` UNIQUE(`content_id`);--> statement-breakpoint
ALTER TABLE `Categories` ADD CONSTRAINT `idx_slug` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `Posts` ADD CONSTRAINT `idx_slug` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `Tags` ADD CONSTRAINT `idx_slug` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `SiteSettings` ADD `can_encrypt` boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX `user_meta_user_id_idx` ON `UserMeta` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `ContactMessages` (`email`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `ContactMessages` (`name`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `ContactMessages` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_media_name` ON `Medias` (`name`);--> statement-breakpoint
CREATE INDEX `idx_media_type` ON `Medias` (`type`);--> statement-breakpoint
CREATE INDEX `idx_media_folder` ON `Medias` (`folder`);--> statement-breakpoint
CREATE INDEX `idx_media_created_at` ON `Medias` (`created_at`);--> statement-breakpoint
CREATE INDEX `email_id_index` ON `EmailEvents` (`email_id`);--> statement-breakpoint
CREATE INDEX `newsletter_id_index` ON `EmailEvents` (`newsletter_id`);--> statement-breakpoint
CREATE INDEX `subscriber_id_index` ON `EmailEvents` (`subscriber_id`);--> statement-breakpoint
CREATE INDEX `event_type_index` ON `EmailEvents` (`event_type`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `EmailEvents` (`created_at`);--> statement-breakpoint
CREATE INDEX `newsletter_id_index` ON `NewsLetterRecipients` (`newsletter_id`);--> statement-breakpoint
CREATE INDEX `subscriber_id_index` ON `NewsLetterRecipients` (`subscriber_id`);--> statement-breakpoint
CREATE INDEX `sent_at_index` ON `NewsLetterRecipients` (`sent_at`);--> statement-breakpoint
CREATE INDEX `status_index` ON `NewsLetterSubscribers` (`status`);--> statement-breakpoint
CREATE INDEX `verification_status_index` ON `NewsLetterSubscribers` (`verification_status`);--> statement-breakpoint
CREATE INDEX `created_at_index` ON `NewsLetterSubscribers` (`created_at`);--> statement-breakpoint
CREATE INDEX `status_index` ON `NewsLetters` (`status`);--> statement-breakpoint
CREATE INDEX `scheduled_for_index` ON `NewsLetters` (`scheduled_for`);--> statement-breakpoint
CREATE INDEX `sent_at_index` ON `NewsLetters` (`sent_at`);--> statement-breakpoint
CREATE INDEX `idx_active_viewers_post_id` ON `ActivePostViewers` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_active_viewers_user_id` ON `ActivePostViewers` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_active_viewers_session_id` ON `ActivePostViewers` (`session_id`);--> statement-breakpoint
CREATE INDEX `idx_active_viewers_last_active` ON `ActivePostViewers` (`last_active`);--> statement-breakpoint
CREATE INDEX `idx_analytics_post_id` ON `PostViewAnalytics` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_analytics_user_id` ON `PostViewAnalytics` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_analytics_created_at` ON `PostViewAnalytics` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_country` ON `PostViewAnalytics` (`country`);--> statement-breakpoint
CREATE INDEX `idx_post_views_post_id` ON `PostViews` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_views_user_id` ON `PostViews` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_post_views_viewed_at` ON `PostViews` (`viewed_at`);--> statement-breakpoint
CREATE INDEX `idx_post_reactions_post_id` ON `PostReactions` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_reactions_user_id` ON `PostReactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_post_reactions_reaction_type_id` ON `PostReactions` (`reaction_type_id`);--> statement-breakpoint
CREATE INDEX `idx_post_shares_post_id` ON `PostShares` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_shares_user_id` ON `PostShares` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_post_shares_share_type` ON `PostShares` (`share_type`);--> statement-breakpoint
CREATE INDEX `idx_reaction_type_name` ON `ReactionTypes` (`name`);--> statement-breakpoint
CREATE INDEX `idx_reaction_type_order` ON `ReactionTypes` (`order`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `Categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_post_id` ON `Comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_author_id` ON `Comments` (`author_id`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `Comments` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_post_id` ON `PostSeoMeta` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_tag` ON `PostTags` (`post_id`,`tag_id`);--> statement-breakpoint
CREATE INDEX `idx_author` ON `Posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `idx_category` ON `Posts` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `Posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_published_at` ON `Posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_comment_id` ON `Replies` (`comment_id`);--> statement-breakpoint
CREATE INDEX `idx_author_id` ON `Replies` (`author_id`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `Replies` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_name` ON `Tags` (`name`);--> statement-breakpoint
CREATE INDEX `idx_encrypted` ON `SiteSettings` (`encrypted`);--> statement-breakpoint
CREATE INDEX `idx_enabled` ON `SiteSettings` (`enabled`);--> statement-breakpoint
CREATE INDEX `idx_can_encrypt` ON `SiteSettings` (`can_encrypt`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `SiteSettings` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_updated_at` ON `SiteSettings` (`updated_at`);--> statement-breakpoint
CREATE INDEX `role_permission_idx` ON `RolePermissions` (`role_id`,`permission_id`);--> statement-breakpoint
CREATE INDEX `user_role_idx` ON `UserRoles` (`user_id`,`role_id`);--> statement-breakpoint
CREATE INDEX `user_socials_user_id_idx` ON `UserSocials` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `Users` (`email`);--> statement-breakpoint
CREATE INDEX `username_idx` ON `Users` (`username`);--> statement-breakpoint
CREATE INDEX `auth_id_idx` ON `Users` (`auth_id`);--> statement-breakpoint
CREATE INDEX `role_id_idx` ON `Users` (`role_id`);