// src/api/axiosClient.js

import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refreshToken");

const HttpClient = axios.create({
  baseURL: "", // Cambia esto a tu API real
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "Refresh-Token": refreshToken ? `${refreshToken}` : "",
  },
});

// Interceptor de respuesta
HttpClient.interceptors.response.use(
  (response) => {
    console.log(response.headers);
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Interceptado:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        console.log("No autorizado, redirigiendo a login");
        localStorage.removeItem("token");
        
        window.location.href = "/";
        
        toast.error("Sesión expirada, por favor inicia sesión nuevamente.");
        // Aquí podrías mostrar un mensaje de error o redirigir al usuario a la página de inicio de sesión
      }
    } else if (error.request) {
      console.log("Error sin respuesta del servidor");
    } else {
      console.log("Error al configurar la petición:", error.message);
    }

    return Promise.reject(error); // ¡Importante!
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
