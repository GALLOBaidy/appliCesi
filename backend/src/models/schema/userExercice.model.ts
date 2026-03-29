// models/schema/userExercice.model.ts
import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.model";
import { exercices } from "./exercice.model";

export const FeelingEnum = pgEnum("feeling_enum", [
  "good",
  "neutral",
  "bad",
  "anxious",
  "relaxed",
]);

export const userExercice = pgTable("user_exercice", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.userId)
    .$type<number | null>()
    .default(null),
  exerciceId: integer("exercice_id")
    .notNull()
    .references(() => exercices.exerciceId),
  guestId: varchar("guest_id", { length: 255 })
    .$type<string | null>()
    .default(null),
  feeling: FeelingEnum("feeling").notNull(),
  dateCompletion: timestamp("date_completion").notNull(),
});

export const userExerciceRelations = relations(userExercice, ({ one }) => ({
  user: one(users, {
    fields: [userExercice.userId],
    references: [users.userId],
  }),
  exercice: one(exercices, {
    fields: [userExercice.exerciceId],
    references: [exercices.exerciceId],
  }),
}));
