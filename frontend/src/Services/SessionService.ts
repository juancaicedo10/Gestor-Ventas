import { BehaviorSubject } from "rxjs";

const tokenSubject = new BehaviorSubject<string | null>(
  localStorage.getItem("token")
);
////
let channel: BroadcastChannel | null = null;
let isInitialized = false;

const init = () => {
  if (isInitialized) return;
  isInitialized = true;

  channel = new BroadcastChannel("session");

  channel.onmessage = (event) => {
    const { type, token } = event.data || {};


    console.log("Mensaje recibido en el canal de sesión:", type, token);

    if (type === "logout") {
      localStorage.removeItem("token");
      tokenSubject.next(null);
      window.location.href = "/"; // Redirige al login
    } else if (type === "login") {
      localStorage.setItem("token", token);


      tokenSubject.next(token);
    }
  };
};

export const SessionService = {
  init,
  token$: tokenSubject.asObservable(),

  setToken: (token: string) => {
    localStorage.setItem("token", token);
    tokenSubject.next(token);
    channel?.postMessage({ type: "login", token });
  },

  clearToken: () => {
    localStorage.removeItem("token");
    tokenSubject.next(null);

    localStorage.setItem("sessionExpired", "true");

    console.log("📤 Enviando mensaje de logout...", channel);
    channel?.postMessage({ type: "logout" });
  },

  getCurrentToken: () => tokenSubject.getValue(),
};
