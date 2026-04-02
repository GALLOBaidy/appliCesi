import axios from "axios";
import { router } from "expo-router";

export const api = axios.create({
  baseURL: "http://10.176.138.118:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expiré ou invalide
    if (error.response?.status === 401 && error.config.url !== "/login") {
      // Redirection vers login
      router.replace("/(public)/login");
    }
    throw error;
  },
);
