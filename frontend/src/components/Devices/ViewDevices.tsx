import { useEffect, useState } from "react";
import {
  PowerSettingsNew,
  DevicesOther,
  Memory,
  Person,
} from "@mui/icons-material";

import Spinner from "../../utils/Spinner";
import Sidebar from "../Sidebar";
import HttpClient from "../../Services/httpService";
import { toast } from "react-toastify";
import Select from "react-select";
import decodeToken from "../../utils/tokenDecored";

type Dispositivo = {
  Id: number;
  VendedorId: number | null;
  AdministradorId: number | null;
  NombreVendedor: string | null;
  NombreAdministrador: string | null;
  Autorizado: boolean;
  DeviceModel: string;
  DeviceOs: string;
  Rol: "Vendedor" | "Administrador";
};

export default function ViewDevices() {
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const getDevices = async () => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/dispositivos/all`
      );
      setDevices(response.data);
    } catch (err) {
      console.error("Error loading devices", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceByUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/dispositivos/user/${userId}`
      );
      setDevices(response.data);
    } catch (err) {
      console.error("Error loading devices for user", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const resSellers = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${
          decodeToken()?.user?.Id
        }/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const resAdmins = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/administradores`
      );
      setUsers(
        [...resSellers.data, ...resAdmins.data].map((user) => ({
          value: user.Id,
          label: user.NombreCompleto,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDeviceState = async (id: number, currentState: boolean) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/dispositivos/${id}/${
        currentState ? "disable" : "enable"
      }`;
      await HttpClient.put(url);
      await getDevices(); // Actualiza el estado de todos
      toast.success(
        `Dispositivo ${
          currentState ? "deshabilitado" : "habilitado"
        } correctamente`
      );
    } catch (err) {
      console.error("Error toggling device state", err);
    }
  };

  useEffect(() => {
    getUsers();
    getDevices();
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col justify-start h-full ml-[64px]">
        <header className="w-full bg-white text-primary px-4 py-6 shadow-md mb-4 flex items-center justify-center flex-col">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-2">
            Dispositivos Registrados
          </h1>
          <Select
            options={users}
            placeholder="Seleccione un usuario"
            className="w-1/2 mx-4 text-xl text-black font-normal"
            onChange={(option) => {
              if (option) {
                getDeviceByUser(option.value);
              } else {
                getDevices();
              }
            }}
            menuPortalTarget={document.body} // Monta el menú en <body>
            menuPosition="fixed" // Evita problemas de posición
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Lo pone encima de todo
            }}
          />
        </header>

        <div
          className={`w-full flex items-center justify-center ${
            isLoading ? "h-screen" : ""
          }`}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <section className="w-full px-4 h-full">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {devices.map((device) => (
                  <li
                    key={device.Id}
                    className={`group p-0 rounded-xl border shadow-md bg-white hover:shadow-lg transition-shadow duration-200 relative overflow-hidden ${
                      selectedId === device.Id
                        ? "border-2 border-quaternary"
                        : ""
                    }`}
                  >
                    {/* Cabecera morada de la card */}
                    <div className="flex items-center justify-between p-3 bg-primary text-white">
                      <div className="flex items-center gap-2">
                        <Person
                          className="text-white bg-primary rounded-full p-1"
                          fontSize="medium"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">
                            {device.Rol === "Vendedor"
                              ? device.NombreVendedor
                              : device.NombreAdministrador}
                          </h2>
                          <p className="text-sm text-white/70">{device.Rol}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          toggleDeviceState(device.Id, device.Autorizado)
                        }
                        title={device.Autorizado ? "Desactivar" : "Activar"}
                        className={`rounded-full p-1 transition font-bold ${
                          device.Autorizado
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        <PowerSettingsNew />
                      </button>
                    </div>

                    {/* Cuerpo blanco con info */}
                    <div className="space-y-2 text-gray-700 text-sm p-4">
                      <div className="flex items-center gap-2">
                        <DevicesOther
                          className="text-quaternary"
                          fontSize="small"
                        />
                        <span>
                          <strong>Modelo:</strong> {device.DeviceModel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Memory className="text-quaternary" fontSize="small" />
                        <span>
                          <strong>Sistema:</strong> {device.DeviceOs}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-quaternary font-bold">
                          Estado:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            device.Autorizado
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {device.Autorizado ? "Autorizado" : "No autorizado"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 pt-2 border-t">
                        ID Dispositivo:{" "}
                        <span className="font-semibold">{device.Id}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
