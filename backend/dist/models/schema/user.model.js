"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const userExercice_model_1 = require("./userExercice.model");
exports.users = (0, pg_core_1.pgTable)("users", {
    userId: (0, pg_core_1.serial)("user_id").primaryKey(),
    lastName: (0, pg_core_1.varchar)("last_name"),
    firstName: (0, pg_core_1.varchar)("first_name"),
    gender: (0, pg_core_1.varchar)("gender"),
    birthDay: (0, pg_core_1.date)("birth_day", { mode: "date" }),
    // Identifiants
    login: (0, pg_core_1.varchar)("login").notNull().unique(),
    email: (0, pg_core_1.varchar)("email").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    // Adresse
    streetNumber: (0, pg_core_1.varchar)("street_number"),
    streetName: (0, pg_core_1.varchar)("street_name"),
    city: (0, pg_core_1.varchar)("city"),
    postalCode: (0, pg_core_1.integer)("postal_code"),
    country: (0, pg_core_1.varchar)("country"),
    addressComplement: (0, pg_core_1.varchar)("address_complement"),
    // Rôle
    role: (0, pg_core_1.varchar)("role").notNull().default("user"),
    // Date d'inscription
    registrationDate: (0, pg_core_1.date)("registration_date", { mode: "date" }),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    exercicesDone: many(userExercice_model_1.userExercice),
}));
