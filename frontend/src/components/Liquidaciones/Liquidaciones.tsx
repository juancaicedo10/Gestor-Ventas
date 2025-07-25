// Importaciones
import Select from "react-select";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import decodeToken from "../../utils/tokenDecored";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LiquidacionModal from "../../utils/Liquidacion/LiquidacionModal";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PaidIcon from "@mui/icons-material/Paid";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Notificaciones from "../Notificaciones/Notificaciones";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificacionesLiquidacion from "../Notificaciones/NotificacionesLiquidacion";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useVendedorContext } from "../../utils/Context/VendedorSelectedContext";
import HttpClient from "../../Services/httpService";

interface Liquidacion {
  Id: number;
  Base: number;
  Gastos: number;
  Abonos: number;
  TotalRetiros: number;
  VendedorId: number;
  Ventas: number;
  Intereses: number;
  Seguros: number;
  NombreVendedor: string;
  Fecha: string;
  Multas: number;
  AbonoCapital: number;
  Efectivo: number;
  Movimientos: number;
  Consecutivo: string;
  Hora: string;
  BaseCapital: number;
  Cartera: number;
  CarteraRestante: number;
  Detalle: string;
  ClientesActivos: number;
}

interface VendedorOption {
  value: number;
  label: string;
}

export default function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<number>(0);
  const { VendedorSelectedContext } = useVendedorContext();
  const [isMovimientosOpen, setIsMovimientosOpen] = useState(false);
  const [consecutivo, setConsecutivo] = useState("");
  const [vendedorId, setVendedorId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 5]);

  const handlePageClick = (page: number) => setCurrentPage(page);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const getLiquidaciones = () => {
    setIsLoading(true);
    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/liquidaciones/all/todas/todas/${
        decodeToken()?.user?.Id
      }`,
      {
        params: { page: currentPage + 1, limit: 8 },
      }
    )
      .then((res) => {
        setLiquidaciones(res.data.data);
        setPageCount(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const getLiquidacionesByVendedor = (VendedorId: number) => {
    setIsLoading(true);
    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/liquidaciones/${VendedorId}`,
      {
        params: { page: currentPage + 1, limit: 8 },
      }
    )
      .then((res) => {
        setLiquidaciones(
          Array.isArray(res.data.data) ? res.data.data : [res.data.data]
        );
        setPageCount(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const getVendedores = async () => {
    try {
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${
          decodeToken()?.user?.Id
        }/all`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVendedores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const vendedoresOptions: VendedorOption[] = useMemo(
    () => vendedores.map((v) => ({ value: v.Id, label: v.NombreCompleto })),
    [vendedores]
  );

  const handleVendedorChange = (selectedOption: VendedorOption | null) => {
    if (!selectedOption) return;
    setCurrentPage(0);
    setSelectedSeller(selectedOption.value);
  };

  useEffect(() => {
    getVendedores();
  }, []);

  useEffect(() => {
    if (VendedorSelectedContext) {
      setSelectedSeller(VendedorSelectedContext);
    }
  }, [VendedorSelectedContext]);

  useEffect(() => {
    if (selectedSeller && selectedSeller !== 0) {
      getLiquidacionesByVendedor(selectedSeller);
    } else {
      getLiquidaciones();
    }
  }, [selectedSeller, currentPage]);

  const handleNextRange = () =>
    setVisibleRange([visibleRange[0] + 5, visibleRange[1] + 5]);
  const handlePrevRange = () =>
    setVisibleRange([visibleRange[0] - 5, visibleRange[1] - 5]);

  const visiblePages = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, i) => i).slice(
        visibleRange[0],
        visibleRange[1]
      ),
    [pageCount, visibleRange]
  );

  return (
    <section className="fixed left-0 top-0 h-full w-full bg-[#F2F2FF] overflow-auto">
      <Sidebar />
      {isNotificationsOpen && (
        <Notificaciones
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
      {isMovimientosOpen && (
        <NotificacionesLiquidacion
          isOpen={isMovimientosOpen}
          onClose={() => setIsMovimientosOpen(false)}
          Consecutivo={consecutivo}
          VendedorId={vendedorId}
        />
      )}
      {isModalOpen && (
        <LiquidacionModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          getGastos={getLiquidaciones}
        />
      )}

      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex flex-col items-center w-full border-b shadow-md bg-white mb-4">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl text-primary md:text-4xl lg:text-6xl text-center p-2 w-full">
              Liquidaciones
            </h1>
            <div className="flex space-x-4">
              <button
                className="text-primary"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <NotificationsIcon fontSize="large" />
              </button>
              <button className="text-primary" onClick={toggleModal}>
                <AddCircleIcon fontSize="large" />
              </button>
            </div>
          </div>
          <div className="flex justify-center py-4 w-full">
            <Select
              options={vendedoresOptions}
              placeholder="Seleccione un vendedor"
              className="w-1/2 mx-4 text-3xl font-semibold"
              onChange={handleVendedorChange}
              value={vendedoresOptions.find(
                (option) => option.value === selectedSeller
              )}
            />
          </div>
        </header>

        <div
          className={`w-full flex items-center justify-center bg-[#F2F2FF]${
            isLoading ? "h-screen" : ""
          }`}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <div className="w-full flex flex-col">
              <section className="w-full px-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {liquidaciones?.map((liquidacion) => {
                  const fecha = liquidacion.Fecha.split("T")[0];

                  // Formatear la fecha manualmente
                  const [year, month, day] = fecha.split("-");
                  const formattedDate = `${day}/${month}/${year}`;
                  return (
                    <li
                      className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md"
                      key={liquidacion.Id}
                    >
                      <div className="flex flex-col">
                        <section className="w-full p-2 flex items-center justify-between rounded-md bg-primary text-white">
                          <SellIcon fontSize="large" className="text-white" />
                          <span className="flex flex-col items-center">
                            <h1 className="font-normal text-xl">
                              {liquidacion.NombreVendedor.split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </h1>
                            <p className="text-gray-300 font-light py-2 text-lg">
                              {formattedDate}
                            </p>
                            <p>
                              <h6 className="font-normal text-lg pb-1">
                                {liquidacion.Hora}
                              </h6>
                            </p>
                            <span className="font-bold text-2xl">
                              {liquidacion.Consecutivo}
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
                              <AccountBalanceIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Base Capital:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.BaseCapital)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <PaidIcon className="text-secondary" />
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
                              <SellIcon className="text-secondary" />
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
                              <RequestQuoteIcon className="text-secondary" />
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
                              <PriceCheckIcon className="text-secondary" />
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
                              <MoneyOffIcon className="text-secondary" />
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
                              <SavingsIcon className="text-secondary" />
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
                              <LocalAtmIcon className="text-secondary" />
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
                            <li className="flex items-center my-1">
                              <CurrencyExchangeIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Abonos:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Abonos)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <CurrencyExchangeIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Cartera:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Cartera)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <PersonIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Base Vendedor:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.Base)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <CurrencyExchangeIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Cartera Restante:</h3>
                                <p>
                                  {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                  }).format(liquidacion.CarteraRestante)}
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <CurrencyExchangeIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Movimientos:</h3>
                                <p>
                                  <button
                                    onClick={() => {
                                      setConsecutivo(liquidacion.Consecutivo);
                                      setVendedorId(liquidacion.VendedorId);
                                      setIsMovimientosOpen(true);
                                    }}
                                  >
                                    {liquidacion.Movimientos}
                                  </button>
                                </p>
                              </span>
                            </li>
                            <li className="flex items-center my-1">
                              <PersonIcon className="text-secondary" />
                              <span className="mx-4">
                                <h3 className="font-bold">Clientes Activos:</h3>
                                <p>{liquidacion.ClientesActivos}</p>
                              </span>
                            </li>
                          </div>
                          <li className="flex items-center w-full my-1">
                            {liquidacion.Detalle != "" && (
                              <div className="text-lg flex items-center my-1">
                                <LibraryBooksIcon className="text-secondary" />
                                <span className="mx-4">
                                  <h3 className="font-bold">Detalle:</h3>
                                  <p>
                                    <span className="font-light text-black">
                                      {liquidacion.Detalle}
                                    </span>
                                  </p>
                                </span>
                              </div>
                            )}
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </section>
              <div className="flex justify-center mt-4 text-sm">
                {visibleRange[0] > 0 && (
                  <button
                    className="mx-1 px-3 py-1 border rounded-md bg-white text-tertiary font-normal"
                    onClick={handlePrevRange}
                  >
                    Anterior
                  </button>
                )}
                {visiblePages.map((index) => (
                  <button
                    key={index}
                    className={`mx-1 px-3 py-1 border rounded-md font-normal ${
                      currentPage === index
                        ? "bg-tertiary text-white"
                        : "bg-white text-tertiary"
                    }`}
                    onClick={() => handlePageClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                {visibleRange[1] < pageCount && (
                  <button
                    className="mx-1 px-3 py-1 border rounded bg-white text-tertiary font-normal"
                    onClick={handleNextRange}
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
