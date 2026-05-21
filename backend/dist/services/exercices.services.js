import { db } from "../models/index.js";
import { exercices } from "../models/schema/exercice.model.js";
import { eq } from "drizzle-orm";
//Création d'un jeu
export const createGame = async (data) => {
    const result = await db.insert(exercices).values(data).returning();
    return result[0];
};
// Récupérer tous les jeux
export const getAllGames = async () => {
    const result = await db.select().from(exercices);
    return result;
};
// Récupérer 1 jeu
export const getGameById = async (id) => {
    const result = await db
        .select()
        .from(exercices)
        .where(eq(exercices.exerciceId, id));
    return result[0] || null;
};
// Modifier un jeu
export const updateGame = async (id, data) => {
    // Vérifier si le jeu existe
    const existing = await getGameById(id);
    if (!existing)
        return null;
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
    const result = await db
        .update(exercices)
        .set(cleanData)
        .where(eq(exercices.exerciceId, id))
        .returning();
    return result[0] || null;
};
// Supprimer un jeu
export const deleteGame = async (id) => {
    // Vérifier si le jeu existe
    const existing = await getGameById(id);
    if (!existing)
        return null;
    const result = await db
        .delete(exercices)
        .where(eq(exercices.exerciceId, id))
        .returning();
    return result[0] || null;
};
export const toggleExerciseStatusService = async (id) => {
    // Récupère l'exercice
    const existing = await db
        .select()
        .from(exercices)
        .where(eq(exercices.exerciceId, id));
    if (!existing[0])
        return null;
    const currentStatus = existing[0].status;
    // Inverse le booléen
    const result = await db
        .update(exercices)
        .set({ status: !currentStatus })
        .where(eq(exercices.exerciceId, id))
        .returning();
    return result[0] || null;
};
// Récupérer que les exos actifs
export const getActiveContent = async () => {
    return db.select().from(exercices).where(eq(exercices.status, true));
};
