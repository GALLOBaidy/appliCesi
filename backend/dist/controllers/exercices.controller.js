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
exports.getActive = exports.toggleExerciseStatusController = exports.deleteGame = exports.updateGame = exports.getGameById = exports.getAllGames = exports.createGame = void 0;
const exercicesService = __importStar(require("../services/exercices.services"));
// Créer un exercice
const createGame = async (req, res) => {
    try {
        const exercice = await exercicesService.createGame(req.body);
        res.status(200).json(exercice);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createGame = createGame;
// Récupérer tous les exos
const getAllGames = async (req, res) => {
    try {
        const exercice = await exercicesService.getAllGames();
        res.status(200).json(exercice);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllGames = getAllGames;
// Récupérer 1 jeu
const getGameById = async (req, res) => {
    try {
        const exercice = await exercicesService.getGameById(Number(req.params.id));
        if (!exercice) {
            return res.status(404).json({ error: "Jeu introuvable" });
        }
        return res.status(200).json(exercice);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getGameById = getGameById;
// Modifier un exercice
const updateGame = async (req, res) => {
    try {
        const exercice = await exercicesService.updateGame(Number(req.params.id), req.body);
        if (!exercice) {
            return res.status(404).json({ error: "Jeu introuvable" });
        }
        res.status(200).json(exercice);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateGame = updateGame;
// Supprimer un jeu
const deleteGame = async (req, res) => {
    try {
        const exercice = await exercicesService.deleteGame(Number(req.params.id));
        if (!exercice) {
            return res.status(404).json({ error: "Jeu introuvable" });
        }
        res.status(200).json(exercice);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteGame = deleteGame;
const toggleExerciseStatusController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await exercicesService.toggleExerciseStatusService(id);
        if (!updated) {
            return res.status(404).json({ message: "Exercice introuvable" });
        }
        res.json(updated);
    }
    catch (err) {
        console.error("Erreur toggle status :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.toggleExerciseStatusController = toggleExerciseStatusController;
const getActive = async (req, res) => {
    try {
        const data = await exercicesService.getActiveContent();
        return res.json(data);
    }
    catch (err) {
        console.error("Erreur get active exercices :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getActive = getActive;
