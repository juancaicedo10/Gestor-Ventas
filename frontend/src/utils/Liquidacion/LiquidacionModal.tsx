import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import Spinner from "../Spinner";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getGastos: () => void;
}

interface Liquidacion {
  Base: number;
  Gastos: number;
  TotalAbonos: number;
  TotalRetiros: number;
  Ventas: number;
  Intereses: number;
  Seguros: number;
  Multas: number;
  AbonoCapital: number;
}

const LiquidacionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
}) => {


  //data de liquidacion
  const [base, setBase] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);
  const [totalAbonos, setTotalAbonos] = useState<number>(0);
  const [totalRetiros, setTotalRetiros] = useState<number>(0);
  const [ventas, setVentas] = useState<number>(0);
  const [intereses, setIntereses] = useState<number>(0);
  const [seguros, setSeguros] = useState<number>(0);
  const [multas, setMultas] = useState<number>(0);
  const [abonoCapital, setAbonoCapital] = useState<number>(0);


  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(0);
  const [vendedores, setVendedores] = useState([]);

  const [liquidacionData, setLiquidacionData] = useState<Liquidacion>(
    {} as Liquidacion
  );

  console.log(liquidacionData);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDataLiquidacion = async (sellerId: number) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/liquidaciones/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLiquidacionData(res.data);
      setBase(res.data.Base ?? 0);
      setGastos(res.data.Gastos ?? 0);
      setTotalAbonos(res.data.TotalAbonos ?? 0);
      setTotalRetiros(res.data.TotalRetiros ?? 0);
      setVentas(res.data.Ventas ?? 0);
      setIntereses(res.data.Intereses ?? 0);
      setSeguros(res.data.Seguros ?? 0);
      setMultas(res.data.Multas ?? 0);
      setAbonoCapital(res.data.AbonoCapital ?? 0);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };


  console.log(base, gastos, totalAbonos, totalRetiros, ventas, intereses, seguros, multas, abonoCapital);

  const handleSelectSeller = (sellerId: string | undefined) => {
    getDataLiquidacion(Number(sellerId));
    if (sellerId !== null) {
      setSelectedSeller(Number(sellerId));
    }
  };

  const getVendedores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vendedores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVendedores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getVendedores();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const liquidacion = {
      Base: base,
      Gastos: gastos,
      Abonos: totalAbonos,
      Ventas: ventas,
      Intereses: intereses,
      Seguros: seguros,
      Multas: multas,
      AbonoCapital: abonoCapital
    };

    axios
      .post(
        `http://localhost:5000/api/liquidaciones/${selectedSeller}`,
         liquidacion,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
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

  const SellersOptions = vendedores.map((seller: any) => ({
    value: seller.Id,
    label: seller.NombreCompleto,
  }));

  return (
    <section>
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
              onSubmit={handleSubmit}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Realizar liquidación:
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mt-4">
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label>Vendedor: </label>
                    <Select
                      options={SellersOptions}
                      onChange={(e) => handleSelectSeller(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un vendedor"
                      className="w-full"
                    />
                  </div>
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center min-h-[290px]">
                      <Spinner isLoading={isLoading} />
                    </div>
                  ) : (
                    <>
                      <section className="grid grid-cols-2">
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Base:
                          </label>
                          <h3 className="font-normal">
                            {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(base) ?? 0}
                          </h3>
                        </div>
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Gastos:
                          </label>
                          <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(gastos) ?? 0}
                          </h3>
                        </div>
                      </section>
                      <section className="grid grid-cols-2 mb-2">
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Total Ventas:
                          </label>
                          <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(ventas) ?? 0}
                          </h3>
                        </div>
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Total Intereses:
                          </label>
                          <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(intereses) ?? 0}
                          </h3>
                        </div>
                      </section>
                      <section className="grid grid-cols-2 mb-2">
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Seguros:
                          </label>
                          <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(seguros) ?? 0}
                          </h3>
                        </div>
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Multas:
                          </label>
                          <h3 className="font-normal text-lg">{new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(multas) ?? 0}</h3>
                        </div>
                      </section>
                      <section className="grid grid-cols-2 mb-2">
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Abono Capital:
                          </label>
                          <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(abonoCapital) ?? 0}
                          </h3>
                        </div>
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Efectivo:
                          </label>
                          <h3 className="font-normal text-lg">{new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(0) ?? 0}</h3>
                        </div>
                      </section>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Liquidar vendedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default LiquidacionModal;
