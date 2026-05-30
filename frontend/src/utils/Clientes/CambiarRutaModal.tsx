import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import decodeToken from "../tokenDecored";
import HttpClient from "../../Services/httpService";
import Spinner from "../Spinner";
import TrasladosRutaHistorial from "./TrasladosRutaHistorial";

interface ModalProps {
  isOpen: boolean;
  ClienteId: number;
  nombreCliente?: string;
  vendedorActualId?: number;
  onClose: () => void;
  getClients: () => void;
}

interface Vendedor {
  Id: number;
  NombreCompleto: string;
}

interface VendedorOption {
  value: number;
  label: string;
}

const CambiarRutaModal: React.FC<ModalProps> = ({
  isOpen,
  ClienteId,
  nombreCliente,
  vendedorActualId,
  onClose,
  getClients,
}) => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [nuevoVendedor, setNuevoVendedor] = useState<VendedorOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [historialKey, setHistorialKey] = useState<number>(0);

  const adminId = decodeToken()?.user?.Id;

  const getVendedores = async () => {
    try {
      setIsLoading(true);
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${adminId}/all`
      );
      setVendedores(res.data || []);
    } catch (error) {
      console.error("Error obteniendo vendedores:", error);
      toast.error("No se pudieron cargar los vendedores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNuevoVendedor(null);
      getVendedores();
    }
  }, [isOpen]);

  const vendedorOptions: VendedorOption[] = vendedores
    .filter((v) => v.Id !== vendedorActualId)
    .map((v) => ({ value: v.Id, label: v.NombreCompleto }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nuevoVendedor) {
      toast.warn("Selecciona un vendedor para asignar la nueva ruta");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await HttpClient.patch(
        `${import.meta.env.VITE_API_URL}/api/clientes/cambiar-ruta`,
        {
          ClienteId,
          NuevoVendedorId: nuevoVendedor.value,
        }
      );

      const trasladadas = res.data?.data?.VentasTrasladadas ?? 0;
      toast.success(
        `Cliente trasladado a ${nuevoVendedor.label}. Ventas activas reasignadas: ${trasladadas}`
      );
      getClients();
      setNuevoVendedor(null);
      setHistorialKey((prev) => prev + 1);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Ocurrió un error al cambiar la ruta del cliente";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <form
          onSubmit={handleSubmit}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <header className="flex justify-between items-center mb-4">
              <h5 className="font-bold text-xl sm:text-xl md:text-lg xl:text-3xl text-primary">
                Cambiar de Ruta
              </h5>
              <button
                type="button"
                onClick={onClose}
                className="text-4xl font-normal text-gray-500 hover:text-gray-900"
              >
                &times;
              </button>
            </header>

            {nombreCliente && (
              <p className="text-base font-normal text-gray-600 mb-4">
                Reasignar a{" "}
                <span className="font-semibold text-gray-800">
                  {nombreCliente}
                </span>{" "}
                a un nuevo vendedor. Sus ventas activas se trasladarán a la
                ruta del nuevo vendedor.
              </p>
            )}

            {isLoading ? (
              <div className="w-full h-[220px] flex items-center justify-center">
                <Spinner isLoading={true} />
              </div>
            ) : (
              <label className="block text-base md:text-lg font-normal mb-2">
                <span className="text-gray-600">Nuevo vendedor:</span>
                <Select
                  id="nuevoVendedor"
                  options={vendedorOptions}
                  value={nuevoVendedor}
                  placeholder="Seleccione un vendedor"
                  onChange={(option) =>
                    setNuevoVendedor(option as VendedorOption)
                  }
                  isSearchable
                  isDisabled={isSubmitting}
                  maxMenuHeight={180}
                  menuPlacement="auto"
                  className="w-full mt-1"
                  noOptionsMessage={() => "No hay vendedores disponibles"}
                />
              </label>
            )}

            <div className="mt-4 border-t border-gray-100 pt-3">
              <h6 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Historial de traslados
              </h6>
              <TrasladosRutaHistorial
                ClienteId={ClienteId}
                refreshKey={historialKey}
              />
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !nuevoVendedor}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fifth sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                ></div>
              ) : (
                "Confirmar traslado"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarRutaModal;
