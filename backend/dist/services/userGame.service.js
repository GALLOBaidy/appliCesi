"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkGuestToUser = exports.deleteByGuestId = exports.deleteUserExercice = exports.getByGuestId = exports.getByUser = exports.getById = exports.createUserExercice = void 0;
// services/userExercice.service.ts
const models_1 = require("../models"); // ton client drizzle
const userExercice_model_1 = require("../models/schema/userExercice.model");
const drizzle_orm_1 = require("drizzle-orm");
const createUserExercice = async (payload) => {
    const [row] = await models_1.db.insert(userExercice_model_1.userExercice).values(payload).returning();
    return row;
};
exports.createUserExercice = createUserExercice;
const getById = async (id) => {
    const rows = await models_1.db.select().from(userExercice_model_1.userExercice).where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.id, id));
    return rows[0] ?? null;
};
exports.getById = getById;
const getByUser = async (userId) => {
    return models_1.db.select().from(userExercice_model_1.userExercice).where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.userId, userId));
};
exports.getByUser = getByUser;
const getByGuestId = async (guestId) => {
    return models_1.db.select().from(userExercice_model_1.userExercice).where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.guestId, guestId));
};
exports.getByGuestId = getByGuestId;
const deleteUserExercice = async (id) => {
    const [row] = await models_1.db.delete(userExercice_model_1.userExercice).where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.id, id)).returning();
    return row ?? null;
};
exports.deleteUserExercice = deleteUserExercice;
const deleteByGuestId = async (guestId) => {
    return models_1.db
        .delete(userExercice_model_1.userExercice)
        .where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.guestId, guestId));
};
exports.deleteByGuestId = deleteByGuestId;
const linkGuestToUser = async (guestId, userId) => {
    const rows = await models_1.db
        .update(userExercice_model_1.userExercice)
        .set({
        userId,
        guestId: null, // on supprime le guestId
    })
        .where((0, drizzle_orm_1.eq)(userExercice_model_1.userExercice.guestId, guestId))
        .returning();
    return rows;
};
exports.linkGuestToUser = linkGuestToUser;
