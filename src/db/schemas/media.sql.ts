import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/mysql-core";
import { created_at, id, updated_at } from "../schema-helper";

export const medias = mysqlTable(
  "Medias",
  {
    id,
    name: varchar("name", { length: 255 }).notNull(),
    url: text("url").notNull(),
    type: varchar("type", {
      length: 100,
      enum: ["audio", "image", "video", "pdf", "doc"],
    }).notNull(),
    size: int("size").notNull(),
    mime_type: varchar("mime_type", { length: 100 }),
    caption: varchar("caption", { length: 255 }),
    alt_text: varchar("alt_text", { length: 255 }),
    width: int("width"),
    height: int("height"),
    folder: varchar("folder", { length: 255 }),
    created_at,
    updated_at,
  },
  (table) => ({
    nameIndex: index("idx_media_name").on(table.name),
    typeIndex: index("idx_media_type").on(table.type),
    folderIndex: index("idx_media_folder").on(table.folder),
    createdAtIndex: index("idx_media_created_at").on(table.created_at),
  })
);
