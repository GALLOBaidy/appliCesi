import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ error: err.message });
});
export default app;