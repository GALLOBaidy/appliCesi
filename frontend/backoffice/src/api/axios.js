import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est expiré ou invalide
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      globalThis.location.href = "/";
    }

    return Promise.reject(error);
  },
);
