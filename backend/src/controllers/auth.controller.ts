import { Request, Response } from "express";
import { getUserByLogin} from "../services/user.service"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async(req: Request, res: Response) => {
    const {login, password} = req.body;

    try {
        const user = await getUserByLogin(login);

        //Vérification de l'existance du user  
        if (!user) {
            return res.status(401).json({error: "Identifiants invalides"});
        }

        //Vérification du mot de passe 
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({error: "Identifiants invalides"});
        }

        //Génération du token JWT
        const token = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET!, { expiresIn: "2h" }
        );

        //On retire le password avant de renvoyer les données
        const { password: _, ...userWithoutPassword} = user;

        return res.status(200).json({ user: userWithoutPassword, token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
}