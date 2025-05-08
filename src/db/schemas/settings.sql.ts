import { sql } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";
import { created_at, updated_at, id } from "../schema-helper";

export const siteSettings = mysqlTable(
  "SiteSettings",
  {
    id,
    key: varchar("key", {
      length: 255,
    }).notNull(),
    value: text("value"),
    encrypted: boolean("encrypted").default(false),
    enabled: boolean("enabled").default(false),
    canEncrypt: boolean("can_encrypt").default(false),
    created_at,
    updated_at,
  },
  (table) => ({
    keyIndex: uniqueIndex("idx_key").on(table.key),
    encryptedIndex: index("idx_encrypted").on(table.encrypted),
    enabledIndex: index("idx_enabled").on(table.enabled),
    canEncryptIndex: index("idx_can_encrypt").on(table.canEncrypt),
    createdAtIndex: index("idx_created_at").on(table.created_at),
    updatedAtIndex: index("idx_updated_at").on(table.updated_at),
  })
);
