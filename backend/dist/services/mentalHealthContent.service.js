"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveContent = exports.toggleContentStatus = exports.deleteContent = exports.updateContent = exports.createContent = exports.getContentById = exports.getAllContent = void 0;
const models_1 = require("../models");
const mentalHealthContent_model_1 = require("../models/schema/mentalHealthContent.model");
const drizzle_orm_1 = require("drizzle-orm");
// Récupérer tous les contenus
const getAllContent = () => {
    return models_1.db.select().from(mentalHealthContent_model_1.mentalHealthContent);
};
exports.getAllContent = getAllContent;
// Récupérer un contenu
const getContentById = async (id) => {
    const rows = await models_1.db
        .select()
        .from(mentalHealthContent_model_1.mentalHealthContent)
        .where((0, drizzle_orm_1.eq)(mentalHealthContent_model_1.mentalHealthContent.id, id));
    return rows[0] ?? null;
};
exports.getContentById = getContentById;
// Créer un contenu
const createContent = async (data) => {
    try {
        const result = await models_1.db
            .insert(mentalHealthContent_model_1.mentalHealthContent)
            .values({
            title: data.title,
            body: data.body,
            category: data.category,
            createdBy: data.createdBy,
            isActive: true,
        })
            .returning();
        return result[0] ?? null;
    }
    catch (err) {
        console.error("DB insert error:", err);
        throw err;
    }
};
exports.createContent = createContent;
// Modifier un contenu
const updateContent = async (id, data) => {
    // Vérifier si le contenu existe
    const existing = await (0, exports.getContentById)(id);
    if (!existing)
        return null;
    // Préparation des données
    const updateData = {
        ...data,
        updatedAt: new Date(),
    };
    // Champs protégés (on ne modifie pas l'auteur)
    delete updateData.createdBy;
    delete updateData.createdAt;
    try {
        const result = await models_1.db
            .update(mentalHealthContent_model_1.mentalHealthContent)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(mentalHealthContent_model_1.mentalHealthContent.id, id))
            .returning();
        return result[0] ?? null;
    }
    catch (err) {
        console.error("DB update error:", err);
        throw err;
    }
};
exports.updateContent = updateContent;
// Supprimer un contenu
const deleteContent = (id) => {
    return models_1.db.delete(mentalHealthContent_model_1.mentalHealthContent).where((0, drizzle_orm_1.eq)(mentalHealthContent_model_1.mentalHealthContent.id, id));
};
exports.deleteContent = deleteContent;
// Masquer un contenu
const toggleContentStatus = async (id) => {
    const existing = await (0, exports.getContentById)(id);
    if (!existing)
        return null;
    const newStatus = !existing.isActive;
    const result = await models_1.db
        .update(mentalHealthContent_model_1.mentalHealthContent)
        .set({
        isActive: newStatus,
        updatedAt: new Date(),
    })
        .where((0, drizzle_orm_1.eq)(mentalHealthContent_model_1.mentalHealthContent.id, id))
        .returning();
    return result[0] ?? null;
};
exports.toggleContentStatus = toggleContentStatus;
// Récupérer que les contenus actif
const getActiveContent = async () => {
    return models_1.db
        .select()
        .from(mentalHealthContent_model_1.mentalHealthContent)
        .where((0, drizzle_orm_1.eq)(mentalHealthContent_model_1.mentalHealthContent.isActive, true));
};
exports.getActiveContent = getActiveContent;
