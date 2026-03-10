import { api } from "./axios.js";

export const loginAdmin = async (identifier, password) => {
  const { data } = await api.post("/login", { login: identifier, password });

  if (data.user.role !== "Admin") {
    throw new Error("NOT_ADMIN");
  }

  return data;
};

export const getTotalUsers = () => api.get("/stats/users");
export const getTotalRuns = () => api.get("/stats/runs");
export const getRunsByDay = () => api.get("/stats/runs-by-day");
export const getFeelingsStats = () => api.get("/stats/feelings");
