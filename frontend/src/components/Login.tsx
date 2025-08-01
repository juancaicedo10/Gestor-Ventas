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
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { useDeviceName } from "../utils/hooks/useDeviceName";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");

  const [showSessionExpiredModal, setShowSessionExpiredModal] =
    useState<boolean>(false);

  const deviceName = useDeviceName();

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

    const device = await getDevice();
    let storedDevice;
    let newDevice;
    if (device) {
      storedDevice = device;
    } else {
      const id = uuidv4();

      newDevice = await addNewDevice({
        Name: deviceName ?? "",
        OperativeSystem: userAgent.os.name ?? "",
        DeviceId: id,
      });
    }

    const data = {
      correo: form.get("correo"),
      contraseña: form.get("contraseña"),
      browser: userAgent.browser,
      os: userAgent.os,
      device: deviceName ?? "",
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

      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold text-primary mb-8 text-center">
          Bienvenido
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-secondary text-center mb-6">
            Iniciar Sesión
          </h3>

          {/* Correo */}
          <div className="mb-4">
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              id="correo"
              onChange={(e) => setCorreo(e.target.value)}
              className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-secondary"
              }`}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label
              htmlFor="contraseña"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contraseña"
                id="contraseña"
                onChange={handleChange}
                className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-secondary"
                }`}
                required
              />
              {password.length > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold text-white rounded-lg transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-primary"
            }`}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          {/* Separador */}
          <div className="my-4 text-center text-gray-500 text-sm">o</div>

          {/* Botón Huella Digital */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleFilterPrintLogin}
            className={`w-full py-3 font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-primary"
            }`}
          >
            <FingerprintIcon className="text-white" />
            Iniciar con Huella Digital
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
