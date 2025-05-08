import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";
import { created_at, id } from "../schema-helper";

export const contactMessages = mysqlTable(
  "ContactMessages",
  {
    id,
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    message: text("message").notNull(),
    created_at,
  },
  (table) => ({
    emailIndex: index("email_idx").on(table.email),
    nameIndex: index("name_idx").on(table.name),
    createdAtIndex: index("created_at_idx").on(table.created_at),
  })
);
