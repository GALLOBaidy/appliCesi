import { Request, Response } from "express";
import * as svc from "../services/stats.service";

export const totalUsers = async (req: Request, res: Response) => {
  const total = await svc.getTotalUsers();
  res.json({ totalUsers: total });
};

export const totalRuns = async (req: Request, res: Response) => {
  const total = await svc.getTotalRuns();
  res.json({ totalRuns: total });
};

export const runsByDay = async (req: Request, res: Response) => {
  const rows = await svc.getRunsByDay();
  res.json(rows);
};

export const feelingsStats = async (req: Request, res: Response) => {
  const rows = await svc.getFeelingsStats();
  res.json(rows);
};
