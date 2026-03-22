"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const user_service_1 = require("../services/user.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = async (req, res) => {
    const { login, password } = req.body;
    try {
        const user = await (0, user_service_1.getUserByIdentifier)(login);
        // Vérification de l'existence du user
        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }
        // Vérification du mot de passe
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            throw new Error("INVALID_CREDENTIALS");
        }
        // Vérifier si le compte est actif
        if (!user.isActive) {
            throw new Error("ACCOUNT_NOT_ACTIVE");
        }
        // Génération du token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });
        // On retire le password avant de renvoyer les données
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword, token });
    }
    catch (err) {
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
exports.login = login;
