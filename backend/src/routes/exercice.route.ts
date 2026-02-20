import { Router } from "express";
import * as exerciceController from "../controllers/exercices.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, exerciceController.createGame);
router.get("/", exerciceController.getAllGames);
router.get("/:id", exerciceController.getGameById);
router.put("/:id", authMiddleware, exerciceController.updateGame);
router.delete("/:id", authMiddleware, exerciceController.deleteGame);


export default router
