import { useEffect, useState } from "react";
import decodeToken from "../utils/tokenDecored";
import Sidebar from "./Sidebar";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../utils/Spinner";
import HttpClient from "../Services/httpService";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { startRegistration } from "@simplewebauthn/browser";
import { toast } from "react-toastify";

function Perfil() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contraseña, setPassword] = useState("");
  const [oficinaId, setOficinaId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  let error = false;

  const tokenData = decodeToken();
  const Id = tokenData?.user?.Id || "";
  const role = tokenData?.user?.role || "";

  const isAdimn = role === "Administrador";

  const string =
    role === "Administrador" ? `administradores/${Id}` : `vendedores/${Id}`;

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/${string}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setNombre(data.NombreCompleto || "");
      setCorreo(data.Correo || "");
      setTelefono(data.Telefono || "");
      setCedula(data.NumeroDocumento || "");
      setDireccion(data.Direccion || "");
      setPassword(data.Contraseña || "");

      console.log("Datos: ", data);

      console.log(
        "Seteados: ",
        nombre,
        correo,
        telefono,
        cedula,
        direccion,
        oficinaId
      );

      console.log(
        "Data cada uno: ",
        data.NombreCompleto,
        data.CorreoElectronico,
        data.Telefono,
        data.NumeroDocumento,
        data.Direccion,
        data.OficinaId
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "nombre":
        setNombre(value);
        break;
      case "correo":
        setCorreo(value);
        break;
      case "telefono":
        setTelefono(value);
        break;
      case "cedula":
        setCedula(value);
        break;
      case "direccion":
        setDireccion(value);
        break;
      case "oficinaId":
        setOficinaId(Number(value));
        break;
      case "contraseña":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/${string}`,
        {
          NombreCompleto: nombre,
          NumeroDocumento: cedula,
          TipoDocumento: 1,
          Telefono: telefono,
          Correo: correo,
          Direccion: direccion,
          Contraseña: contraseña,
          OficinaId: oficinaId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("User updated successfully");
      getData();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleRegisterFingerPrint = async () => {
    try {
      const res = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/fingerprint/register/options`,
        {
          userId: Id,
          userName: correo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const options = await res.data;

      console.log("Options received:", options);

      const attestationResponse = await startRegistration(options);

      const resp2 = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/fingerprint/register/verify`,
        {
          userId: Id,
          attestationResponse,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (resp2.data.verified) {
        console.log("Fingerprint registered successfully");
        toast.success("Huella registrada correctamente");
      }
    } catch (error) {
      console.error("Error adding fingerprint:", error);
    }
  };

  return (
    <section className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4">
        {isLoading ? (
          <Spinner isLoading={true} />
        ) : (
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <h1 className="text-3xl font-bold text-secondary text-center mb-6">
              Tu Perfil
            </h1>

            {/* Grupo de campos */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  disabled={!isAdimn}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={correo}
                  onChange={handleChange}
                  disabled={!isAdimn}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={telefono}
                  onChange={handleChange}
                  disabled={!isAdimn}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="cedula"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cédula
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={cedula}
                  onChange={handleChange}
                  disabled={!isAdimn}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label
                  htmlFor="direccion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={direccion}
                  onChange={handleChange}
                  disabled={!isAdimn}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              {/* Contraseña con toggle */}
              <div>
                <label
                  htmlFor="contraseña"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="contraseña"
                    value={contraseña}
                    onChange={handleChange}
                    disabled={!isAdimn}
                    className={`mt-1 w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                      error
                        ? "border-red-500"
                        : "border-gray-300 focus:ring-secondary"
                    }`}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* Botón de huella */}
            <div className="flex justify-center mt-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRegisterFingerPrint();
                }}
                className="flex items-center gap-2 px-4 py-3 bg-secondary hover:bg-primary text-white font-semibold rounded-md shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                <FingerprintIcon className="text-white text-xl" />
                <span>Registrar huella</span>
              </button>
            </div>

            {/* Botón de actualizar */}
            <button
              type="submit"
              className={`w-full mt-6 py-3 text-white font-bold rounded-lg transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-secondary hover:bg-primary"
              }`}
              disabled={isLoading || !isAdimn}
            >
              {isLoading
                ? "Cargando..."
                : !isAdimn
                ? "No permitido"
                : "Actualizar Perfil"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Perfil;
