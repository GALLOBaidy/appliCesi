import { pgTable, serial, varchar, text, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userExercice } from "./userExercice.model";

export const exercices = pgTable("exercices", {
  exerciceId: serial("exercice_id").primaryKey(),
  title: varchar("title"),
  description: text("description"),
  type: varchar("type"),
  totalDuration: decimal("total_duration"),
  inhalationDuration: integer("inhalation_duration"),
  holdDuration: integer("hold_duration").default(0),
  exhalationDuration: integer("exhalation_duration"),
  cycle: integer("cycle_"),
  status: boolean("status"),
});

export const exercicesRelations = relations(exercices, ({ many }) => ({
  doneBy: many(userExercice),
}));
