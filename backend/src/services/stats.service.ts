import { db } from "../models";
import { users } from "../models/schema/user.model";
import { userExercice } from "../models/schema/userExercice.model";
import { count, sql } from "drizzle-orm";

// Total des utilisateurs
export const getTotalUsers = async () => {
  const [row] = await db.select({ total: count() }).from(users);
  return row.total;
};

// Nombre total de runs
export const getTotalRuns = async () => {
  const [row] = await db.select({ total: count() }).from(userExercice);
  return row.total;
};

// Stats par jour
export const getRunsByDay = async () => {
  return db
    .select({
      date: sql`DATE(${userExercice.dateCompletion})`,
      count: count(),
    })
    .from(userExercice)
    .groupBy(sql`DATE(${userExercice.dateCompletion})`)
    .orderBy(sql`DATE(${userExercice.dateCompletion})`);
};

// Répartition des feelings
export const getFeelingsStats = async () => {
  return db
    .select({
      feeling: userExercice.feeling,
      count: count(),
    })
    .from(userExercice)
    .groupBy(userExercice.feeling);
};
