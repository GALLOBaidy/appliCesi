import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store"; // ou AsyncStorage si tu l’utilises

export const api = axios.create({
  baseURL: "http://10.176.138.118:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  // ou AsyncStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config.url !== "/login") {
      router.replace("/(public)/login");
    }
    throw error;
  },
);
