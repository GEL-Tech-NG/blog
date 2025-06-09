ALTER TABLE `Posts` ADD `generate_toc` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `Posts` ADD `toc_depth` int DEFAULT 2;--> statement-breakpoint
ALTER TABLE `Posts` ADD `toc` json;