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
  Diferencia: number;
  EfectivoAbonosCompras: number;
  EfectivoEntregar: number;
}

const LiquidacionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getGastos,
}) => {
  //data de liquidacion
  const [baseVendedor, setBaseVendedor] = useState<number>(0);
  const [gastos, setGastos] = useState<number>(0);
  const [totalAbonos, setTotalAbonos] = useState<number>(0);
  const [totalRetiros, setTotalRetiros] = useState<number>(0);
  const [ventas, setVentas] = useState<number>(0);
  const [intereses, setIntereses] = useState<number>(0);
  const [seguros, setSeguros] = useState<number>(0);
  const [multas, setMultas] = useState<number>(0);
  const [abonoCapital, setAbonoCapital] = useState<number>(0);
  const [Difere, setDifere] = useState<number>(0);
  const [efectivo, setEfectivo] = useState<number>(0);
  const [efectivoAbonosCompras, setEfectivoAbonosCompras] = useState<number>(0);
  const [efectivoEntregar, setEfectivoEntregar] = useState<number>(0);
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(0);
  const [abonosTransacciones, setAbonosTransacciones] = useState<number>(0);
  const [retirosTransacciones, setRetirosTransacciones] = useState<number>(0);
  const [vendedores, setVendedores] = useState([]);
  const [base, setBase] = useState<number>(0);

  const [isVendSelected, setIsVendSelected] = useState<boolean>(false);

  const [liquidacionData, setLiquidacionData] = useState<Liquidacion>(
    {} as Liquidacion
  );

  console.log(liquidacionData);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDataLiquidacion = async (sellerId: number, e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://backendgestorventas.azurewebsites.net/api/liquidaciones/${sellerId}/${efectivo}/${base}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = res.data;
      setLiquidacionData(data);
      setBaseVendedor(data?.Base ?? 0);
      setGastos(data?.Gastos ?? 0);
      setTotalAbonos(data?.Abonos ?? 0);
      setTotalRetiros(data?.TotalRetiros ?? 0);
      setVentas(data?.Ventas ?? 0);
      setIntereses(data?.Intereses ?? 0);
      setSeguros(data?.Seguros ?? 0);
      setMultas(data?.Multas ?? 0);
      setAbonoCapital(data?.AbonoCapital ?? 0);
      setDifere(data?.Diferencia ?? 0);
      setEfectivoAbonosCompras(data?.EfectivoAbonosCompras ?? 0);
      setEfectivoEntregar(data?.EfectivoEntregar ?? 0);
      setAbonosTransacciones(data?.AbonosTransacciones ?? 0);
      setRetirosTransacciones(data?.RetirosTransacciones ?? 0);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching liquidacion data:", err);
      setIsLoading(false);
    }
  };


  useEffect(() => {

    if (!isOpen) {
      setBaseVendedor(0);
      setGastos(0);
      setTotalAbonos(0);
      setTotalRetiros(0);
      setVentas(0);
      setIntereses(0);
      setSeguros(0);
      setMultas(0);
      setAbonoCapital(0);
      setDifere(0);
      setEfectivo(0);
      setEfectivoAbonosCompras(0);
      setEfectivoEntregar(0);
      setAbonosTransacciones(0);
      setRetirosTransacciones(0);
      setIsVendSelected(false);
    }

  }, [!isOpen])

  console.log(
    baseVendedor,
    gastos,
    totalAbonos,
    totalRetiros,
    ventas,
    intereses,
    seguros,
    multas,
    abonoCapital
  );

  const handleSelectSeller = (sellerId: string | undefined) => {
    if (sellerId !== null) {
      setSelectedSeller(Number(sellerId));
      setIsVendSelected(true);
    }
  };

  const getVendedores = async () => {
    try {
      const res = await axios.get("https://backendgestorventas.azurewebsites.net/api/vendedores", {
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

    console.log(efectivoEntregar, "efectivo a entregar");

    const liquidacion = {
      BaseVendedor: baseVendedor,
      Gastos: gastos,
      Abonos: totalAbonos,
      Ventas: ventas,
      AbonoCapital: abonoCapital,
      Multas: multas,
      Intereses: intereses,
      Seguros: seguros,
      AbonosTransacciones: abonosTransacciones, 
      RetirosTransacciones: retirosTransacciones, 
      Efectivo: efectivo,
      Diferencia: Difere,
      EfectivoAbonosCompras: efectivoAbonosCompras,
      EfectivoEntregar: efectivoEntregar,
    };

    axios
      .post(
        `https://backendgestorventas.azurewebsites.net/api/liquidaciones/${selectedSeller}`,
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
                  <div className="flex flex-col w-full text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label>Ingrese la base para hoy: </label>
                    <input
                      type="text"
                      placeholder="Base hoy"
                      className="border rounded-md py-1 px-1 border-gray-600"
                      onChange={(e) => setBase(Number(e.target.value))}
                    />
                    
                  </div>
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label>Seleccione un Vendedor: </label>
                    <Select
                      options={SellersOptions}
                      onChange={(e) => handleSelectSeller(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un vendedor"
                      className="w-full"
                    />
                  </div>
                  {isVendSelected && (
                    <div className="flex flex-col w-full text-base md:text-lg font-normal mb-2 text-gray-600">
                      <label>Ingrese el efectivo: </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="efectivo"
                          className="border rounded-md border-gray-700 w-full py-1 pl-2"
                          onChange={(e) => {
                            setEfectivo(Number(e.target.value));
                          }}
                        />
                        <button
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white bg-blue-800 text-sm px-2 py-2 rounded-md"
                          onClick={(e) => [
                            getDataLiquidacion(selectedSeller ?? 0, e),
                            setEfectivoEntregar(0)
                          ]
                          }
                        >
                          calcular
                        </button>
                      </div>
                    </div>
                  )}
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center min-h-[290px]">
                      <Spinner isLoading={isLoading} />
                    </div>
                  ) : (
                    <>
                      <section className="grid grid-cols-2">
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Base vendedor:
                          </label>
                          <h3 className="font-normal">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(baseVendedor) ?? 0}
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
                          <h3 className="font-normal text-lg">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(multas) ?? 0}
                          </h3>
                        </div>
                      </section>
                      <section className="grid grid-cols-2 mb-2">
                      <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                      <label className="block text-base md:text-lg font-semibold text-blue-800">
                          Total Abonos:
                        </label>
                        <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                          }).format(totalAbonos) ?? 0}
                        </h3>
                      </div>
                        <div className="flex text-base md:text-lg font-normal mb-2 text-gray-700 flex-col items-start">
                          <label className="block text-base md:text-lg font-semibold text-blue-800">
                            Efectivo:
                          </label>
                          <h3 className="font-normal text-lg">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(efectivo) ?? 0}
                          </h3>
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
                            Efectivo de Abonos, compras y seguros:
                          </label>
                          <h3 className="font-normal text-lg">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(efectivoAbonosCompras) ?? 0}
                          </h3>
                        </div>
                      </section>
                      <div className="w-full flex flex-col items-center justify-center rounded-md border-2">
                        <h3 className="text-lg font-semibold text-blue-800">
                          Diferencia:
                        </h3>
                        <h3 className="font-normal text-lg">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                          }).format(Difere) ?? 0}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex justify-between items-center">
                <span className="text-xl">
                  <label htmlFor="efectivo" className="text-blue-900">
                    Debe entregar:
                  </label>
                  <h3>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(efectivoEntregar) ?? 0}
                  </h3>
                </span>
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
