import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import exercicesRoutes from "./routes/exercice.route";
import userExoRoute from "./routes/userGame.route";
import { login } from "./controllers/auth.controller";
import statsRoutes from "./routes/stats.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/login", login);

// Mes routes
app.use("/users", userRoutes);
app.use("/games", exercicesRoutes);
app.use("/user-exo", userExoRoute);
app.use("/stats", statsRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ error: err.message });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
