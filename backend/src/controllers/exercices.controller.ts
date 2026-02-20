import * as exercicesService from "../services/exercices.services";
import { Request, Response } from "express";

// Créer un exercice
export const createGame = async (req: Request, res: Response) => {
  try {
    const exercice = await exercicesService.createGame(req.body);
    res.status(200).json(exercice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer tous les exos
export const getAllGames = async (req: Request, res: Response) => {
  try {
    const exercice = await exercicesService.getAllGames();
    res.status(200).json(exercice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer 1 jeu
export const getGameById = async (req: Request, res: Response) => {
  try {
    const exercice = await exercicesService.getGameById(Number(req.params.id));
    if (!exercice) {
      return res.status(404).json({ error: "Jeu introuvable" });
    }
    return res.status(200).json(exercice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier un exercice
export const updateGame = async (req: Request, res: Response) => {
  try {
    const exercice = await exercicesService.updateGame(
      Number(req.params.id),
      req.body,
    );
    if (!exercice) {
      return res.status(404).json({ error: "Jeu introuvable" });
    }
    res.status(200).json(exercice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un jeu
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const exercice = await exercicesService.deleteGame(Number(req.params.id));
    if (!exercice) {
      return res.status(404).json({ error: "Jeu introuvable" });
    }
    res.status(200).json(exercice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
