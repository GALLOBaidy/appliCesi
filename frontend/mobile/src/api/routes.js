import { api } from "./index";

// Connexion
export const loginUser = (identifier, password) =>
  api.post("/login", { login: identifier, password });
export const logoutUser = () => api.post("/users/logout");

// Les contenus
export const getContents = () => api.get("/content/public/active");
export const getOneContent = (id) => api.get(`/content/${id}`);

// Les exos
export const getAllGames = () => api.get("/games");
export const getOneGame = (id) => api.get(`/games/${id}`);

// Profil User
export const getCurrentUser = () => api.get("/users/me");
export const createUser = (payload) => api.post("/users", payload);
export const updateProfil = (payload) => api.put(`/users/me`, payload);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Résultats
export const getMyResult = () => api.get("/user-exo/me");
export const getOneResult = (id) => api.get(`/user-exo/${id}`);
export const resultGuest = (guest) => api.get(`/user-exo/guest/${guest}`);
export const saveOneResult = (payload) => api.post("/user-exo", payload);
export const saveResults = (payload) =>
  api.post("/user-exo/link-guest", payload);
export const deleteResults = (payload) =>
  api.post("/user-exo/delete-guest", payload);
export const deleteOneResult = (id) => api.delete(`/user-exo/${id}`);
