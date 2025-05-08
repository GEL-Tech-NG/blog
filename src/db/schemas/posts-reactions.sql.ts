import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  boolean,
  unique,
  index,
} from "drizzle-orm/mysql-core";
import { id, created_at, updated_at } from "../schema-helper";

export const reactionTypes = mysqlTable(
  "ReactionTypes",
  {
    id,
    name: varchar("name", { length: 50 }).notNull().unique(),
    display_name: varchar("display_name", { length: 50 }).notNull(),
    emoji: varchar("emoji", { length: 10 }),
    order: int("order").default(0),
    is_active: boolean("is_active").default(true),
    allow_multiple: boolean("allow_multiple").default(true),
    created_at,
  },
  (table) => ({
    nameIndex: index("idx_reaction_type_name").on(table.name),
    orderIndex: index("idx_reaction_type_order").on(table.order),
  })
);

export const postReactions = mysqlTable(
  "PostReactions",
  {
    id,
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    reaction_type_id: int("reaction_type_id").notNull(),
    created_at,
    updated_at,
  },
  (table) => ({
    uniqReaction: unique().on(
      table.post_id,
      table.user_id,
      table.reaction_type_id
    ),
    postIdIndex: index("idx_post_reactions_post_id").on(table.post_id),
    userIdIndex: index("idx_post_reactions_user_id").on(table.user_id),
    reactionTypeIdIndex: index("idx_post_reactions_reaction_type_id").on(
      table.reaction_type_id
    ),
  })
);

export const postShares = mysqlTable(
  "PostShares",
  {
    id,
    post_id: int("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    share_type: varchar("share_type", {
      length: 50,
      enum: ["facebook", "email", "whatsapp", "twitter", "link"],
    }).notNull(),
    share_url: varchar("share_url", { length: 255 }),
    created_at,
  },
  (table) => ({
    postIdIndex: index("idx_post_shares_post_id").on(table.post_id),
    userIdIndex: index("idx_post_shares_user_id").on(table.user_id),
    shareTypeIndex: index("idx_post_shares_share_type").on(table.share_type),
  })
);
