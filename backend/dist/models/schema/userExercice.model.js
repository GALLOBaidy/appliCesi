"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExerciceRelations = exports.userExercice = exports.FeelingEnum = void 0;
// models/schema/userExercice.model.ts
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_model_1 = require("./user.model");
const exercice_model_1 = require("./exercice.model");
exports.FeelingEnum = (0, pg_core_1.pgEnum)("feeling_enum", [
    "good",
    "neutral",
    "bad",
    "anxious",
    "relaxed",
]);
exports.userExercice = (0, pg_core_1.pgTable)("user_exercice", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id")
        .references(() => user_model_1.users.userId)
        .$type()
        .default(null),
    exerciceId: (0, pg_core_1.integer)("exercice_id")
        .notNull()
        .references(() => exercice_model_1.exercices.exerciceId),
    guestId: (0, pg_core_1.varchar)("guest_id", { length: 255 })
        .$type()
        .default(null),
    feeling: (0, exports.FeelingEnum)("feeling").notNull(),
    dateCompletion: (0, pg_core_1.date)("date_completion").notNull(),
});
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
