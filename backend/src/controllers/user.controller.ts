import * as userService from "../services/user.service";
import { Request, Response } from "express";

//Créer un user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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

//Modifier des données
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await userService.updateUser(
      Number(req.params.id),
      req.body,
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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

  if (!["user", "moderator", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const updated = await userService.updateRole(Number(id), role);
  return res.json(updated);
};
