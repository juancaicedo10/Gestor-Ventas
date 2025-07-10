import { SessionService } from "./SessionService";

let inactivityTimeout: ReturnType<typeof setTimeout>;
//
const handleInactivity = () => {
  console.log("🔒 Usuario inactivo: cerrando sesión");
  SessionService.clearToken();

  localStorage.removeItem("token");
  localStorage.setItem("sessionExpired", "true");

  window.location.href = "/"; // Redirige al login
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  console.log("🌀 Temporizador reiniciado");

  inactivityTimeout = setTimeout(() => {
    handleInactivity();
  }, 5 * 60 * 1000);
};

export const startInactivityMonitoring = () => {
  console.log("▶️ Iniciando monitoreo de inactividad");
  resetInactivityTimer();

  ["mousemove", "keydown", "scroll", "click"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
    console.log(`✅ Escuchando: ${event}`);
  });

  ["touchstart", "touchmove", "touchend"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
    console.log(`✅ Escuchando: ${event}`);
  });
};

export const stopInactivityMonitoring = () => {
  console.log("⏹️ Deteniendo monitoreo de inactividad");
  clearTimeout(inactivityTimeout);

  ["mousemove", "keydown", "scroll", "click"].forEach((event) => {
    window.removeEventListener(event, resetInactivityTimer);
  });

  // Eliminar eventos para dispositivos táctiles/móviles
  ["touchstart", "touchmove", "touchend"].forEach((event) => {
    window.removeEventListener(event, resetInactivityTimer);
  });
};
