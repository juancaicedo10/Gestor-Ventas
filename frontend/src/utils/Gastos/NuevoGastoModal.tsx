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
}

const NuevoGastoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<
    string | number | undefined
  >(undefined);

  const [selectedTipoGasto, setSelectedTipoGasto] = useState<
    string | number | undefined
  >(undefined);

  // properties to create sell

  const [fecha, setFecha] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");

  const [isFechaValid, setIsFechaValid] = useState<boolean>(true);
  const [isMontoValid, setIsMontoValid] = useState<boolean>(true);
  const [isDescripcionValid, setIsDescripcionValid] = useState<boolean>(true);

  const [montoMaximo, setMontoMaximo] = useState<number | undefined>(0);

  const [tiposGastos, setTiposGastos] = useState<TiposGastos[]>([]);

  // const [isSellerValid, setIsSellerValid] = useState<boolean>(true);
  // const [isClientValid, setIsClientValid] = useState<boolean>(true);

  // const [isValorSeguroValid, setIsValorSeguroValid] = useState<boolean>(true);

  const [sellers, setSellers] = useState<Seller[]>([]);

  const getSellers = async () => {
    try {
      await axios
        .get("https://backendgestorventas.azurewebsites.net/api/vendedores", {
          headers: {
            Beaerer: `${localStorage.getItem("token")}`,
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

  const handleCreateSell = (e: any) => {
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
      .post("https://backendgestorventas.azurewebsites.net/api/gastos", Gasto, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        getGastos();
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  useEffect(() => {
    getSellers();
    getTiposGastos();
  }, []);

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
              onSubmit={handleCreateSell}
            >
              {" "}
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
                  <label htmlFor="Tipos Gastos">Tipo Gasto:</label>
                  <Select
                    id="Tipos Gastos"
                    options={TiposGastosOptions}
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
                  <label htmlFor="seller">Vendedor:</label>
                  <Select
                    id="seller"
                    options={SellersOptions}
                    defaultValue={
                      decodeToken()?.user?.role === "Vendedor"
                        ? SellersOptions.find(
                            (option) => option.value === decodeToken()?.user?.Id
                          )
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleSelectSeller(selectedOption?.value.toString())
                    }
                    isSearchable
                    isDisabled={decodeToken()?.user?.role === "Vendedor"}
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <section className="grid grid-cols-2 gap-4 mb-2">
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="">Monto: </label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isMontoValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setMonto(Number(e.target.value));
                        setIsMontoValid(true);
                        console.log(selectedTipoGasto);
                      }}
                    />
                    {
                        !isMontoValid && (
                        <p className="text-red-500 text-xs">
                            Este campo es obligatorio
                        </p>
                        )
                    }
                    {monto > montoMaximo! &&  selectedTipoGasto != "" && (
                      <p className="text-red-500 text-xs">
                        El monto no puede ser mayor al monto máximo permitido
                      </p>
                    )}
                  </div>
                  <div className="block text-base md:text-lg font-normal text-gray-700">
                    <label htmlFor="numero cuotas">Fecha Gasto:</label>
                    <input
                      type="date"
                      className={`p-2 rounded-md border w-full ${
                        !isFechaValid ? "border-red-500" : ""
                      }`}
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
                  className="block text-base md:text-lg font-normal  text-gray-700"
                >
                  Descripcion Gasto:
                </label>
                <textarea
                  name=""
                  id=""
                  cols={10}
                  rows={4}
                  className={`p-2 rounded-md border w-full text-base font-normal ${
                    !isDescripcionValid ? "border-red-500" : ""
                  }`}
                  style={{ resize: "none" }}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    setIsDescripcionValid(true);
                  }}
                ></textarea>
                {!isDescripcionValid && (
                  <p className="text-red-500 text-xs font-normal">
                    Este campo es obligatorio
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Registrar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevoGastoModal;
