"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.optionalAuth = exports.requireAuth = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "Token manquant" });
    }
    const token = header.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Normalisation : on crée un champ id cohérent
        req.user = {
            ...decoded,
            id: decoded.userId, // <-- clé essentielle
            userId: decoded.userId, // <-- clé essentielle
        };
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ error: "Token invalide" });
    }
};
exports.authMiddleware = authMiddleware;
// requireAuth : bloque si pas connecté
const requireAuth = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    next();
};
exports.requireAuth = requireAuth;
// optionalAuth : laisse passer, mais peut remplir req.user si token présent
const optionalAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header)
        return next();
    const token = header.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }
    catch (err) {
        // on ignore l'erreur, car c'est optionnel
        console.error("Optional token verification failed:", err);
    }
    next();
};
exports.optionalAuth = optionalAuth;
// Vérification du role
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.requireRole = requireRole;
