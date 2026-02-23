// routes/userExercice.routes.ts
import { Router } from "express";
import * as ctrl from "../controllers/userGame.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// public: create a run (guest or logged)
router.post("/", optionalAuth, ctrl.create);

// get by id (public)
router.get("/:id", ctrl.getById);

// get current user's saved runs
router.get("/me", requireAuth, ctrl.getByUser);

// get by guestId (to restore guest session)
router.get("/", ctrl.getByGuest);

// update / delete (auth optional but checked in controller)
// router.patch("/:id", optionalAuth, ctrl.update);
router.delete("/:id", optionalAuth, ctrl.remove);

// link guest results to user after login
router.post("/link-guest", requireAuth, ctrl.linkGuestToUser);

export default router;
