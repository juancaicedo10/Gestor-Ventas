import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import decodeToken from "../../utils/tokenDecored";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LiquidacionModal from "../../utils/Liquidacion/LiquidacionModal";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PaidIcon from '@mui/icons-material/Paid';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

interface Liquidacion {
  Id: number;
  Base: number;
  Gastos: number;
  TotalAbonos: number;
  TotalRetiros: number;
  Ventas: number;
  Intereses: number;
  Seguros: number;
  NombreVendedor: string;
  Fecha: string;
  Multas: number;
  AbonoCapital: number;
  Efectivo: number;
}

function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Funciones para manejar los modales
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Función para obtener la lista de vendedores
  const getLiquidaciones = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/liquidaciones/all")
      .then((res) => {
        setLiquidaciones(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getLiquidaciones();
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex justify-center w-full border-b shadow-md bg-white mb-4">
          <h1 className="text-2xl text-blue-900 md:text-4xl md:text-center lg:text-6xl text-start p-2 w-full">
            Liquidaciones
          </h1>
          <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" onClick={toggleModal} />
          </button>
        </header>
        <div
          className={`w-full flex items-center justify-center ${
            isLoading ? "h-screen" : ""
          } `}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <>
              <LiquidacionModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                getGastos={getLiquidaciones}
              />
              <section className="w-full px-2 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                {liquidaciones.map((liquidacion) => {
                  return (
                    <li
                      className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md"
                      key={liquidacion.Id}
                    >
                      <div className="flex flex-col">
                        <section className="w-full p-2 flex items-center justify-between rounded-md bg-blue-900 text-white">
                          <SellIcon fontSize="large" className="text-white" />
                          <span className="flex flex-col items-center">
                            <h1 className="font-normal text-xl">
                              {liquidacion.NombreVendedor.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </h1>
                            <p className="text-gray-300 font-light py-2 text-lg">
                              {new Date(liquidacion.Fecha).toLocaleDateString(
                                "es-CO"
                              )}
                            </p>
                            <span className="font-semibold bg-green-500 p-1 rounded-md text-xl">
                              Liquidada
                            </span>
                          </span>
                          {decodeToken()?.user.role === "Administrador" && (
                            <div className="relative inline-block text-left">
                              <div>
                                <button
                                  type="button"
                                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm p-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                  id="options-menu"
                                  aria-haspopup="true"
                                  aria-expanded="true"
                                  onClick={() =>
                                    setOpenDropdownId(
                                      openDropdownId !== liquidacion.Id
                                        ? liquidacion.Id
                                        : null
                                    )
                                  }
                                >
                                  <EditNoteIcon fontSize="medium" />
                                </button>
                              </div>
                            </div>
                          )}
                        </section>
                        <ul className="text-lg font-light flex flex-col">
                          <div className="grid grid-cols-2">
                            <li className="flex items-center my-1">
                              <AccountBalanceIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Base:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Base)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <PaidIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Gastos:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Gastos)}
                                </p>
                              </span>
                            </li>
                          </div>
                          <div className="grid grid-cols-2">
                            <li className="flex items-center my-1">
                              <SellIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Total Ventas:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Ventas)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <RequestQuoteIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Total Intereses:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Intereses)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <PriceCheckIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Seguros:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Seguros)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <MoneyOffIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Multas:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Multas)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <SavingsIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Abono capital:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.AbonoCapital)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <LocalAtmIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Efectivo:</h3>
                                <p>
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Efectivo)}
                                </p>
                              </span>
                            </li>
                          </div>
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Liquidaciones;
