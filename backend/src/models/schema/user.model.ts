import { pgTable, serial, varchar, integer, text, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userExercice } from "./userExercice.model";

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  lastName: varchar("last_name"),
  firstName: varchar("first_name"),
  gender: varchar("gender"),
  birthDay: date("birth_day", { mode: "date" }),
  login: varchar("login"),
  password: text("password"),
  streetNumber: varchar("street_number"),
  streetName: varchar("street_name"),
  city: varchar("city"),
  postalCode: integer("postal_code"),
  country: varchar("country"),
  addressComplement: varchar("address_complement"),
  role: varchar("role"),
  registrationDate: date("registration_date", { mode: "date" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  exercicesDone: many(userExercice),
}));
