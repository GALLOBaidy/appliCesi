import { Request, Response } from "express";
import { getUserByIdentifier } from "../services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await getUserByIdentifier(login);

    // Vérification de l'existence du user
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      throw new Error("ACCOUNT_NOT_ACTIVE");
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" },
    );

    // On retire le password avant de renvoyer les données
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (err: any) {
    console.error("Login error:", err);

    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    if (err.message === "ACCOUNT_NOT_ACTIVE") {
      return res
        .status(403)
        .json({ error: "Votre compte n'est pas plus actif" });
    }

    return res.status(500).json({ error: "Erreur serveur" });
  }
};
