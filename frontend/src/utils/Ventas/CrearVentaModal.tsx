import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

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
    getVentas : () => void;
  }

const CrearVentaModal:React.FC<ModalProps> = ({ isOpen, onClose, getVentas }) => {


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
                <h3
                  className="text-3xl leading-6 font-bold text-blue-900"
                  id="modal-title"
                >
                  Crear Venta
                </h3>
                <div className="mt-4 w-full mb-2">
                  <label htmlFor="seller">Vendedor:</label>
                  <Select
                    id="seller"
                    options={SellersOptions}
                    onChange={(selectedOption) =>
                      handleSelectSeller(selectedOption?.value.toString())
                    }
                    isSearchable
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
                  />
                </div>
                <section className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label htmlFor="">Valor venta: </label>
                    <input
                      type="number"
                      className="p-2 rounded-md border w-full"
                      onChange={(e) => setValorVenta(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="" className="">
                      N Cuotas:{" "}
                    </label>
                    <input
                      type="number"
                      className="p-2 rounded-md border w-full"
                      onChange={(e) => setNumeroCuotas(Number(e.target.value))}
                    />
                  </div>
                </section>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <section>
                    <label htmlFor="periodicidad">Periodicidad:</label>
                    <input
                      type="number"
                      className="p-2 rounded-md border w-full"
                      onChange={(e) => setPeriodicidad(Number(e.target.value))}
                    />
                  </section>
                  <section>
                    <label htmlFor="">% Tasa interes:</label>
                    <input
                      type="number"
                      className="p-2 rounded-md border w-full"
                      onChange={(e) => setTasaInteres(Number(e.target.value))}
                    />
                  </section>
                </div>
                <div>
                  <label htmlFor="">Fecha Inicio:</label>
                  <input
                    type="date"
                    className="p-2 rounded-md border w-full"
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="">Detalles venta:</label>
                  <textarea
                    name=""
                    id=""
                    cols={10}
                    rows={6}
                    className="p-2 rounded-md border w-full focus:border-blue-500"
                    onChange={(e) => setDetallesVenta(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Crear
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancelar
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
