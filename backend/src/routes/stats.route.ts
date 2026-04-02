import { Router } from "express";
import * as ctrl from "../controllers/stats.controller";
import {
  authMiddleware,
  requireAuth,
  requireRole,
} from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Récupère les statistiques globales de l'application
 *     responses:
 *       200:
 *         description: OK
 */

router.get(
  "/users",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  ctrl.totalUsers,
);

router.get(
  "/runs",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  ctrl.totalRuns,
);


router.get(
  "/runs-by-day",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  ctrl.runsByDay,
);

router.get(
  "/feelings",
  authMiddleware,
  requireAuth,
  requireRole("Admin"),
  ctrl.feelingsStats,
);

export default router;
