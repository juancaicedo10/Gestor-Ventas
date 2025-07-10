// src/api/axiosClient.js

import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken");

const HttpClient = axios.create({
  baseURL: "", // Cambia esto a tu API real
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "Refresh-Token": refreshToken ? `${refreshToken}` : "",
  },
});


// Retry logic
const MAX_RETRIES = 3;

HttpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Retry on timeout
    if (
      error.code === "ECONNABORTED" &&
      error.message.includes("timeout") &&
      !originalRequest._retryCount
    ) {
      originalRequest._retryCount = 1;
    }

    if (
      error.code === "ECONNABORTED" &&
      error.message.includes("timeout") &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount += 1;
      console.warn(`Reintentando por timeout... intento #${originalRequest._retryCount}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // espera 1 segundo
      return HttpClient(originalRequest);
    }

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Sesión expirada, por favor inicia sesión nuevamente.");
        window.location.href = "/";
      }
    } else if (error.request) {
      console.warn("Error sin respuesta del servidor");
      toast.warn("Servidor no responde. Intentando reconectar...");
    } else {
      console.error("Error al configurar la petición:", error.message);
    }

    return Promise.reject(error);
  }
);

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default HttpClient;
