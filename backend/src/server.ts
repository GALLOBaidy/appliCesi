import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.route";
import exercicesRoutes from "./routes/exercice.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mes routes
app.use("/users", userRoutes);
app.use("/games", exercicesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ error: err.message });
});
export default app;
