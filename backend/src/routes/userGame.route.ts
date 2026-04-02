// routes/userExercice.routes.ts
import { Router } from "express";
import * as ctrl from "../controllers/userGame.controller";
import { authMiddleware, optionalAuth, requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * /userGames:
 *   get:
 *     summary: Récupère les infos sur les résultats de l'utilisateur
 *     responses:
 *       200:
 *         description: OK
 */

// public: create a run (guest or logged)
router.post("/", optionalAuth, ctrl.create);

// get by guestId (to restore guest session)
router.get("/guest/:guest", ctrl.getByGuest);

// get current user's saved runs
router.get("/me", authMiddleware, requireAuth, ctrl.getByUser);

// get by id 
router.get("/:id", ctrl.getById);

// update / delete (auth optional but checked in controller)
router.delete("/:id", optionalAuth, ctrl.remove);

router.post("/delete-guest", ctrl.deleteGuestResults);

// link guest results to user after login
router.post("/link-guest", authMiddleware, requireAuth, ctrl.linkGuestToUser);

export default router;
