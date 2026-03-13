import * as service from "../services/mentalHealthContent.service";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const data = await service.getAllContent();
  res.json(data);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await service.getContentById(id);
  res.json(data);
};

export const create = async (req: Request, res: Response) => {
  const data = await service.createContent({
    ...req.body,
    createdBy: (req as any).user.id, // si tu utilises un middleware auth
  });
  res.json(data);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = await service.updateContent(id, req.body);
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await service.deleteContent(id);
  res.json({ success: true });
};

export const toggleStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await service.toggleContentStatus(id);

  if (!updated) return res.status(404).json({ error: "Content not found" });

  res.json(updated);
};

export const getActive = async (req: Request, res: Response) => {
  const data = await service.getActiveContent();
  res.json(data);
};
