import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { login } from "../controllers/auth.controller";

const router = Router();

router.post("/",  userController.createUser);
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: (req as any).user });
});
router.post("/login", login); 


export default router;
