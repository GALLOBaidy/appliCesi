import { db } from "../models/index.js";
import { mentalHealthContent } from "../models/schema/mentalHealthContent.model.js";
import { eq } from "drizzle-orm";
// Récupérer tous les contenus
export const getAllContent = () => {
    return db.select().from(mentalHealthContent);
};
// Récupérer un contenu
export const getContentById = async (id) => {
    const rows = await db
        .select()
        .from(mentalHealthContent)
        .where(eq(mentalHealthContent.id, id));
    return rows[0] ?? null;
};
// Créer un contenu
export const createContent = async (data) => {
    try {
        const result = await db
            .insert(mentalHealthContent)
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
// Modifier un contenu
export const updateContent = async (id, data) => {
    // Vérifier si le contenu existe
    const existing = await getContentById(id);
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
        const result = await db
            .update(mentalHealthContent)
            .set(updateData)
            .where(eq(mentalHealthContent.id, id))
            .returning();
        return result[0] ?? null;
    }
    catch (err) {
        console.error("DB update error:", err);
        throw err;
    }
};
// Supprimer un contenu
export const deleteContent = (id) => {
    return db.delete(mentalHealthContent).where(eq(mentalHealthContent.id, id));
};
// Masquer un contenu
export const toggleContentStatus = async (id) => {
    const existing = await getContentById(id);
    if (!existing)
        return null;
    const newStatus = !existing.isActive;
    const result = await db
        .update(mentalHealthContent)
        .set({
        isActive: newStatus,
        updatedAt: new Date(),
    })
        .where(eq(mentalHealthContent.id, id))
        .returning();
    return result[0] ?? null;
};
// Récupérer que les contenus actifs
export const getActiveContent = async () => {
    return db
        .select()
        .from(mentalHealthContent)
        .where(eq(mentalHealthContent.isActive, true));
};
