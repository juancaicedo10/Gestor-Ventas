import { useEffect, useMemo, useState } from "react";
import {
  PowerSettingsNew,
  DevicesOther,
  Memory,
  Person,
  DeleteOutline,
  EditNote,
  PhoneAndroid,
  Computer,
  WarningAmber,
} from "@mui/icons-material";

import Spinner from "../../utils/Spinner";
import Sidebar from "../Sidebar";
import HttpClient from "../../Services/httpService";
import { toast } from "react-toastify";
import Select from "react-select";
import decodeToken from "../../utils/tokenDecored";
import ConfirmationModal from "../Shared/ConfirmationModal";
import DeviceAliasModal from "./DeviceAliasModal";

type Dispositivo = {
  Id: string;
  VendedorId: number | null;
  AdministradorId: number | null;
  NombreVendedor: string | null;
  NombreAdministrador: string | null;
  Autorizado: boolean;
  DeviceModel: string;
  DeviceOs: string;
  DeviceIndexedDbId?: string;
  NombreAlias: string | null;
  Notas: string | null;
  TipoEquipo: string | null;
  FechaRegistro?: string;
  FechaUltimoAcceso?: string | null;
  FechaAutorizacion?: string | null;
  NombreAutorizador?: string | null;
  Rol: "Vendedor" | "Administrador";
};

type FiltroTab = "todos" | "pendientes" | "autorizados";

type AliasModalState =
  | { mode: "enable"; device: Dispositivo }
  | { mode: "edit"; device: Dispositivo }
  | null;

const getNombreUsuario = (d: Dispositivo) =>
  d.Rol === "Vendedor" ? d.NombreVendedor : d.NombreAdministrador;

const getUserKey = (d: Dispositivo) =>
  `${d.Rol}-${d.VendedorId ?? d.AdministradorId}`;

const formatFecha = (fecha?: string | null) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const DeviceIcon = ({ tipo, os }: { tipo?: string | null; os?: string }) => {
  const esCel =
    tipo === "CELULAR" || os === "Android" || os === "iOS";
  return esCel ? (
    <PhoneAndroid className="text-quaternary" />
  ) : (
    <Computer className="text-quaternary" />
  );
};

