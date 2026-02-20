import { db } from "../models";
import { exercices } from "../models/schema/exercice.model";
import { eq } from "drizzle-orm";

//Création d'un jeu
export const createGame = async (data: {
  title: string;
  description: string;
  type: string;
  totalDuration: number;
  inhalationDuration: number;
  holdDuration: number;
  exhalationDuration: number;
  cycle: number;
  status: boolean;
}) => {
  const result = await db.insert(exercices).values(data).returning();

  return result[0];
};

// Récupérer tous les jeux
export const getAllGames = async () => {
  const result = await db.select().from(exercices);
  return result;
};

// Récupérer 1 jeu
export const getGameById = async (id: number) => {
  const result = await db
    .select()
    .from(exercices)
    .where(eq(exercices.exerciceId, id));

  return result[0] || null;
};

// Modifier un jeu
export const updateGame = async (
  id: number,
  data: Partial<{
    title: string;
    description: string;
    type: string;
    totalDuration: number;
    inhalationDuration: number;
    holdDuration: number;
    exhalationDuration: number;
    cycle: number;
    status: boolean;
  }>,
) => {
  // Vérifier si le jeu existe
  const existing = await getGameById(id);
  if (!existing) return null;

  const result = await db
    .update(exercices)
    .set(data)
    .where(eq(exercices.exerciceId, id))
    .returning();

  return result[0] || null;
};

// Supprimer un jeu
export const deleteGame = async (id: number) => {
  // Vérifier si le jeu existe
  const existing = await getGameById(id);
  if (!existing) return null;

  const result = await db
    .delete(exercices)
    .where(eq(exercices.exerciceId, id))
    .returning();

  return result[0] || null;
};
