"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.getGameById = exports.getAllGames = exports.createGame = void 0;
const models_1 = require("../models");
const exercice_model_1 = require("../models/schema/exercice.model");
const drizzle_orm_1 = require("drizzle-orm");
//Création d'un jeu
const createGame = async (data) => {
    const result = await models_1.db.insert(exercice_model_1.exercices).values(data).returning();
    return result[0];
};
exports.createGame = createGame;
// Récupérer tous les jeux
const getAllGames = async () => {
    const result = await models_1.db.select().from(exercice_model_1.exercices);
    return result;
};
exports.getAllGames = getAllGames;
// Récupérer 1 jeu
const getGameById = async (id) => {
    const result = await models_1.db
        .select()
        .from(exercice_model_1.exercices)
        .where((0, drizzle_orm_1.eq)(exercice_model_1.exercices.exerciceId, id));
    return result[0] || null;
};
exports.getGameById = getGameById;
// Modifier un jeu
const updateGame = async (id, data) => {
    // Vérifier si le jeu existe
    const existing = await (0, exports.getGameById)(id);
    if (!existing)
        return null;
    const result = await models_1.db
        .update(exercice_model_1.exercices)
        .set(data)
        .where((0, drizzle_orm_1.eq)(exercice_model_1.exercices.exerciceId, id))
        .returning();
    return result[0] || null;
};
exports.updateGame = updateGame;
// Supprimer un jeu
const deleteGame = async (id) => {
    // Vérifier si le jeu existe
    const existing = await (0, exports.getGameById)(id);
    if (!existing)
        return null;
    const result = await models_1.db
        .delete(exercice_model_1.exercices)
        .where((0, drizzle_orm_1.eq)(exercice_model_1.exercices.exerciceId, id))
        .returning();
    return result[0] || null;
};
exports.deleteGame = deleteGame;