export default function ViewDevices() {
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filtroTab, setFiltroTab] = useState<FiltroTab>("todos");
  const [aliasModal, setAliasModal] = useState<AliasModalState>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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
        }/all`
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

  const disableDevice = async (id: string) => {
    await HttpClient.put(
      `${import.meta.env.VITE_API_URL}/api/dispositivos/${id}/disable`
    );
    await getDevices();
    toast.success("Dispositivo deshabilitado");
  };

  const enableDevice = async (id: string, nombreAlias: string, notas: string) => {
    await HttpClient.put(
      `${import.meta.env.VITE_API_URL}/api/dispositivos/${id}/enable`,
      { NombreAlias: nombreAlias, Notas: notas }
    );
    await getDevices();
    toast.success("Dispositivo autorizado correctamente");
  };

  const updateAlias = async (id: string, nombreAlias: string, notas: string) => {
    await HttpClient.put(
      `${import.meta.env.VITE_API_URL}/api/dispositivos/${id}/alias`,
      { NombreAlias: nombreAlias, Notas: notas }
    );
    await getDevices();
    toast.success("Nombre actualizado");
  };

  const handleToggle = (device: Dispositivo) => {
    if (device.Autorizado) {
      disableDevice(device.Id);
    } else {
      setAliasModal({ mode: "enable", device });
    }
  };

  useEffect(() => {
    getUsers();
    getDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      if (filtroTab === "pendientes") return !d.Autorizado;
      if (filtroTab === "autorizados") return d.Autorizado;
      return true;
    });
  }, [devices, filtroTab]);

  const groupedDevices = useMemo(() => {
    const map = new Map<string, { nombre: string; rol: string; items: Dispositivo[] }>();
    filteredDevices.forEach((d) => {
      const key = getUserKey(d);
      const nombre = getNombreUsuario(d) || "Sin nombre";
      if (!map.has(key)) {
        map.set(key, { nombre, rol: d.Rol, items: [] });
      }
      map.get(key)!.items.push(d);
    });
    return Array.from(map.entries()).sort((a, b) =>
      a[1].nombre.localeCompare(b[1].nombre)
    );
  }, [filteredDevices]);

  const pendientesCount = devices.filter((d) => !d.Autorizado).length;

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="w-full overflow-y-hidden min-h-screen bg-[#F2F2FF]">
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        url={`${import.meta.env.VITE_API_URL}/api/dispositivos/${deleteId}`}
        getData={getDevices}
        text="¿Eliminar este dispositivo? Esta acción no se puede deshacer."
        archivada={() => toast.success("Dispositivo eliminado")}
      />

      <DeviceAliasModal
        isOpen={!!aliasModal}
        onClose={() => setAliasModal(null)}
        title={
          aliasModal?.mode === "enable"
            ? "Autorizar dispositivo"
            : "Editar nombre del dispositivo"
        }
        confirmLabel={
          aliasModal?.mode === "enable" ? "Autorizar" : "Guardar cambios"
        }
        initialAlias={aliasModal?.device.NombreAlias ?? ""}
        initialNotas={aliasModal?.device.Notas ?? ""}
        deviceInfo={
          aliasModal
            ? `${aliasModal.device.DeviceModel} · ${aliasModal.device.DeviceOs}`
            : undefined
        }
        onConfirm={async (nombreAlias, notas) => {
          if (!aliasModal) return;
          if (aliasModal.mode === "enable") {
            await enableDevice(aliasModal.device.Id, nombreAlias, notas);
          } else {
            await updateAlias(aliasModal.device.Id, nombreAlias, notas);
          }
        }}
      />

      <Sidebar />
      <div className="flex flex-col ml-[64px]">
        <header className="w-full bg-white text-primary px-4 py-6 shadow-md mb-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-2">
            Dispositivos
          </h1>
          <p className="text-center text-gray-500 text-sm mb-4">
            Asigne un nombre a cada equipo para saber cuál es de trabajo antes
            de autorizar.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {(
              [
                ["todos", "Todos"],
                ["pendientes", `Pendientes (${pendientesCount})`],
                ["autorizados", "Autorizados"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFiltroTab(key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  filtroTab === key
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Select
            options={users}
            placeholder="Filtrar por usuario"
            isClearable
            className="max-w-xl mx-auto text-black"
            onChange={(option) => {
              if (option) getDeviceByUser(option.value);
              else getDevices();
            }}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </header>

        <div className={`w-full px-4 pb-8 ${isLoading ? "min-h-[50vh]" : ""}`}>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner isLoading={isLoading} />
            </div>
          ) : groupedDevices.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-12">
              No hay dispositivos en este filtro.
            </p>
          ) : (
            <div className="space-y-4 max-w-6xl mx-auto">
              {groupedDevices.map(([key, group]) => {
                const pendientesGrupo = group.items.filter((d) => !d.Autorizado).length;
                const expanded = expandedGroups[key] !== false;

                return (
                  <section
                    key={key}
                    className="bg-white rounded-xl shadow-md overflow-hidden border"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 text-left"
                      onClick={() => toggleGroup(key)}
                    >
                      <div className="flex items-center gap-3">
                        <Person className="text-primary" />
                        <div>
                          <h2 className="text-lg font-bold text-primary">
                            {group.nombre}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {group.rol} · {group.items.length} equipo
                            {group.items.length !== 1 ? "s" : ""}
                            {pendientesGrupo > 0 && (
                              <span className="ml-2 text-red-600 font-semibold">
                                · {pendientesGrupo} pendiente
                                {pendientesGrupo !== 1 ? "s" : ""}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-primary font-bold text-xl">
                        {expanded ? "−" : "+"}
                      </span>
                    </button>

                    {expanded && (
                      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.items.map((device) => (
                          <li
                            key={device.Id}
                            className={`rounded-xl border overflow-hidden ${
                              !device.Autorizado
                                ? "border-amber-400 ring-1 ring-amber-200"
                                : "border-gray-200"
                            }`}
                          >
                            {!device.Autorizado && (
                              <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1">
                                <WarningAmber fontSize="small" />
                                Pendiente de autorización
                              </div>
                            )}

                            <div className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-start gap-2 min-w-0">
                                  <DeviceIcon
                                    tipo={device.TipoEquipo}
                                    os={device.DeviceOs}
                                  />
                                  <div className="min-w-0">
                                    <h3 className="font-bold text-primary text-base truncate">
                                      {device.NombreAlias ||
                                        "(Sin nombre — asigne uno)"}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                      {device.TipoEquipo || "OTRO"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    type="button"
                                    title="Editar nombre"
                                    onClick={() =>
                                      setAliasModal({ mode: "edit", device })
                                    }
                                    className="p-1 rounded-full hover:bg-gray-100 text-primary"
                                  >
                                    <EditNote fontSize="small" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggle(device)}
                                    title={
                                      device.Autorizado
                                        ? "Desactivar"
                                        : "Autorizar"
                                    }
                                    className={`p-1 rounded-full ${
                                      device.Autorizado
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-green-600 hover:bg-green-50"
                                    }`}
                                  >
                                    <PowerSettingsNew fontSize="small" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteId(device.Id)}
                                    className="p-1 rounded-full text-red-500 hover:bg-red-50"
                                  >
                                    <DeleteOutline fontSize="small" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-1.5 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <DevicesOther fontSize="small" />
                                  <span className="truncate">
                                    {device.DeviceModel}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Memory fontSize="small" />
                                  <span>{device.DeviceOs}</span>
                                </div>
                                {device.Notas && (
                                  <p className="text-xs italic border-l-2 border-quaternary pl-2">
                                    {device.Notas}
                                  </p>
                                )}
                                <p className="text-xs text-gray-400">
                                  Registro: {formatFecha(device.FechaRegistro)}
                                  {device.FechaUltimoAcceso && (
                                    <> · Último acceso: {formatFecha(device.FechaUltimoAcceso)}</>
                                  )}
                                </p>
                                {device.Autorizado && device.NombreAutorizador && (
                                  <p className="text-xs text-green-700">
                                    Autorizado por {device.NombreAutorizador}
                                    {device.FechaAutorizacion &&
                                      ` · ${formatFecha(device.FechaAutorizacion)}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
