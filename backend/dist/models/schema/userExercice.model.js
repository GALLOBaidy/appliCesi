"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExerciceRelations = exports.userExercice = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("./user.model");
const exercice_model_1 = require("./exercice.model");
exports.userExercice = (0, pg_core_1.pgTable)("user_exercice", {
    userId: (0, pg_core_1.integer)("user_id")
        .notNull()
        .references(() => user_model_1.users.userId),
    exerciceId: (0, pg_core_1.integer)("exercice_id")
        .notNull()
        .references(() => exercice_model_1.exercices.exerciceId),
    guestId: (0, pg_core_1.varchar)("guest_id", { length: 255 }),
    feeling: (0, pg_core_1.varchar)("feeling", { length: 50 }).notNull(),
    dateCompletion: (0, pg_core_1.date)("date_completion").notNull(),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)(table.userId, table.exerciceId),
}));
exports.userExerciceRelations = (0, drizzle_orm_1.relations)(exports.userExercice, ({ one }) => ({
    user: one(user_model_1.users, {
        fields: [exports.userExercice.userId],
        references: [user_model_1.users.userId],
    }),
    exercice: one(exercice_model_1.exercices, {
        fields: [exports.userExercice.exerciceId],
        references: [exercice_model_1.exercices.exerciceId],
    }),
}));
