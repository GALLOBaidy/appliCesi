import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://192.168.1.10:3000",
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
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("userToken");
    }
    throw error;
  }
);
