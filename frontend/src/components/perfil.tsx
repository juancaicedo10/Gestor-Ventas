import { useEffect, useState } from "react";
import decodeToken from "../utils/tokenDecored";
import Sidebar from "./Sidebar";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../utils/Spinner";
import HttpClient from "../Services/httpService";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { startRegistration } from "@simplewebauthn/browser";

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

      console.log(resp2);
    } catch (error) {
      console.error("Error adding fingerprint:", error);
    }
  };

  return (
    <section>
      <Sidebar />
      <div className="flex items-center justify-center h-dvh ml-[64px] px-2">
        {isLoading ? (
          <Spinner isLoading={true} />
        ) : (
          <>
            <form
              action=""
              className="flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md border p-6 bg-white mx-2"
              onSubmit={handleUpdate}
            >
              <h1 className="text-center font-bold text-4xl text-secondary pb-3">
                Tu Perfil
              </h1>
              <label htmlFor="nombre" className="font-normal text-base">
                Nombre
              </label>
              <input
                type="text"
                className="p-2 text-sm border-2 rounded-md mb-2"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                disabled={!isAdimn}
              />
              <label htmlFor="correo" className="font-normal text-base">
                Correo
              </label>
              <input
                type="email"
                className="p-2 text-sm border-2 rounded-md mb-2"
                name="correo"
                value={correo}
                onChange={handleChange}
                disabled={!isAdimn}
              />
              <label htmlFor="telefono" className="font-normal text-base">
                Telefono
              </label>
              <input
                type="tel"
                className="p-2 border-2 rounded-md text-sm mb-2"
                name="telefono"
                value={telefono}
                onChange={handleChange}
                disabled={!isAdimn}
              />
              <label htmlFor="cedula" className="font-normal text-base">
                Cédula
              </label>
              <input
                type="text"
                className="p-2 border-2 rounded-md text-sm mb-2"
                name="cedula"
                value={cedula}
                onChange={handleChange}
                disabled={!isAdimn}
              />
              <label htmlFor="direccion" className="font-normal text-base">
                Dirección
              </label>
              <input
                type="text"
                className="p-2 border-2 rounded-md text-sm mb-2"
                name="direccion"
                value={direccion}
                onChange={handleChange}
                disabled={!isAdimn}
              />
              <label htmlFor="contraseña" className="font-normal text-base">
                Contraseña
              </label>
              <div className="flex w-full relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="contraseña"
                  id="contraseña"
                  onChange={handleChange}
                  value={contraseña}
                  disabled={!isAdimn}
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
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}{" "}
                </button>
              </div>

              <button
                type="submit"
                className={`w-full py-3 bg-secondary hover:bg-primary text-white font-bold rounded-lg my-4 ${
                  isLoading
                    ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                    : "bg-secondary hover:bg-primary text-white"
                }`}
                disabled={
                  isLoading || decodeToken()?.user?.role !== "Administrador"
                }
              >
                {isLoading
                  ? "Cargado..."
                  : decodeToken()?.user?.role !== "Administrador"
                  ? "No permitido"
                  : "Actualizar Perfil"}
              </button>
            </form>
            <button className="mt-2" onClick={handleRegisterFingerPrint}>
              <FingerprintIcon className="text-secondary text-4xl" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default Perfil;
