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
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_service_1 = require("../services/user.service");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /user:
 *   get:
 *     summary: Récupère les infos de l'utilisateur
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/", userController.createUser);
router.get("/", auth_middleware_1.authMiddleware, userController.getAllUsers);
router.get("/me", auth_middleware_1.authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const user = await (0, user_service_1.getUserById)(userId);
    if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    return res.json({ user });
});
router.get("/:id", auth_middleware_1.authMiddleware, userController.getUserById);
router.put("/me", auth_middleware_1.authMiddleware, auth_middleware_1.requireAuth, userController.updateUser);
router.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.requireAuth, userController.deleteUser);
router.patch("/:id/role", auth_middleware_1.authMiddleware, auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("Admin"), userController.updateRole);
router.patch("/:id/toggle", auth_middleware_1.authMiddleware, auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("Admin"), userController.toggleAccount);
router.post("/logout", (req, res) => {
    return res.json({ message: "Déconnecté" });
});
exports.default = router;
