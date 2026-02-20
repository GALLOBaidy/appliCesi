import * as bcrypt from "bcrypt";
import { db } from "../models";
import { users } from "../models/schema/user.model";
import { eq } from "drizzle-orm";

//Création d'un user
export const createUser = async (data: {
  login: string;
  password: string;
  lastName?: string;
  firstName?: string;
  gender?: string;
  birthDay?: Date;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  postalCode?: number;
  country?: string;
  addressComplement?: string;
  role?: string;
  registrationDate?: Date;
}) => {
  // Hash du mot de passe
  const hash = await bcrypt.hash(data.password, 10);

  //Convertir brithDay en vraie date JS
  const birthDay = data.birthDay ? new Date(data.birthDay) : null;
  console.log("birth reçu :", data.birthDay, "->après conversion :", birthDay);

  // Insertion flexible : on ne met que ce qui existe
  try {
    const result = await db
      .insert(users)
      .values({
        ...data,
        birthDay,
        login: data.login,
        password: hash,
        registrationDate: new Date(),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("🔥 Error during user creation:", error);
    throw error;
  }
};

//Récupérer tous les users
export const getAllUsers = async () => {
  const result = await db.select().from(users);
  return result.map(({ password, ...user }) => user); // Exclure les mots de passe
};

//Récupérer 1 user
export const getUserById = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.userId, id));
  if (!result[0]) return null;
  const { password, ...user } = result[0]; // Exclure le mot de passe
  return user;
};

//Modifier des données
export const updateUser = async (
  id: number,
  data: Partial<{
    login: string;
    password: string;
    lastName: string;
    firstName: string;
    gender: string;
    birthDay: Date;
    streetNumber: string;
    streetName: string;
    city: string;
    postalCode: number;
    country: string;
    addressComplement: string;
    role: string;
    registrationDate: Date;
  }>,
) => {
  //Vérifier si le user existe
  const existingUser = await getUserById(id);
  if (!existingUser) return null;

  const updateData: any = { ...data };

  //Empêcher la modification de la date de d'inscription
  delete updateData.registrationDate;

  // Re-hash si password fourni
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  const result = await db
    .update(users)
    .set(updateData)
    .where(eq(users.userId, id))
    .returning();

  return result[0] ?? null;
};

//Supprimer un user
export const deleteUser = async (id: number) => {
  //Vérifier si le user existe
  const existingUser = await getUserById(id);
  if (!existingUser) return null;

  const result = await db.delete(users).where(eq(users.userId, id)).returning();

  return result[0] ?? null;
};

//Récupérer un user par son login (pour l'authentification)
export const getUserByLogin = async (login: string) => {
  const result = await db.select().from(users).where(eq(users.login, login));
  return (result[0] as any) || null;
};
