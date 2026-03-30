// services/userExercice.service.ts
import { db } from "../models"; // ton client drizzle
import { userExercice } from "../models/schema/userExercice.model";
import { exercices } from "../models/schema/exercice.model";
import { NewUserExercice } from "../models/type";
import { eq } from "drizzle-orm";

export const createUserExercice = async (payload: NewUserExercice) => {
  const [row] = await db.insert(userExercice).values(payload).returning();
  return row;
};

export const getById = async (id: number) => {
  const rows = await db
    .select({
      id: userExercice.id,
      feeling: userExercice.feeling,
      dateCompletion: userExercice.dateCompletion,
      userId: userExercice.userId,
      guestId: userExercice.guestId,
      exerciceId: userExercice.exerciceId,
      exerciceTitle: exercices.title,
    })
    .from(userExercice)
    .innerJoin(exercices, eq(userExercice.exerciceId, exercices.exerciceId))
    .where(eq(userExercice.id, id));
  return rows[0] ?? null;
};

export const getByUser = async (userId: number) => {
  return db
    .select({
      id: userExercice.id,
      feeling: userExercice.feeling,
      dateCompletion: userExercice.dateCompletion,
      exerciceId: userExercice.exerciceId,
      exerciceTitle: exercices.title,
    })
    .from(userExercice)
    .innerJoin(exercices, eq(userExercice.exerciceId, exercices.exerciceId))
    .where(eq(userExercice.userId, userId));
};

export const getByGuestId = async (guestId: string) => {
  return db
    .select({
      id: userExercice.id,
      feeling: userExercice.feeling,
      dateCompletion: userExercice.dateCompletion,
      exerciceId: userExercice.exerciceId,
      exerciceTitle: exercices.title,
    })
    .from(userExercice)
    .innerJoin(exercices, eq(userExercice.exerciceId, exercices.exerciceId))
    .where(eq(userExercice.guestId, guestId));
};

export const deleteUserExercice = async (id: number) => {
  const [row] = await db
    .delete(userExercice)
    .where(eq(userExercice.id, id))
    .returning();
  return row ?? null;
};

export const deleteByGuestId = async (guestId: string) => {
  return db.delete(userExercice).where(eq(userExercice.guestId, guestId));
};

export const linkGuestToUser = async (guestId: string, userId: number) => {
  const rows = await db
    .update(userExercice)
    .set({
      userId,
      guestId: null, // on supprime le guestId
    })
    .where(eq(userExercice.guestId, guestId))
    .returning();

  return rows;
};
