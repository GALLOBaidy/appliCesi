import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const mentalHealthContent = pgTable("mental_health_content", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),

  category: varchar("category", { length: 100 }).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdBy: integer("created_by").references(() => users.userId, {
    onDelete: "set null",
  }),
});
