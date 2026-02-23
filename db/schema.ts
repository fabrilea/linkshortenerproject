import { bigint, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  id: bigint("id", { mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  url: text("url").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
