import { Router } from "express";
import * as userController from "../controllers/user.controller";
import {
  authMiddleware,
  requireRole,
  requireAuth,
} from "../middlewares/auth.middleware";
import { getUserById } from "../services/user.service";
const router = Router();

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
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/me", authMiddleware, async (req, res) => {
  const userId = req.user!.userId;
  const user = await getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  return res.json({ user });
});
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, requireAuth, userController.updateUser);
router.delete("/:id", authMiddleware, requireAuth, userController.deleteUser);

router.patch(
  "/:id/role",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  userController.updateRole,
);
router.patch(
  "/:id/toggle",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  userController.toggleAccount,
);
router.post("/logout", (req, res) => {
  return res.json({ message: "Déconnecté" });
});

export default router;
