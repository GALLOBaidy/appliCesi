import * as bcrypt from "bcrypt";
import { db } from "../models";
import { users } from "../models/schema/user.model";
import { or, eq } from "drizzle-orm";

// --- Helpers ----------------------------------------------------

async function ensureEmailUnique(newEmail?: string, currentEmail?: string) {
  if (!newEmail || newEmail === currentEmail) return;

  const exists = await db.select().from(users).where(eq(users.email, newEmail));

  if (exists.length > 0) {
    throw new Error("EMAIL_ALREADY_USED");
  }
}

async function ensureLoginUnique(newLogin?: string, currentLogin?: string) {
  if (!newLogin || newLogin === currentLogin) return;

  const exists = await db.select().from(users).where(eq(users.login, newLogin));

  if (exists.length > 0) {
    throw new Error("LOGIN_ALREADY_USED");
  }
}

function normalizeBirthDay(value?: any) {
  if (!value) return undefined;

  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function hashPasswordIfNeeded(password?: string) {
  return password ? await bcrypt.hash(password, 10) : undefined;
}

// Création d'un user
export const createUser = async (data: {
  login: string;
  email: string;
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
  // Vérifier email unique
  await ensureEmailUnique(data.email, "");

  // Vérifier login unique
  await ensureLoginUnique(data.login, "");
  // Hash du mot de passe
  const hash = await bcrypt.hash(data.password, 10);

  const birthDay = data.birthDay ? new Date(data.birthDay) : null;

  try {
    const result = await db
      .insert(users)
      .values({
        lastName: data.lastName,
        firstName: data.firstName,
        gender: data.gender,
        birthDay,
        login: data.login,
        email: data.email,
        password: hash,
        streetNumber: data.streetNumber,
        streetName: data.streetName,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        addressComplement: data.addressComplement,
        role: data.role ?? "user",
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

// --- Main function ----------------------------------------------

export const updateUser = async (
  id: number,
  data: Partial<{
    login: string;
    email: string;
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
  const existingUser = await getUserById(id);
  if (!existingUser) return null;

  // Vérifications unicité
  if (data.email !== undefined) {
    await ensureEmailUnique(data.email, existingUser.email);
  }

  if (data.login !== undefined) {
    await ensureLoginUnique(data.login, existingUser.login);
  }

  // Préparation des données
  const updateData: any = {
    ...data,
    birthDay: normalizeBirthDay(data.birthDay),
    password: await hashPasswordIfNeeded(data.password),
  };

  // Champs protégés
  delete updateData.registrationDate;
  delete updateData.role;

  try {
    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.userId, id))
      .returning();

    return result[0] ?? null;
  } catch (err: any) {
    console.error("DB update error:", err);
    throw err;
  }
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
export const getUserByIdentifier = async (identifier: string) => {
  const result = await db
    .select()
    .from(users)
    .where(or(eq(users.login, identifier), eq(users.email, identifier)));

  return result[0] || null;
};

// Modifier le rôle
export const updateRole = async (id: number, role: string) => {
  const [row] = await db
    .update(users)
    .set({ role })
    .where(eq(users.userId, id))
    .returning();

  return row;
};

// Désactiver un compte
export const toggle = async (id: number, isActive: boolean) => {
  // Récupérer le profil
  const existing = await db.select().from(users).where(eq(users.userId, id));

  if (!existing[0]) return null;


  // Désactiver le compte
  const [row] = await db
    .update(users)
    .set({ isActive })
    .where(eq(users.userId, id))
    .returning();

  return row;
};
