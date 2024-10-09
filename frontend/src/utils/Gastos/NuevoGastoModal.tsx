import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import decodeToken from "../tokenDecored";
import { toast } from "react-toastify";

interface Seller {
  Id: number;
  NombreCompleto: string;
}

interface TipoGasto {
  GastoId: number;
  Nombre: string;
  MontoMaximo: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshGastos: () => void;
  handleSearch: () => void;
}

const NuevoGastoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  refreshGastos,
  handleSearch,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(
    undefined
  );
  const [selectedTipoGasto, setSelectedTipoGasto] = useState<
    number | undefined
  >(undefined);
  const [fecha, setFecha] = useState<string>("");
  const [monto, setMonto] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [isFechaValid, setIsFechaValid] = useState<boolean>(true);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(true);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(true);
  const [isTipoGastoValid, setIsTipoGastoValid] = useState<boolean>(true);
  const [isSelectedSellerValid, setIsSelectedSellerValid] =
    useState<boolean>(true);
  const [montoMaximo, setMontoMaximo] = useState<number | undefined>(0);
  const [tiposGastos, setTiposGastos] = useState<TipoGasto[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const fetchSellers = async () => {
    const Url =
      decodeToken()?.user?.role === "Administrador"
        ? `https://backendgestorventas.azurewebsites.net/api/vendedores/${
            decodeToken()?.user?.Id
          }/all`
        : `https://backendgestorventas.azurewebsites.net/api/vendedores/${
            decodeToken()?.user?.Id
          }`;
    try {
      const response = await axios.get(`${Url}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (Array.isArray(response.data)) {
        setSellers(response.data);
      } else {
        setSellers([response.data]);
      }
    } catch (error) {
      console.error("Error obteniendo vendedores:", error);
    }
  };

  const fetchTiposGastos = async () => {
    try {
      const response = await axios.get(
        "https://backendgestorventas.azurewebsites.net/api/gastos/tipos"
      );
      setTiposGastos(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos de gastos:", error);
    }
  };

  const handleCreateGasto = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsDisabled(true);

    if (
      !fecha ||
      !monto ||
      !descripcion ||
      Number(monto) > montoMaximo! ||
      !selectedSeller ||
      !selectedTipoGasto
    ) {
      setIsFechaValid(!!fecha);
      setIsMontoValid(!!monto);
      setIsDescripcionValid(!!descripcion);
      setIsTipoGastoValid(!!selectedTipoGasto);
      setIsSelectedSellerValid(!!selectedSeller);
      setIsDisabled(false);

      return;
    }

    const gasto = {
      GastoId: selectedTipoGasto,
      VendedorId: selectedSeller,
      Fecha: new Date(fecha),
      Monto: Number(monto),
      Descripcion: descripcion,
    };

    try {
      await axios.post(
        "https://backendgestorventas.azurewebsites.net/api/gastos",
        gasto,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      refreshGastos();
      setIsDisabled(false);
      onClose();
      handleSearch();
      toast.success(
        decodeToken()?.user?.role === "Administrador"
          ? `Gasto registrado correctamente`
          : `Gasto enviado a aprobacion correctamente`
      );
    } catch (error) {
      console.error("Error creando gasto:", error);
      setIsDisabled(false);
      toast.error("Error registrando el gasto");
      onClose();
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchTiposGastos();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeller(undefined);
      setSelectedTipoGasto(undefined);
      setFecha("");
      setMonto("");
      setMontoMaximo(0);
      setDescripcion("");
      setSelectedSeller(undefined);
      setSelectedTipoGasto(undefined);
      setIsFechaValid(true);
      setIsMontoValid(true);
      setIsDescripcionValid(true);
      setIsTipoGastoValid(true);
      setIsSelectedSellerValid(true);
      setIsDisabled(false);
    }

    if (decodeToken()?.user?.role === "Vendedor") {
      setSelectedSeller(decodeToken()?.user?.Id);
      setIsSelectedSellerValid(true);
    }
  }, [isOpen]);

  const sellersOptions = sellers.map((seller) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const tiposGastosOptions = tiposGastos.map((tipo) => ({
    value: tipo.GastoId,
    label: tipo.Nombre,
    montoMaximo: tipo.MontoMaximo,
  }));

  return (
    isOpen && (
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
            onSubmit={handleCreateGasto}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <header className="flex w-full items-center justify-between">
                <h3
                  className="text-3xl leading-6 font-bold text-blue-900"
                  id="modal-title"
                >
                  Registrar Gasto
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-4xl text-gray-500 hover:text-gray-900"
                >
                  &times;
                </button>
              </header>
              <div className="block text-base md:text-lg font-normal mb-2 text-gray-700 mt-4">
                <label htmlFor="tiposGastos">Tipo Gasto:</label>
                <Select
                  id="tiposGastos"
                  options={tiposGastosOptions}
                  onChange={(selectedOption) => {
                    setSelectedTipoGasto(selectedOption?.value);
                    setMontoMaximo(selectedOption?.montoMaximo);
                  }}
                  isSearchable
                  maxMenuHeight={170}
                  menuPlacement="auto"
                />
              </div>
              {!isTipoGastoValid && (
                <p className="text-red-500 text-xs font-normal">
                  Este campo es obligatorio
                </p>
              )}
              <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                <label htmlFor="seller">Vendedor:</label>
                <Select
                  id="seller"
                  options={sellersOptions}
                  defaultValue={
                    decodeToken()?.user?.role === "Vendedor"
                      ? sellersOptions.find(
                          (option) => option.value === decodeToken()?.user?.Id
                        )
                      : null
                  }
                  onChange={(selectedOption) => {
                    setIsSelectedSellerValid(true);
                    setSelectedSeller(selectedOption?.value);
                  }}
                  isSearchable
                  isDisabled={decodeToken()?.user?.role === "Vendedor"}
                  maxMenuHeight={170}
                  menuPlacement="auto"
                />
                {!isSelectedSellerValid && (
                  <p className="text-red-500 text-xs">
                    Este campo es obligatorio
                  </p>
                )}
              </div>
              <section className="grid grid-cols-2 gap-4 mb-2">
                <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                  <label htmlFor="monto">Monto:</label>
                  <input
                    type="number"
                    id="monto"
                    className={`p-2 rounded-md border w-full ${
                      !isMontoValid ? "border-red-500" : ""
                    }`}
                    value={monto}
                    onChange={(e) => {
                      setMonto(e.target.value);
                      setIsMontoValid(true);
                    }}
                  />
                  {!isMontoValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                  {Number(monto) > montoMaximo! && selectedTipoGasto && (
                    <p className="text-red-500 text-xs">
                      El monto no puede ser mayor al monto máximo permitido
                    </p>
                  )}
                </div>
                <div className="block text-base md:text-lg font-normal text-gray-700">
                  <label htmlFor="fecha">Fecha Gasto:</label>
                  <input
                    type="date"
                    id="fecha"
                    className={`p-2 rounded-md border w-full ${
                      !isFechaValid ? "border-red-500" : ""
                    }`}
                    value={fecha}
                    onChange={(e) => {
                      setFecha(e.target.value);
                      setIsFechaValid(true);
                    }}
                  />
                  {!isFechaValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
              </section>
              <label
                htmlFor="descripcion"
                className="block text-base md:text-lg font-normal text-gray-700"
              >
                Descripcion Gasto:
              </label>
              <textarea
                id="descripcion"
                className={`p-2 rounded-md border w-full text-base font-normal ${
                  !isDescripcionValid ? "border-red-500" : ""
                }`}
                style={{ resize: "none" }}
                rows={4}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  setIsDescripcionValid(true);
                }}
              ></textarea>
              {!isDescripcionValid && (
                <p className="text-red-500 text-xs">
                  Este campo es obligatorio
                </p>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={isDisabled}
              >
                {isDisabled ? (
                  <div
                    className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  ></div>
                ) : decodeToken()?.user?.role === "Administrador" ? (
                  "Guardar"
                ) : (
                  "Enviar gasto a aprobacion"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isDisabled}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default NuevoGastoModal;
