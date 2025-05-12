ALTER TABLE `SiteSettings` MODIFY COLUMN `folder` varchar(40) NOT NULL DEFAULT 'misc';--> statement-breakpoint
ALTER TABLE `SiteSettings` ADD `name` varchar(100) NOT NULL;