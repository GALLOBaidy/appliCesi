import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import exercicesRoutes from "./routes/exercice.route.js";
import userExoRoute from "./routes/userGame.route.js";
import { login } from "./controllers/auth.controller.js";
import statsRoutes from "./routes/stats.route.js";
import contentRoutes from "./routes/mentalHealthContent.routes.js";
import { swaggerSpec, swaggerUiMiddleware } from "./swagger.js";
const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));
app.use("/login", login);
// Mes routes
app.use("/users", userRoutes);
app.use("/games", exercicesRoutes);
app.use("/user-exo", userExoRoute);
app.use("/stats", statsRoutes);
app.use("/content", contentRoutes);
app.use((err, req, res, next) => {
    console.error(" ERROR:", err);
    res.status(500).json({ error: err.message });
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;
