"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeelingsStats = exports.getRunsByDay = exports.getTotalRuns = exports.getTotalUsers = void 0;
const models_1 = require("../models");
const user_model_1 = require("../models/schema/user.model");
const userExercice_model_1 = require("../models/schema/userExercice.model");
const drizzle_orm_1 = require("drizzle-orm");
// Total des utilisateurs
const getTotalUsers = async () => {
    const [row] = await models_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(user_model_1.users);
    return row.total;
};
exports.getTotalUsers = getTotalUsers;
// Nombre total de runs
const getTotalRuns = async () => {
    const [row] = await models_1.db.select({ total: (0, drizzle_orm_1.count)() }).from(userExercice_model_1.userExercice);
    return row.total;
};
exports.getTotalRuns = getTotalRuns;
// Stats par jour
const getRunsByDay = async () => {
    return models_1.db
        .select({
        date: (0, drizzle_orm_1.sql) `DATE(${userExercice_model_1.userExercice.dateCompletion})`,
        count: (0, drizzle_orm_1.count)(),
    })
        .from(userExercice_model_1.userExercice)
        .groupBy((0, drizzle_orm_1.sql) `DATE(${userExercice_model_1.userExercice.dateCompletion})`)
        .orderBy((0, drizzle_orm_1.sql) `DATE(${userExercice_model_1.userExercice.dateCompletion})`);
};
exports.getRunsByDay = getRunsByDay;
// Répartition des feelings
const getFeelingsStats = async () => {
    return models_1.db
        .select({
        feeling: userExercice_model_1.userExercice.feeling,
        count: (0, drizzle_orm_1.count)(),
    })
        .from(userExercice_model_1.userExercice)
        .groupBy(userExercice_model_1.userExercice.feeling);
};
exports.getFeelingsStats = getFeelingsStats;
