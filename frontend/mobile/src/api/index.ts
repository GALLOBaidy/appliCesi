import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const api = axios.create({
  baseURL: "http://10.176.138.118:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// REQUEST INTERCEPTOR
// ----------------------
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync("userToken");

    if (token) {
      // Axios v1 : headers est un AxiosHeaders
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ----------------------
// RESPONSE INTERCEPTOR
// ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Token plus valide 
    if (error.response?.status === 401) {
      // On supprime le user et token stocké
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("user");

      // Redirection vers login 
      router.replace("/(public)/login");
    }
    throw error;
  }
);
