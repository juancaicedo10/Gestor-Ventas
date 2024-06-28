import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

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
  gasto: any;  // Aquí iría la estructura del gasto que deseas modificar
}

const ModificarGastoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
  gasto,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<
    string | number | undefined
  >(gasto.VendedorId);

  const [selectedTipoGasto, setSelectedTipoGasto] = useState<
    string | number | undefined
  >(gasto.GastoId);

  const [fecha, setFecha] = useState<string>(gasto.Fecha);
  const [monto, setMonto] = useState<number>(gasto.Monto);
  const [descripcion, setDescripcion] = useState<string>(gasto.Descripcion);

  const [isFechaValid, setIsFechaValid] = useState<boolean>(true);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(true);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(true);

  const [montoMaximo, setMontoMaximo] = useState<number | undefined>(0);

  const [tiposGastos, setTiposGastos] = useState<TiposGastos[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const getSellers = async () => {
    try {
      await axios
        .get("https://backendgestorventas.azurewebsites.net/api/vendedores", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setSellers(response.data);
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error obteniendo vendedores:", error);
    }
  };

  const getTiposGastos = async () => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/gastos/tipos")
      .then((res) => {
        setTiposGastos(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateGasto = (e: any) => {
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

    if (monto > (montoMaximo ?? 0)) {  // Manejo de montoMaximo indefinido
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

    console.log("Gasto a enviar:", Gasto);  // Log para depuración

    axios
      .put(`https://backendgestorventas.azurewebsites.net/api/gastos/${gasto.id}`, Gasto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Gasto ACTUALIZADO EXITOSAMENTE");
        getGastos();
        onClose();
      })
      .catch((err) => {
        console.log("Error al actualizar gasto:", err);  // Log para depuración
        onClose();
      });
  };

  useEffect(() => {
    getSellers();
    getTiposGastos();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeller(gasto.VendedorId);
      setSelectedTipoGasto(gasto.GastoId);
      setFecha(gasto.Fecha);
      setMonto(gasto.Monto);
      setMontoMaximo(0);
      setDescripcion(gasto.Descripcion);
      setIsFechaValid(true);
      setIsMontoValid(true);
      setIsDescripcionValid(true);
    }
  }, [isOpen, gasto]);

  const SellersOptions = sellers.map((seller) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const TiposGastosOptions = tiposGastos.map((tipo) => ({
    value: tipo.GastoId,
    label: tipo.Nombre,
    MontoMaximo: tipo.MontoMaximo,
  }));

  const handleSelectSeller = (sellerId: string | undefined) => {
    if (sellerId !== null) {
      setSelectedSeller(Number(sellerId));
    }
  };

  const handleSelectTipoGasto = (GastoId: string | undefined) => {
    if (GastoId !== null) {
      setSelectedTipoGasto(Number(GastoId));
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <form
              action="submit"
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onSubmit={handleUpdateGasto}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Modificar Gasto
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
                  <label htmlFor="Tipos Gastos">Tipo Gasto:</label>
                  <Select
                    id="Tipos Gastos"
                    options={TiposGastosOptions}
                    value={TiposGastosOptions.find(option => option.value === selectedTipoGasto)}
                    onChange={(selectedOption) => {
                      handleSelectTipoGasto(selectedOption?.value.toString());
                      setMontoMaximo(Number(selectedOption?.MontoMaximo));
                    }}
                    isSearchable
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                  <label htmlFor="Vendedor">Vendedor:</label>
                  <Select
                    id="Vendedor"
                    options={SellersOptions}
                    value={SellersOptions.find(option => option.value === selectedSeller)}
                    onChange={(selectedOption) => handleSelectSeller(selectedOption?.value.toString())}
                    isSearchable
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <label className="block text-base md:text-lg font-normal mb-2">
                  <span className="text-gray-700">Fecha:</span>
                  <input
                    type="date"
                    name="fecha"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className={`p-2 rounded-md border w-full text-sm ${
                      !isFechaValid ? "border-red-500" : ""
                    }`}
                  />
                  {!isFechaValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </label>
                <label className="block text-base md:text-lg font-normal mb-2">
                  <span className="text-gray-700">Monto:</span>
                  <input
                    type="number"
                    name="monto"
                    value={monto}
                    onChange={(e) => setMonto(Number(e.target.value))}
                    className={`p-2 rounded-md border w-full text-sm ${
                      !isMontoValid ? "border-red-500" : ""
                    }`}
                  />
                  {!isMontoValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </label>
                <label className="block text-base md:text-lg font-normal mb-2">
                  <span className="text-gray-700">Descripción:</span>
                  <input
                    type="text"
                    name="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className={`p-2 rounded-md border w-full text-sm ${
                      !isDescripcionValid ? "border-red-500" : ""
                    }`}
                  />
                  {!isDescripcionValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </label>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl py-2 px-4 bg-blue-900 text-white rounded-lg hover:bg-blue-700 font-semibold w-full my-3"
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

