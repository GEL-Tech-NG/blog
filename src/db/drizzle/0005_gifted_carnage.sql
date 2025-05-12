ALTER TABLE `SiteSettings` ADD `description` text;--> statement-breakpoint
ALTER TABLE `SiteSettings` ADD `folder` varchar(255) DEFAULT 'misc' NOT NULL;