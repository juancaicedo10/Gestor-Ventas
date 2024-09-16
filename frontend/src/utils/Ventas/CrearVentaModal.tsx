import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import decodeToken from "../tokenDecored"; // Importa CSSProperties desde React
import { toast } from "react-toastify";

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
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(
    undefined
  );
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

  const [isValorVentaValid, setIsValorVentaValid] = useState<boolean>(true);
  const [isNumeroCuotasValid, setIsNumeroCuotasValid] = useState<boolean>(true);
  const [isPeriodicidadValid, setIsPeriodicidadValid] = useState<boolean>(true);
  const [isTasaInteresValid, setIsTasaInteresValid] = useState<boolean>(true);
  const [isFechaInicioValid, setIsFechaInicioValid] = useState<boolean>(true);
  const [isValorSeguroValid, setIsValorSeguroValid] = useState<boolean>(true);
  const [isDetallesVentaValid, setIsDetallesVentaValid] =
    useState<boolean>(true);
  const [isSelectedClientValid, setIsSelectedClientValid] =
    useState<boolean>(false);
  const [isSelectedSellerValid, setIsSelectedSellerValid] =
    useState<boolean>(true);

  const [isDiasValid, setIsDiasValid] = useState<boolean>(false);

  const [diasSelected, setDiasSelected] = useState<boolean>(false);

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const periodos = [
    {
      value: 0,
      label: "Dias",
    },
    {
      value: 1,
      label: "Diario",
    },
    {
      value: 7,
      label: "Semanal",
    },
    {
      value: 14,
      label: "Catorcenal",
    },
    {
      value: 15,
      label: "Quincenal",
    },
    {
      value: 30,
      label: "Mensual",
    },
  ];

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


    setIsDisabled(true);
    

    let isValid = true;

    if (!selectedSeller || selectedSeller === 0) {

      setIsSelectedSellerValid(false);
      isValid = false;
    }

    if (!valorVenta) {
      setIsValorVentaValid(false);
      isValid = false;
      console.log("es valor venta");
    }
    if (!numeroCuotas) {
      setIsNumeroCuotasValid(false);
      isValid = false;
      console.log("es numero cuotas");
    }
    if (!periodicidad) {
      setIsPeriodicidadValid(false);
      isValid = false;
      console.log("es periodicidad");
    }
    if (!tasaInteres) {
      setIsTasaInteresValid(false);
      isValid = false;
      console.log("es tasa interes");
    }
    if (!fechaInicio) {
      setIsFechaInicioValid(false);
      isValid = false;
      console.log("es fecha inicio");
    }

    if (!valorSeguro) {
      setValorSeguro(0);
    }

    if (!detallesVenta) {
      setIsDetallesVentaValid(false);
      isValid = false;
      console.log("es detalles venta");
    }

    if (!selectedClient || selectedClient === "") {

      setIsSelectedClientValid(false);
      isValid = false;
      console.log("es cliente");
    }

    if (diasSelected && !isDiasValid) {
      setIsDiasValid(false);
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

    axios
      .post(
        "https://backendgestorventas.azurewebsites.net/api/ventas",
        venta,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        getVentas();
        setIsDisabled(false);
        onClose();
        toast.success(decodeToken()?.user?.role === "Administrador" ? "Venta creada exitosamente" : "Venta enviada a aprobacion");
      })
      .catch((err) => {
        console.log(err);
        onClose();
        setIsDisabled(false);
        toast.error("Error creando venta");
      });
  };

  useEffect(() => {
    getSellers();
    getClients();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeller(0);
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
      setIsSelectedClientValid(true);
      setIsSelectedSellerValid(true);
      setIsDisabled(false);
    }

    if (decodeToken()?.user?.role === "Vendedor") {
      setIsSelectedSellerValid(true);
      console.log(isSelectedSellerValid, "seller");
      setSelectedSeller(decodeToken()?.user?.Id);
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

  const handleSelectSeller = (sellerId: Number | undefined) => {

    if (sellerId !== null) {
      setIsSelectedSellerValid(true);
      setSelectedSeller(Number(sellerId));
      setIsDisabled(false);
    }
  };

  const handleSelectClient = (clientId: Number | undefined) => {
    console.log("entro a la seleccion del cliente")
    if (clientId !== null) {
      setSelectedClient(Number(clientId));
      setIsSelectedClientValid(true);
      setIsDisabled(false);
      
      console.log("oe", clientId, selectedClient, isSelectedClientValid);
    }
  };

  const handleSelectPeriodicidad = (periodicidad: any) => {
    if (periodicidad.value == 0) {
      setDiasSelected(true);
      setIsPeriodicidadValid(true);
    } else {
      setDiasSelected(false);
      setPeriodicidad(Number(periodicidad.value));
      setIsPeriodicidadValid(true);
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
                          ) || null // Asegúrate de proporcionar un valor por defecto adecuado
                        : null
                    }
                    onChange={(selectedOption) => {
                      handleSelectSeller(selectedOption?.value)
                      setIsDisabled(false);
                    }
                    }
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
                <div className="mb-2">
                  <label htmlFor="">Cliente: </label>
                  <Select
                    id="seller"
                    options={ClientsOptions}
                    onChange={(selectedOption) => {
                      handleSelectClient(selectedOption?.value)
                      setIsDisabled(false);
                    }
                    }
                    isSearchable
                    maxMenuHeight={170}
                    menuPlacement="auto"
                  />
                  {!isSelectedClientValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
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
                        setIsDisabled(false);
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
                        setIsDisabled(false);
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
                    <Select
                      options={periodos}
                      onChange={(e) => handleSelectPeriodicidad(e)}
                      isSearchable={true}
                      placeholder="periodicidad"
                      className="w-full"
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
                        setIsDisabled(false);
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
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isValorSeguroValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setValorSeguro(Number(e.target.value));
                        setIsValorSeguroValid(true);
                        setIsDisabled(false);
                      }}
                    />
                    {!isValorSeguroValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
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
                        setIsDisabled(false);
                      }}
                    />
                    {!isFechaInicioValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </section>
                </div>
                {diasSelected && (
                  <>
                    <label htmlFor="dias">Dias</label>
                    <input
                      type="number"
                      className="p-2 rounded-md border w-full mb-2"
                      placeholder="ingresa los dias"
                      onChange={(e) => {
                        setPeriodicidad(Number(e.target.value));
                        setIsDiasValid(true);
                        setIsDisabled(false);
                      }}
                    />
                    {!isDiasValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </>
                )}
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
                    setIsDisabled(false);
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
                  disabled={isDisabled}
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
