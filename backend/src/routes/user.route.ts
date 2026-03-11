import { Router } from "express";
import * as userController from "../controllers/user.controller";
import {
  authMiddleware,
  requireRole,
  requireAuth,
} from "../middlewares/auth.middleware";
const router = Router();

router.post("/", userController.createUser);
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: (req as any).user });
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
router.post("/logout", (req, res) => {
  return res.json({ message: "Déconnecté" });
});


export default router;
