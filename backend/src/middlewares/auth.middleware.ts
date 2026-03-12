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
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    // Normalisation : on crée un champ id cohérent
    (req as any).user = {
      ...decoded,
      id: decoded.userId, // <-- clé essentielle
      userId: decoded.userId, // <-- clé essentielle
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
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
  const header = req.headers.authorization;
  if (!header) return next();

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
  } catch (err) {
    // on ignore l'erreur, car c'est optionnel
    console.error("Optional token verification failed:", err);
  }

  next();
};

// Vérification du role
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
