import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded; // Attacher les infos du user à la requête
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
};

// requireAuth : bloque si pas connecté
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!(req as any).user)
    return res.status(401).json({ message: "Unauthorized" });
  next();
};

// optionalAuth : laisse passer, mais peut remplir req.user si token présent
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // parse token, set (req as any).user = { id: ... } si valide
  // sinon ne fait rien
  next();
};
