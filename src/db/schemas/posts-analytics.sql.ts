import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { posts } from "./posts.sql";
import { users } from "./users.sql";
import { relations, sql } from "drizzle-orm";
import { id, created_at } from "../schema-helper";

export const postViews = mysqlTable(
  "PostViews",
  {
    id,
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }), // Nullable for anonymous views
    ip_address: varchar("ip_address", { length: 45 }), // IPv6 compatible
    user_agent: varchar("user_agent", { length: 255 }),
    referrer: varchar("referrer", { length: 255 }),
    viewed_at: timestamp("viewed_at").defaultNow(),
  },
  (table) => ({
    idx_post_views_session: index("idx_post_views_session").on(
      table.post_id,
      table.user_id,
      table.viewed_at
    ),
    idx_post_views_post_id: index("idx_post_views_post_id").on(table.post_id),
    idx_post_views_user_id: index("idx_post_views_user_id").on(table.user_id),
    idx_post_views_viewed_at: index("idx_post_views_viewed_at").on(
      table.viewed_at
    ),
  })
);

export const postViewAnalytics = mysqlTable(
  "PostViewAnalytics",
  {
    id,
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }),
    session_id: varchar("session_id", { length: 255 }).notNull(),
    device_type: varchar("device_type", { length: 50 }),
    browser: varchar("browser", { length: 50 }),
    os: varchar("os", { length: 50 }),
    country: varchar("country", { length: 2 }),
    region: varchar("region", { length: 100 }),
    city: varchar("city", { length: 100 }),
    time_spent: int("time_spent"),
    scroll_depth: int("scroll_depth"),
    entry_point: varchar("entry_point", { length: 255 }),
    exit_point: varchar("exit_point", { length: 255 }),
    created_at,
  },
  (table) => ({
    idx_analytics_session: index("idx_analytics_session").on(
      table.post_id,
      table.created_at,
      table.session_id
    ),
    idx_analytics_post_id: index("idx_analytics_post_id").on(table.post_id),
    idx_analytics_user_id: index("idx_analytics_user_id").on(table.user_id),
    idx_analytics_created_at: index("idx_analytics_created_at").on(
      table.created_at
    ),
    idx_analytics_country: index("idx_analytics_country").on(table.country),
  })
);

export const activePostViewers = mysqlTable(
  "ActivePostViewers",
  {
    id,
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }),
    session_id: varchar("session_id", { length: 255 }).notNull(),
    last_active: timestamp("last_active").onUpdateNow(),
    created_at,
  },
  (table) => ({
    idx_active_viewers_post_id: index("idx_active_viewers_post_id").on(
      table.post_id
    ),
    idx_active_viewers_user_id: index("idx_active_viewers_user_id").on(
      table.user_id
    ),
    idx_active_viewers_session_id: index("idx_active_viewers_session_id").on(
      table.session_id
    ),
    idx_active_viewers_last_active: index("idx_active_viewers_last_active").on(
      table.last_active
    ),
  })
);

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, {
    fields: [postViews.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postViews.user_id],
    references: [users.auth_id],
  }),
}));
