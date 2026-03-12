"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAccount = exports.updateRole = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const userService = __importStar(require("../services/user.service"));
//Créer un user
const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(200).json(user);
    }
    catch (err) {
        if (err.message === "EMAIL_ALREADY_USED") {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }
        if (err.message === "LOGIN_ALREADY_USED") {
            return res.status(400).json({ error: "Ce login est déjà utilisé" });
        }
        console.error(err);
        res.status(500).json({ error: "Erreur server" });
    }
};
exports.createUser = createUser;
//Récupérer tous les users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllUsers = getAllUsers;
//Récupérer 1 user
const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getUserById = getUserById;
//Modifier des données du profil
const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId; // ID du token
        const updatedUser = await userService.updateUser(userId, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        if (err.message === "EMAIL_ALREADY_USED") {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }
        if (err.message === "LOGIN_ALREADY_USED") {
            return res.status(400).json({ error: "Ce login est déjà utilisé" });
        }
        console.error(err);
        res.status(500).json({ error: "Erreur server" });
    }
};
exports.updateUser = updateUser;
//Supprimer un user
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(Number(req.params.id));
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(deletedUser);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteUser = deleteUser;
// Modifier le role
const updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!["User", "Moderator", "Admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }
    const updated = await userService.updateRole(Number(id), role);
    return res.json(updated);
};
exports.updateRole = updateRole;
// Désactiver un compte
const toggleAccount = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive manquant ou invalide" });
        }
        const updated = await userService.toggle(id, isActive);
        if (!updated) {
            return res.status(404).json({ message: "Compte introuvable" });
        }
        res.status(200).json(updated);
    }
    catch (e) {
        console.error("Error toggle:", e);
        res.status(500).json({ message: "Errerur server" });
    }
};
exports.toggleAccount = toggleAccount;
