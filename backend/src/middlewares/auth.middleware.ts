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

/**
 * Résout les rôles demandés : accepte un nom de groupe (string) ou un tableau
 * où chaque élément peut être un groupe ou un rôle.
 * Retourne un tableau de rôles (non normalisés).
 */
// function resolveRequestRoles(requested) {
//   if (!requested) return [];
//   if (typeof requested === "string")
//     //Si c'est le nom d'un groupe, retourne le groupe, sinon retourne le rôle tel quel
//     return ROLE_GROUPS[requested] ?? [requested];

//   //tableau : chaque élément peut être un groupe ou un rôle
//   return requested.flatMap((r) => ROLE_GROUPS[r] ?? [r]);
// }

// export function authorize(roles = []) {
//   // Accepte un string ou un tableau
//   if (typeof roles === "string") roles = [roles];

//   //Résoudre les rôles demandés et normaliser pour comparaison insensible à la case
//   const resolved = Array.from(
//     new Set(
//       resolveRequestRoles(roles)
//         .map((r) => String(r).trim().toLowerCase()) //trim + lowercase
//         .filter(Boolean), //enlever les valeurs vides
//     ),
//   );
//   return (req, res, next) => {
//     // Récupérer l'utilisateur décodé depuis le JWT
//     const user = req.jwtUser;
//     //Si pas de user authentifié break
//     if (!user) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     //Récupérer les rôles du user : si c'est un tableau on l'utilise
//     const userRoles = Array.isArray(user.roles)
//       ? user.roles
//       : user.title //si juste un role => on le transforrme en tableau
//         ? [user.title]
//         : []; //sinon on retourne un tableau vide

//     //Normaliser les rôles utilisateurs (trim + lowercase) pour comparaison cohérente
//     const normalizedUserRoles = userRoles
//       .flat() // au cas où nested arrays
//       .map((r) => {
//         // gérer objets rôle éventuels { name: "Admin" } ou valeur non string
//         if (r && typeof r === "object") {
//           return String(r.name ?? r.title ?? "")
//             .trim()
//             .toLowerCase();
//         }
//         return String(r ?? "")
//           .trim()
//           .toLowerCase();
//       })
//       .filter(Boolean);

//     // Autorise si aucun rôle n'est requis ou si au moins un rôle requis est dans userRoles
//     const allowed =
//       resolved.length === 0 ||
//       resolved.some((r) => normalizedUserRoles.includes(r));
//     //Si non autorisé on renvoie 403
//     if (!allowed) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     //Sinon, on passe
//     next();
//   };
// }
