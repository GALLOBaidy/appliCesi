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
exports.linkGuestToUser = exports.deleteGuestResults = exports.remove = exports.getByGuest = exports.getByUser = exports.getById = exports.create = void 0;
const svc = __importStar(require("../services/userGame.service"));
// middleware auth doit mettre req.user = { id: number } si connecté
const FEELINGS = ["good", "neutral", "bad", "anxious", "relaxed"];
const isFeeling = (v) => typeof v === "string" && FEELINGS.includes(v);
const create = async (req, res) => {
    try {
        const userId = req.user?.userId ?? null;
        const guestId = req.body.guestId ?? null;
        if (!userId && !guestId) {
            return res.status(400).json({ message: "Il faut être connecté ou avoir un guestId" });
        }
        const { exerciceId, feeling, dateCompletion } = req.body;
        // validation minimale
        if (exerciceId == null || !feeling || !dateCompletion) {
            return res.status(400).json({ message: "Missing fields" });
        }
        // validation stricte du feeling
        if (!isFeeling(feeling)) {
            return res.status(400).json({ message: "Invalid feeling" });
        }
        const row = await svc.createUserExercice({
            userId,
            exerciceId,
            guestId: guestId ?? null,
            feeling,
            dateCompletion: new Date(dateCompletion),
        });
        return res.status(201).json(row);
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};
exports.create = create;
const getById = async (req, res) => {
    const id = Number(req.params.id);
    const row = await svc.getById(id);
    if (!row)
        return res.status(404).json({ message: "Not found" });
    return res.json(row);
};
exports.getById = getById;
const getByUser = async (req, res) => {
    const userId = req.user?.id;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    const rows = await svc.getByUser(userId);
    return res.json(rows);
};
exports.getByUser = getByUser;
const getByGuest = async (req, res) => {
    const guestId = req.query.guestId;
    if (!guestId)
        return res.status(400).json({ message: "guestId required" });
    const rows = await svc.getByGuestId(guestId);
    return res.json(rows);
};
exports.getByGuest = getByGuest;
// Supprimer un résultat
const remove = async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.user?.id ?? null;
    const existing = await svc.getById(id);
    if (!existing)
        return res.status(404).json({ message: "Not found" });
    if (existing.userId && existing.userId !== userId)
        return res.status(403).json({ message: "Forbidden" });
    const deleted = await svc.deleteUserExercice(id);
    return res.json(deleted);
};
exports.remove = remove;
// Supprimer tous les résultats d'un invité
const deleteGuestResults = async (req, res) => {
    const { guestId } = req.body;
    if (!guestId)
        return res.status(400).json({ message: "guestId required" });
    await svc.deleteByGuestId(guestId);
    return res.json({ message: "Guest results deleted" });
};
exports.deleteGuestResults = deleteGuestResults;
//  link guest results to user after login
const linkGuestToUser = async (req, res) => {
    const userId = req.user?.id;
    const { guestId } = req.body;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!guestId)
        return res.status(400).json({ message: "guestId required" });
    // example: update all rows with guestId to set userId and clear guestId
    // implement in service if needed
    const rows = await svc.linkGuestToUser(guestId, userId);
    return res.status(200).json({
        message: "Guest data linked to user",
        updated: rows.length,
        rows,
    });
};
exports.linkGuestToUser = linkGuestToUser;
