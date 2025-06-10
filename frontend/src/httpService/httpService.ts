// src/api/axiosClient.js
import axios from "axios";

const HttpClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // Cambia esto a tu API real
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de respuesta
HttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("Interceptado:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        console.log("No autorizado, redirigiendo a login");
        // Aquí puedes redirigir al usuario a la página de login
        // Por ejemplo, usando React Router:
        // window.location.href = '/login';
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
