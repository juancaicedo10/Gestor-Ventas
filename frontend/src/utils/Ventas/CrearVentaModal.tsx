import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import decodeToken from "../tokenDecored"; // Importa CSSProperties desde React

interface Seller {
  Id: number;
  NombreCompleto: string;
}

interface Client {
  Id: number;
  NombreCompleto: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getVentas: () => void;
}

const CrearVentaModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getVentas,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<
    string | number | undefined
  >(undefined);
  const [selectedClient, setSelectedClient] = useState<
    string | number | undefined
  >(undefined);

  // properties to create sell

  const [valorVenta, setValorVenta] = useState<number>(0);
  const [numeroCuotas, setNumeroCuotas] = useState<number>(0);
  const [periodicidad, setPeriodicidad] = useState<number>(0);
  const [tasaInteres, setTasaInteres] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [detallesVenta, setDetallesVenta] = useState<string>("");
  const [valorSeguro, setValorSeguro] = useState<number>(0);

 // const [isSellerValid, setIsSellerValid] = useState<boolean>(true);
  // const [isClientValid, setIsClientValid] = useState<boolean>(true);
  const [isValorVentaValid, setIsValorVentaValid] = useState<boolean>(true);
  const [isNumeroCuotasValid, setIsNumeroCuotasValid] = useState<boolean>(true);
  const [isPeriodicidadValid, setIsPeriodicidadValid] = useState<boolean>(true);
  const [isTasaInteresValid, setIsTasaInteresValid] = useState<boolean>(true);
  const [isFechaInicioValid, setIsFechaInicioValid] = useState<boolean>(true);
  const [isValorSeguroValid, setIsValorSeguroValid] = useState<boolean>(true);
  const [isDetallesVentaValid, setIsDetallesVentaValid] =
    useState<boolean>(true);

  console.log(setValorSeguro);

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

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

  const getClients = async () => {
    try {
      await axios
        .get("https://backendgestorventas.azurewebsites.net/api/clientes", {
          headers: {
            Beaerer: `${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setClients(response.data);
          console.log(response.data);
        });
    } catch (error) {
      console.error("Error obteniendo clientes:", error);
    }
  };

  const handleCreateSell = (e: any) => {
    e.preventDefault();

    let isValid = true;

    if (!valorVenta) {
      setIsValorVentaValid(false);
      isValid = false;
    }
    if (!numeroCuotas) {
      setIsNumeroCuotasValid(false);
      isValid = false;
    }
    if (!periodicidad) {
      setIsPeriodicidadValid(false);
      isValid = false;
    }
    if (!tasaInteres) {
      setIsTasaInteresValid(false);
      isValid = false;
    }
    if (!fechaInicio) {
      setIsFechaInicioValid(false);
      isValid = false;
    }

    if (!valorSeguro) {
      setIsValorSeguroValid(false);
      isValid = false;
    }

    if (!detallesVenta) {
      setIsDetallesVentaValid(false);
      isValid = false;
    }



    if (!isValid) return;

    const venta = {
      ClienteId: selectedClient,
      VendedorId: selectedSeller,
      ValorVenta: valorVenta,
      FechaInicio: fechaInicio,
      Periodicidad: periodicidad,
      NumeroCuotas: numeroCuotas,
      TasaInteres: tasaInteres,
      ValorSeguro: valorSeguro,
      DetallesVenta: detallesVenta,
    };
    console.log(venta);

    axios
      .post("https://backendgestorventas.azurewebsites.net/api/ventas", venta, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        getVentas();
        onClose();
      })
      .catch((err) => {
        console.log(err);
        onClose();
      });
  };

  useEffect(() => {
    getSellers();
    getClients();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeller("");
      setSelectedClient("");
      setValorVenta(0);
      setNumeroCuotas(0);
      setPeriodicidad(0);
      setTasaInteres(0);
      setFechaInicio("");
      setDetallesVenta("");
      setValorSeguro(0);
      setIsValorVentaValid(true);
      setIsNumeroCuotasValid(true);
      setIsPeriodicidadValid(true);
      setIsTasaInteresValid(true);
      setIsFechaInicioValid(true);
      setIsDetallesVentaValid(true);
      setIsValorSeguroValid(true);
    }
  }, [isOpen]);

  const SellersOptions = sellers.map((seller) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  const ClientsOptions = clients.map((client) => ({
    value: client.Id,
    label: client.NombreCompleto,
  }));

  const handleSelectSeller = (sellerId: string | undefined) => {
    if (sellerId !== null) {
      setSelectedSeller(Number(sellerId));
    }
  };

  const handleSelectClient = (clientId: string | undefined) => {
    if (clientId !== null) {
      setSelectedClient(Number(clientId));
    }
  };

  console.log(decodeToken().user);

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
                    Crear Venta
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mt-4 w-full mb-2">
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
                <div className="mb-2">
                  <label htmlFor="">Cliente: </label>
                  <Select
                    id="seller"
                    options={ClientsOptions}
                    onChange={(selectedOption) =>
                      handleSelectClient(selectedOption?.value.toString())
                    }
                    isSearchable
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                </div>
                <section className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label htmlFor="">Valor venta: </label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isValorVentaValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setValorVenta(Number(e.target.value));
                        setIsValorVentaValid(true);
                      }}
                    />
                    {!isValorVentaValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="numero cuotas">N Cuotas:</label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isNumeroCuotasValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setNumeroCuotas(Number(e.target.value));
                        setIsNumeroCuotasValid(true);
                      }}
                    />
                    {!isNumeroCuotasValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                </section>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <section>
                    <label htmlFor="periodicidad">Periodicidad:</label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isPeriodicidadValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setPeriodicidad(Number(e.target.value));
                        setIsPeriodicidadValid(true);
                      }}
                    />
                    {!isPeriodicidadValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </section>
                  <section>
                    <label htmlFor="">% Tasa interes:</label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isTasaInteresValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setTasaInteres(Number(e.target.value));
                        setIsTasaInteresValid(true);
                      }}
                    />
                    {!isTasaInteresValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </section>
                  <section>
                    <label htmlFor="">Valor Seguro</label>
                    <input
                      type="text"
                      className={`p-2 rounded-md border w-full ${
                        !isValorSeguroValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setValorSeguro(Number(e.target.value));
                        setIsValorSeguroValid(true);
                      }}
                    />
                  </section>
                  <section>
                    <label htmlFor="">Fecha Inicio:</label>
                    <input
                      type="date"
                      className={`p-2 rounded-md border w-full ${
                        !isFechaInicioValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setFechaInicio(e.target.value);
                        setIsFechaInicioValid(true);
                      }}
                    />
                    {!isFechaInicioValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </section>
                </div>
              <label htmlFor="">Detalles venta:</label>
              <textarea
                name=""
                id=""
                cols={10}
                rows={4}
                className={`p-2 rounded-md border w-full ${
                  !isDetallesVentaValid ? "border-red-500" : ""
                }`}
                style={{ resize: "none" }}
                onChange={(e) => {
                  setDetallesVenta(e.target.value);
                  setIsDetallesVentaValid(true);
                }}
              ></textarea>
              {!isDetallesVentaValid && (
                <p className="text-red-500 text-xs">
                  Este campo es obligatorio
                </p>
              )}
                            </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {decodeToken().user.role === "Administrador"
                    ? "Crear Venta"
                    : "Enviar Venta a aprobacion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearVentaModal;
