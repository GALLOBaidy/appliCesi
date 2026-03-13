import { Router } from "express";
import * as controller from "../controllers/mentalHealthContent.controller";
import {
  authMiddleware,
  requireRole,
  requireAuth,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  controller.getAll,
);
router.get("/public/active", controller.getActive);
router.get("/:id", controller.getOne);
router.post(
  "/",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  controller.create,
);
router.put(
  "/:id",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  controller.update,
);
router.delete(
  "/:id",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  controller.remove,
);
router.patch(
  "/:id/toggle",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  controller.toggleStatus,
);

export default router;
