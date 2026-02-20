import { pgTable, integer, varchar, date, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.model";
import { exercices } from "./exercice.model";

export const userExercice = pgTable("user_exercice", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.userId),
  exerciceId: integer("exercice_id")
    .notNull()
    .references(() => exercices.exerciceId),
  guestId: varchar("guest_id", { length: 255 }),
  feeling: varchar("feeling", { length: 50 }).notNull(),
  dateCompletion: date("date_completion").notNull(),
}, (table) => ({
  pk: primaryKey(table.userId, table.exerciceId),
}));

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
