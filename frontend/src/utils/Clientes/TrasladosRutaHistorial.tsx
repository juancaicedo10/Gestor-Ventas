import React, { useEffect, useState } from "react";
import HttpClient from "../../Services/httpService";
import { FormatearFecha } from "../FormatearFecha";
import { formatDate } from "../Helpers/FormatDate";
import Spinner from "../Spinner";

interface Traslado {
  Id: number;
  ClienteId: number;
  NombreCliente: string;
  VendedorAnteriorId: number | null;
  NombreVendedorAnterior: string | null;
  VendedorNuevoId: number;
  NombreVendedorNuevo: string;
  AdminId: number;
  NombreAdmin: string;
  VentasTrasladadas: number;
  Fecha: string;
}

interface Props {
  ClienteId: number;
  refreshKey?: number;
}

const TrasladosRutaHistorial: React.FC<Props> = ({ ClienteId, refreshKey }) => {
  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTraslados = async () => {
    try {
      setIsLoading(true);
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/clientes/${ClienteId}/traslados`
      );
      setTraslados(res.data || []);
    } catch (error) {
      console.error("Error obteniendo historial de traslados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ClienteId) getTraslados();
  }, [ClienteId, refreshKey]);

  if (isLoading) {
    return (
      <div className="w-full h-[120px] flex items-center justify-center">
        <Spinner isLoading={true} />
      </div>
    );
  }

  if (traslados.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-2">
        Este cliente no tiene traslados de ruta registrados.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
      {traslados.map((t) => (
        <li
          key={t.Id}
          className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 font-medium truncate max-w-[40%]">
                {t.NombreVendedorAnterior || "Sin asignar"}
              </span>
              <span className="text-gray-400 font-bold shrink-0">→</span>
              <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 font-medium truncate max-w-[40%]">
                {t.NombreVendedorNuevo}
              </span>
            </div>
            <span className="shrink-0 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {t.VentasTrasladadas}{" "}
              {t.VentasTrasladadas === 1 ? "venta" : "ventas"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>
              Por: <span className="font-medium text-gray-700">{t.NombreAdmin}</span>
            </span>
            <span>
              {formatDate(t.Fecha)} · {FormatearFecha(t.Fecha)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrasladosRutaHistorial;
