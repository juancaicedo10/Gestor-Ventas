import { useEffect, useState } from "react";
import decodeToken from "../utils/tokenDecored";
import Sidebar from "./Sidebar";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../utils/Spinner";

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

  const string =
    role === "Administrador" ? `administradores/${Id}` : `vendedores/${Id}`;

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://backend-gestor-ventas.onrender.com/api/${string}`,
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
      await axios.put(
        `https://backend-gestor-ventas.onrender.com/api/${string}`,
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

  return (
    <section>
      <Sidebar />
      <div className="flex items-center justify-center h-dvh ml-[64px] px-2">
        {isLoading ? (
          <Spinner isLoading={true}/>
        ) : (
          <form
            action=""
            className="flex flex-col w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md border p-6 bg-white mx-2"
            onSubmit={handleUpdate}
          >
            <h1 className="text-center font-bold text-4xl text-blue-800 pb-3">
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
              className={`w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg my-4 ${
                isLoading
                  ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900 text-white"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Cargado..." : "Actualizar Perfil"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Perfil;
