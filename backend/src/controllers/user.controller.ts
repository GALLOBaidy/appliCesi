import * as userService from "../services/user.service";
import { Request, Response } from "express";

//Créer un user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).json(user);
  } catch (err: any) {
    if (err.message === "EMAIL_ALREADY_USED") {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }
    if (err.message === "LOGIN_ALREADY_USED") {
      return res.status(400).json({ error: "Ce login est déjà utilisé" });
    }

    console.error(err);
    res.status(500).json({ error: "Erreur server" });
  }
};

//Récupérer tous les users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//Récupérer 1 user
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

//Modifier des données du profil
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId; // ID du token

    const updatedUser = await userService.updateUser(userId, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err: any) {
    if (err.message === "EMAIL_ALREADY_USED") {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }
    if (err.message === "LOGIN_ALREADY_USED") {
      return res.status(400).json({ error: "Ce login est déjà utilisé" });
    }

    console.error(err);
    res.status(500).json({ error: "Erreur server" });
  }
};

//Supprimer un user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.id));
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(deletedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier le role
export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["User", "Moderator", "Admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const updated = await userService.updateRole(Number(id), role);
  return res.json(updated);
};

// Désactiver un compte
export const toggleAccount = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive manquant ou invalide" });
    }
    const updated = await userService.toggle(id, isActive);

    if (!updated) {
      return res.status(404).json({ message: "Compte introuvable" });
    }
    res.status(200).json(updated);
  } catch (e) {
    console.error("Error toggle:", e);
    res.status(500).json({ message: "Errerur server" });
  }
};
