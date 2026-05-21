import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { userExercice } from "./schema/userExercice.model.js";

export type UserExercice = InferSelectModel<typeof userExercice>;
export type NewUserExercice = InferInsertModel<typeof userExercice>;
export type Feeling = UserExercice["feeling"];
