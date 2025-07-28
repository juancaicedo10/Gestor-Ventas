import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import httpClient from "../Services/httpService";
import * as UAParserLib from "ua-parser-js";
import DefaultModal from "./Shared/DefaultModal";
import { SessionService } from "../Services/SessionService";
import { addNewDevice, getDevice } from "../Services/indexedDB";
import { v4 as uuidv4 } from "uuid";
import { startAuthentication } from "@simplewebauthn/browser";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");

  const [showSessionExpiredModal, setShowSessionExpiredModal] =
    useState<boolean>(false);

  useEffect(() => {
    const expired = localStorage.getItem("sessionExpired");
    if (expired === "true") {
      setShowSessionExpiredModal(true);
      localStorage.removeItem("sessionExpired");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.target);

    const userAgent = UAParserLib.UAParser(navigator.userAgent);

    const deviceInfo = {
      device: userAgent.device,
      browser: userAgent.browser,
      os: userAgent.os,
    };

    const device = await getDevice();
    let storedDevice;
    let newDevice;
    if (device) {
      storedDevice = device;
    } else {
      const id = uuidv4();

      newDevice = await addNewDevice({
        Name: userAgent.device.model ?? "",
        OperativeSystem: userAgent.os.name ?? "",
        DeviceId: id,
      });
    }

    const data = {
      correo: form.get("correo"),
      contraseña: form.get("contraseña"),
      ...deviceInfo,
      deviceId: storedDevice ? storedDevice.DeviceId : newDevice!.DeviceId,
    };

    try {
      const response = await httpClient.post(
        `${import.meta.env.VITE_API_URL}/login`,
        data
      );
      console.log("Login correcto");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      SessionService.setToken(response.data.token);
      navigate("/clientes");
    } catch (error) {
      console.log(error, "error login");
      if (
        (error as any).response &&
        (error as any).response !== null &&
        (error as any).response.status === 500
      ) {
        setError("Correo o contraseña incorrectos");
        console.error("Error en el login", error);
      } else if (
        (error as any).response &&
        (error as any).response !== null &&
        (error as any).response.status === 405
      ) {
        setError(
          "Este dispositivo no está autorizado por favor contacte con el administrador"
        );
      } else {
        setError(
          "Ocurrió un error en el servidor, por favor intente más tarde"
        );
      }
    } finally {
      setIsLoading(false);

      const userAgent = UAParserLib.UAParser(navigator.userAgent);

      const deviceInfo = {
        device: userAgent.device,
        browser: userAgent.browser,
        os: userAgent.os,
      };

      console.log("Device Info:", deviceInfo);
      // Aquí puedes enviar deviceInfo a tu backend si es necesario
    }
  };

  const handleChange = (e: any) => {
    if (e.target.value === "") {
      setError(null);
    }
    setPassword(e.target.value);
  };

  const handleFilterPrintLogin = async () => {
    const response = await httpClient.post(
      `${import.meta.env.VITE_API_URL}/login/fingerprint/start`,
      {
        correo: correo,
        contraseña: password,
      }
    );
    const assertion = await startAuthentication(response.data.options);

    const verifyResponse = await httpClient.post(
      `${import.meta.env.VITE_API_URL}/login/fingerprint/verify`,
      {
        assertion: assertion,
 
      }
    );

    if (verifyResponse.data.verified) {
      localStorage.setItem("token", verifyResponse.data.token);
      localStorage.setItem("refreshToken", verifyResponse.data.refreshToken);
      SessionService.setToken(verifyResponse.data.token);
      navigate("/clientes");
    } else {
      setError("Error al iniciar sesión con huella digital");
    }
  };
  return (
    <>
      {showSessionExpiredModal && (
        <DefaultModal
          title="Sesión expirada"
          message="Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente."
          onClose={() => setShowSessionExpiredModal(false)}
        />
      )}
      <div className="w-full h-lvh flex flex-col justify-center items-center px-2">
        <h2 className="font-extrabold text-6xl py-5 text-primary">
          Bienvenido
        </h2>
        <form
          action=""
          className="p-2 sm:w-1/2 md:min-w-1/2 lg:w-1/4 flex flex-col items-center justify-center w-full rounded-md border-2 border-gray-300 shadow-lg bg-white"
          onSubmit={handleSubmit}
        >
          <h3 className="text-3xl font-bold py-4 text-secondary">
            Iniciar Sesion
          </h3>
          <label htmlFor="correo" className="text-lg w-full">
            Correo Electronico
          </label>
          <input
            type="email"
            name="correo"
            id="correo"
            onChange={(e) => {
              setCorreo(e.target.value);
            }}
            className={`p-2 mb-4 border-2 rounded-md w-full ${
              error ? "border-red-500" : ""
            }`}
            required
          />
          <label htmlFor="password" className="text-lg w-full">
            Contraseña
          </label>
          <div className="flex w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              name="contraseña"
              id="contraseña"
              onChange={handleChange}
              className={`p-2 border-2 w-full rounded-md ${
                error ? "border-red-500" : ""
              }`}
            />
            <button
              className="absolute right-0 p-2"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {password.length > 0 ? (
                showPassword ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )
              ) : null}
            </button>
          </div>
          {error && <p className="text-red-500 w-full">{error}</p>}
          <button
            type="submit"
            className={`w-full py-3 bg-secondary hover:bg-primary text-white font-bold rounded-lg my-4 ${
              isLoading
                ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                : "bg-secondary hover:bg-primary text-white"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Cargado..." : "Iniciar Sesion"}
          </button>
          <button
            type="button"
            className={`w-full py-3 bg-secondary hover:bg-primary text-white font-bold rounded-lg my-4 ${
              isLoading
                ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                : "bg-secondary hover:bg-primary text-white"
            }`}
            disabled={isLoading}
            onClick={handleFilterPrintLogin}
          >
            Iniciar con Huella Digital
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
