import { api } from "./axios.js";

// Connexion
export const loginAdmin = async (identifier, password) => {
  const { data } = await api.post("/login", { login: identifier, password });

  if (data.user.role !== "Admin") {
    throw new Error("NOT_ADMIN");
  }

  return data;
};

// Déconnexion
export const logout = () => api.post("/users/logout ");

// Les stats
export const getTotalUsers = () => api.get("/stats/users");
export const getTotalRuns = () => api.get("/stats/runs");
export const getRunsByDay = () => api.get("/stats/runs-by-day");
export const getFeelingsStats = () => api.get("/stats/feelings");

// Les Utilisateurs
export const getAllUsers = () => api.get("/users");
export const getOneUser = (id) => api.get(`/users/${id}`);
export const getCurrentUser = () => api.get("/users/me");
export const updateRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });
export const createUser = (payload) => api.post("/users", payload);
export const updateProfil = (payload) => api.put(`/users/me`, payload);
export const desactivate = (id, payload) =>
  api.patch(`/users/${id}/toggle`, payload);

// Les exos
export const getAllGames = () => api.get("/games");
export const getOneGame = (id) => api.get(`/games/${id}`);
export const updateGame = (id, payload) => api.put(`/games/${id}`, payload);
export const createGame = (payload) => api.post("/games", payload);
export const deleteGame = (id) => api.delete(`/games/${id}`);
export const toggleExerciseStatus = (id) => api.patch(`/games/${id}/status`);

// Table pivot
export const saveResult = (payload) => api.post("/user-exo", payload);
export const resultGuest = (guestId) =>
  api.get(`/user-exo/guest`, { params: { guestId } });
export const resultUser = (id) => api.get(`/user-exo/${id}`);
export const resultCurrentUser = () => api.get("/user-exo/me");
export const removeResult = (id) => api.delete(`/user-exo/${id}`);
export const giveUpResult = (payload) =>
  api.post("/user-exo/delete-guest", payload);
export const addResult = (payload) => api.post("/user-exo/link-guest", payload);
