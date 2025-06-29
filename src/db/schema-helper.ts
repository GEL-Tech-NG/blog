import { int, timestamp } from "drizzle-orm/mysql-core";

export const id = int("id").autoincrement().primaryKey();
export const created_at = timestamp("created_at").defaultNow();
export const updated_at = timestamp("updated_at").defaultNow().onUpdateNow();
export const deleted_at = timestamp("deleted_at");
export const settingsFolderEnum = [
  "general",
  "analytics",
  "monitoring",
  "media",
  "email",
  "advanced",
  "social",
  "misc",
] as const;
export type SettingsFolderEnum = (typeof settingsFolderEnum)[number];
export const permissionsEnum = [
  "dashboard:access",
  "posts:create",
  "posts:edit",
  "posts:delete",
  "posts:publish",
  "posts:read",
  "posts:schedule",
  "posts:review",
  "posts:view",
  "users:read",
  "users:write",
  "users:edit",
  "users:delete",
  "roles:read",
  "roles:write",
  "roles:delete",
  "media:upload",
  "media:read",
  "media:delete",
  "media:edit",
  "settings:read",
  "settings:write",
  "comments:create",
  "comments:moderate",
  "comments:read",
  "comments:delete",
  "comments:reply",
  "newsletters:read",
  "newsletters:write",
  "newsletters:delete",
  "auth:register",
  "auth:login",
  "categories:create",
  "categories:read",
  "tags:read",
  "tags:create",
  "pages:read",
  "pages:edit",
  "pages:delete",
  "pages:write",
  "seo:edit",
  "seo:view",
  "analytics:view",
  "analytics:export",
] as const;
export type PermissionsEnum = (typeof permissionsEnum)[number];
export const rolesEnum = [
  "admin",
  "editor",
  "author",
  "contributor",
  "moderator",
  "seo_manager",
  "newsletter_manager",
  "subscriber",
  "public",
] as const;
export type RolesEnum = (typeof rolesEnum)[number];
export const emailEventsEnum = [
  "sent",
  "delivered",
  "delivery_delayed",
  "bounced",
  "complained",
  "opened",
  "clicked",
] as const;
export type EmailsEventsEnum = (typeof emailEventsEnum)[number];
