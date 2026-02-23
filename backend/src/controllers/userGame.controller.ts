import { Request, Response } from "express";
import * as svc from "../services/userGame.service";

// middleware auth doit mettre req.user = { id: number } si connecté

const FEELINGS = ["good", "neutral", "bad", "anxious", "relaxed"] as const;
type Feeling = (typeof FEELINGS)[number];
const isFeeling = (v: unknown): v is Feeling =>
  typeof v === "string" && FEELINGS.includes(v as Feeling);

export const create = async (req: Request, res: Response) => {
  try {
    const { exerciceId, feeling, dateCompletion, guestId } = req.body;
    const userId = (req as any).user?.id ?? null;

    // validation minimale
    if (!exerciceId || !feeling || !dateCompletion) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // validation stricte du feeling
    if (!isFeeling(feeling)) {
      return res.status(400).json({ message: "Invalid feeling" });
    }

    const row = await svc.createUserExercice({
      userId,
      exerciceId,
      guestId: guestId ?? null,
      feeling,
      dateCompletion,
    });

    return res.status(201).json(row);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const row = await svc.getById(id);
  if (!row) return res.status(404).json({ message: "Not found" });
  return res.json(row);
};

export const getByUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const rows = await svc.getByUser(userId);
  return res.json(rows);
};

export const getByGuest = async (req: Request, res: Response) => {
  const guestId = req.query.guestId as string;
  if (!guestId) return res.status(400).json({ message: "guestId required" });
  const rows = await svc.getByGuestId(guestId);
  return res.json(rows);
};

// export const update = async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   const userId = (req as any).user?.id ?? null;
//   const existing = await svc.getById(id);
//   if (!existing) return res.status(404).json({ message: "Not found" });

//   // autorisation : si enregistrement lié à un user, seul ce user peut modifier
//   if (existing.userId && existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });

//   const updated = await svc.updateUserExercice(id, req.body);
//   return res.json(updated);
// };

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userId = (req as any).user?.id ?? null;
  const existing = await svc.getById(id);
  if (!existing) return res.status(404).json({ message: "Not found" });
  if (existing.userId && existing.userId !== userId)
    return res.status(403).json({ message: "Forbidden" });

  const deleted = await svc.deleteUserExercice(id);
  return res.json(deleted);
};

// Optional: link guest results to user after login
export const linkGuestToUser = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { guestId } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!guestId) return res.status(400).json({ message: "guestId required" });

  // example: update all rows with guestId to set userId and clear guestId
  // implement in service if needed
  return res.status(200).json({ message: "Implement linking in service" });
};
