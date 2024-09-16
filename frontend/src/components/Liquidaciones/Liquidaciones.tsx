import axios from "axios";
import Select from "react-select";
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
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Notificaciones from "../Notificaciones/Notificaciones";  
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificacionesLiquidacion from "../Notificaciones/NotificacionesLiquidacion";
import PersonIcon from '@mui/icons-material/Person';


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
  Movimientos : number;
  Consecutivo: string;
  Hora: string;
  BaseCapital: number;
  Cartera: number;
}

function Liquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [vendedores, setVendedores] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(0);


  const [isMovimientosOpen, setIsMovimientosOpen] = useState(false);

  const [consecutivo, setConsecutivo] = useState("");
  const [vendedorId, setVendedorId] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Funciones para manejar los modales
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  // Función para obtener la lista de vendedores
  const getLiquidaciones = () => {
    setIsLoading(true);
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/liquidaciones/all")
      .then((res) => {
        setLiquidaciones(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getLiquidacioneaByVendedor = (VendedorId: number) => {
    setIsLoading(true);
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/liquidaciones/${VendedorId}`)
      .then((res) => {
        setLiquidaciones(Array.isArray(res.data) ? res.data : [res.data]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

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
  }

  const vendedoresOptions = vendedores.map((vendedor: any) => ({
    value: vendedor.Id,
    label: vendedor.NombreCompleto,
  }));

  const handleVendedorChange = (selectedOption: any) => {
    setSelectedSeller(selectedOption.value);
    getLiquidacioneaByVendedor(Number(selectedOption.value));
  }

  useEffect(() => {
    getVendedores();
    getLiquidaciones();
  }, []);

  return (
    <section className="fixed left-0 top-0 h-full w-full bg-[#F2F2FF] overflow-auto">
      <Sidebar />
      <Notificaciones isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)}/>
      <NotificacionesLiquidacion isOpen={isMovimientosOpen} onClose={() => setIsMovimientosOpen(false)} Consecutivo={consecutivo} VendedorId={vendedorId}/>
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex flex-col items-center w-full border-b shadow-md bg-white mb-4">
        <div className="flex justify-between items-center w-full">
  <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-center p-2 w-full">
    Liquidaciones
  </h1>
  <div className="flex space-x-4">
    <button className="text-blue-900" onClick={() => setIsNotificationsOpen(true)}>
      <NotificationsIcon fontSize="large" />
    </button>
    <button className="text-blue-900" onClick={toggleModal}>
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
              value={vendedoresOptions.find((option) => option.value === selectedSeller)}
            />
          </div>
        </header>
        <div
          className={`w-full flex items-center justify-center bg-[#F2F2FF]${
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
                {liquidaciones?.map((liquidacion) => {
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
                              {new Date(liquidacion.Fecha).toLocaleDateString()}
                            </p>
                            <p>
                              <h6 className="font-normal text-lg pb-1">{ liquidacion.Hora }</h6>
                            </p>
                            <span className="font-bold text-2xl">
                              { liquidacion.Consecutivo }
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
                            <li className="flex items-center my-1">
                              <CurrencyExchangeIcon className="text-blue-800" />
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
                              <CurrencyExchangeIcon className="text-blue-800" />
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
                              <PersonIcon className="text-blue-800" />
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
                              <CurrencyExchangeIcon className="text-blue-800" />
                              <span className="mx-4">
                                <h3 className="font-bold">Movimientos:</h3>
                                <p>
                                  <button
                                  onClick={
                                    () => {
                                      setConsecutivo(liquidacion.Consecutivo);
                                      setVendedorId(liquidacion.VendedorId);
                                      setIsMovimientosOpen(true);
                                    }
                                  }>
                                    {liquidacion.Movimientos}
                                  </button>
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
