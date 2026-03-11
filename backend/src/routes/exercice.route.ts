import { Router } from "express";
import * as exerciceController from "../controllers/exercices.controller";
import {
  authMiddleware,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  exerciceController.createGame,
);
router.get("/", exerciceController.getAllGames);
router.get("/:id", exerciceController.getGameById);
router.put("/:id", authMiddleware, requireAuth, exerciceController.updateGame);
router.delete(
  "/:id",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  exerciceController.deleteGame,
);
router.patch(
  "/:id/status",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  exerciceController.toggleExerciseStatusController,
);

export default router;
