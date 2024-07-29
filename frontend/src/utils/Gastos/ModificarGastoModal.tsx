import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import decodeToken from "../tokenDecored";

interface Seller {
  Id: number;
  NombreCompleto: string;
}

interface TiposGastos {
  GastoId: number;
  Nombre: string;
  MontoMaximo: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getGastos: () => void;
  Id: number;
}

const ModificarGastoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
  Id
}) => {
  const [selectedSeller, setSelectedSeller] = useState<string | number | undefined>(undefined);
  const [selectedTipoGasto, setSelectedTipoGasto] = useState<string | number | undefined>(undefined);

  // properties to create sell
  const [fecha, setFecha] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");

  const [isFechaValid, setIsFechaValid] = useState<boolean>(true);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(true);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(true);

  const [montoMaximo, setMontoMaximo] = useState<number | undefined>(0);
  const [tiposGastos, setTiposGastos] = useState<TiposGastos[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  

  const getSellers = async () => {
    try {
      const response = await axios.get("https://backendgestorventas1.azurewebsites.net/api/vendedores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSellers(response.data);
    } catch (error) {
      console.error("Error obteniendo vendedores:", error);
    }
  };

  const getTiposGastos = async () => {
    try {
      const response = await axios.get("https://backendgestorventas1.azurewebsites.net/api/gastos/tipos");
      setTiposGastos(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos de gastos:", error);
    }
  };

  const getGastoById = async () => {
    try {
      const response = await axios.get(`https://backendgestorventas1.azurewebsites.net/api/gastos/${Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFecha(new Date(response.data.Fecha).toISOString().split("T")[0]);
      setMonto(response.data.Monto);
      setDescripcion(response.data.Descripcion);
      setSelectedSeller(response.data.VendedorId);
      setSelectedTipoGasto(response.data.GastoId);
    } catch (error) {
      console.error("Error obteniendo gasto:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "monto") {
      setMonto(Number(value));
      setIsMontoValid(true);
    } else if (name === "fecha") {
      setFecha(value);
      setIsFechaValid(true);
    }
  };

  const handleUpdateGasto = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    if (!fecha) {
      setIsFechaValid(false);
      isValid = false;
    }
    if (!monto) {
      setIsMontoValid(false);
      isValid = false;
    }
    if (monto > montoMaximo!) {
      isValid = false;
    }
    if (!descripcion) {
      setIsDescripcionValid(false);
      isValid = false;
    }

    if (!isValid) return;

    const Gasto = {
      GastoId: selectedTipoGasto,
      VendedorId: selectedSeller,
      Fecha: fecha,
      Monto: monto,
      Descripcion: descripcion,
    };

    axios
      .put(`https://backendgestorventas1.azurewebsites.net/api/gastos/${Id}`, Gasto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Gasto actualizado exitosamente");
        getGastos();
        onClose();
      })
      .catch((err) => {
        console.error(err);
        onClose();
      });
  };

  useEffect(() => {
    if (isOpen) {
      getSellers();
      getTiposGastos();
      getGastoById();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeller("");
      setSelectedTipoGasto("");
      setFecha("");
      setMonto(0);
      setMontoMaximo(0);
      setDescripcion("");
      setIsFechaValid(true);
      setIsMontoValid(true);
      setIsDescripcionValid(true);
    }
  }, [isOpen]);

  const SellersOptions = sellers.map((seller) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const TiposGastosOptions = tiposGastos.map((tipo) => ({
    value: tipo.GastoId,
    label: tipo.Nombre,
    MontoMaximo: tipo.MontoMaximo,
  }));

  useEffect(() => {
    const selectedOption = TiposGastosOptions.find(option => option.value === selectedTipoGasto);
    if (selectedOption) {
      setMontoMaximo(Number(selectedOption.MontoMaximo));
    }
  }, [selectedTipoGasto, TiposGastosOptions]);

  const handleSelectSeller = (selectedOption: any) => {
    setSelectedSeller(selectedOption?.value);
  };

  const handleSelectTipoGasto = (selectedOption: any) => {
    setSelectedTipoGasto(selectedOption?.value);
    setMontoMaximo(Number(selectedOption?.MontoMaximo));
  };

  console.log(isOpen)

  return (
    <div>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <form
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onSubmit={handleUpdateGasto}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3 className="text-3xl leading-6 font-bold text-blue-900" id="modal-title">
                    Modificar Gasto
                  </h3>
                  <button type="button" onClick={onClose} className="text-4xl text-gray-500 hover:text-gray-900">
                    &times;
                  </button>
                </header>
                <div className="block text-base md:text-lg font-normal mb-2 text-gray-700 mt-4">
                  <label htmlFor="Tipos Gastos">Tipo Gasto:</label>
                  <Select
                    id="Tipos Gastos"
                    options={TiposGastosOptions}
                    value={TiposGastosOptions.find(option => option.value === selectedTipoGasto)}
                    onChange={handleSelectTipoGasto}
                    isSearchable
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                  <label htmlFor="seller">Vendedor:</label>
                  <Select
                    id="seller"
                    options={SellersOptions}
                    value={SellersOptions.find(option => option.value === selectedSeller)}
                    onChange={handleSelectSeller}
                    isSearchable
                    isDisabled={decodeToken()?.user?.role === "Vendedor"}
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <section className="grid grid-cols-2 gap-4 mb-2">
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="monto">Monto: </label>
                    <input
                      type="number"
                      name="monto"
                      value={monto}
                      className={`p-2 rounded-md border w-full ${!isMontoValid ? "border-red-500" : ""}`}
                      onChange={handleChange}
                    />
                    {!isMontoValid && (
                      <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                    )}
                    {monto > montoMaximo! && selectedTipoGasto != "" && (
                      <p className="text-red-500 text-xs">El monto no puede ser mayor al monto máximo permitido</p>
                    )}
                  </div>
                  <div className="block text-base md:text-lg font-normal text-gray-700">
                    <label htmlFor="fecha">Fecha Gasto:</label>
                    <input
                      type="date"
                      name="fecha"
                      value={fecha}
                      className={`p-2 rounded-md border w-full ${!isFechaValid ? "border-red-500" : ""}`}
                      onChange={handleChange}
                    />
                    {!isFechaValid && (
                      <p className="text-red-500 text-xs">Este campo es obligatorio</p>
                    )}
                  </div>
                </section>
                <label htmlFor="descripcion" className="block text-base md:text-lg font-normal text-gray-700">
                  Descripción Gasto:
                </label>
                <textarea
                  name="descripcion"
                  value={descripcion}
                  cols={10}
                  rows={4}
                  className={`p-2 rounded-md border w-full text-base font-normal ${!isDescripcionValid ? "border-red-500" : ""}`}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    setIsDescripcionValid(true);
                  }}
                ></textarea>
                {!isDescripcionValid && (
                  <p className="text-red-500 text-xs font-normal">Este campo es obligatorio</p>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Modificar Gasto
                </button>
              
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModificarGastoModal;