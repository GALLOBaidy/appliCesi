"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exercicesRelations = exports.exercices = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const userExercice_model_1 = require("./userExercice.model");
exports.exercices = (0, pg_core_1.pgTable)("exercices", {
    exerciceId: (0, pg_core_1.serial)("exercice_id").primaryKey(),
    title: (0, pg_core_1.varchar)("title"),
    description: (0, pg_core_1.text)("description"),
    type: (0, pg_core_1.varchar)("type"),
    totalDuration: (0, pg_core_1.integer)("total_duration"),
    inhalationDuration: (0, pg_core_1.integer)("inhalation_duration"),
    holdDuration: (0, pg_core_1.integer)("hold_duration").default(0),
    exhalationDuration: (0, pg_core_1.integer)("exhalation_duration"),
    cycle: (0, pg_core_1.integer)("cycle_"),
    status: (0, pg_core_1.boolean)("status"),
});
exports.exercicesRelations = (0, drizzle_orm_1.relations)(exports.exercices, ({ many }) => ({
    doneBy: many(userExercice_model_1.userExercice),
}));
