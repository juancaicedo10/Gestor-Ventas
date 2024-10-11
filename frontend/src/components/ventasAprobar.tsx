import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import SellImage from "../images/Sells.png";
import axios from "axios";
import Spinner from "../utils/Spinner";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ModeIcon from '@mui/icons-material/Mode';
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import { toast } from "react-toastify";
import decodeToken from "../utils/tokenDecored";

interface VentaAprobar {
  Id: number;
  NombreCliente: string;
  NombreVendedor: string;
  ValorVenta: number;
  FechaInicio: Date;
  FechaFin: Date;
  NumeroCuotas: number;
  DetallesVenta: number;
  Periodicidad: number;
  TasaInteres: number;
  ValorSeguro: number;
  NumeroVenta: string;
}

function VentasAprobar() {
  const [sellsToApprove, setSellsToApprove] = useState<VentaAprobar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getVentasAprobar = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://backend-gestor-ventas.onrender.com/api/ventas/aprobar/${decodeToken()?.user?.Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSellsToApprove(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprobar = async (ventaId: number) => {
    setIsLoading(true);
    try {
      await axios.put(
        `https://backend-gestor-ventas.onrender.com/api/ventas/${ventaId}/aprobar`,
        { aprobado: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Venta aprobada correctamente");
      getVentasAprobar();
      toast.success("Venta aprobada correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechazar = async (ventaId: number) => {
    setIsLoading(true);
    try {
      await axios.put(
        `https://backend-gestor-ventas.onrender.com/api/ventas/${ventaId}/aprobar`,
        { aprobado: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Venta rechazada correctamente");
      toast.success("Venta rechazada correctamente");
      getVentasAprobar(); // Refresh the list after rejecting
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar la venta");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getVentasAprobar();
  }, []);

  console.log(sellsToApprove);

  return (
    <div>
      <Sidebar />
      <div className="ml-[63px]">
        <h1 className="mb-2 py-4 text-2xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full font-bold">
          Ventas por aprobar
        </h1>
        {isLoading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <Spinner isLoading={isLoading} />
          </div>
        ) : (
          <div>
            {sellsToApprove.length === 0 ? (
              <div className="flex w-full h-[80vh] items-center justify-center">
                <div className="flex items-center flex-col justify-center w-full">
                  <img
                    src={SellImage}
                    alt="venta imagen"
                    className="w-3/4 md:w-1/4"
                  />
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-blue-900 py-4 text-center w-full md:w-1/2">
                    En este momento no hay ninguna venta por aprobar
                  </h1>
                </div>
              </div>
            ) : (
              <ul
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:ml-4 px-2"
            >
                {sellsToApprove.map((venta) => (
                    <li key={venta.Id} className="flex flex-col w-full mb-2">
                      <div className="w-full">
                        <button
                          className="bg-green-50 text-green-500 px-2 py-1 rounded-md w-1/2 border-2 border-green-500 font-bold text-xl hover:bg-green-200"
                          onClick={() => handleAprobar(venta.Id)}
                        >
                          Aprobar
                        </button>
                        <button
                          className="bg-red-50 text-red-500 px-2 py-1 rounded-md w-1/2 border-2 border-red-500 font-bold text-xl hover:bg-red-200"
                          onClick={() => handleRechazar(venta.Id)}
                        >
                          Rechazar
                        </button>
                      </div>
                      <div className="bg-blue-900 rounded-md p-2 md:p-4">
                        <p className="text-lg text-white flex flex-col justify-center items-center md:flex-row md:justify-start">
                          <span className="font-semibold mr-2">Cliente:</span>{" "}
                          <h6 className="font-normal">{venta.NombreCliente}</h6>
                        </p>
                        <p className="text-lg text-white flex flex-col justify-center items-center md:flex-row md:justify-start">
                          <span className="font-semibold mr-2">Vendedor:</span>{" "}
                          <h6 className="font-normal">{venta.NombreVendedor}</h6>
                        </p>
                      </div>
                      <div className="bg-white rounded-md border shadow-sm p-2">
                        <p className="text-lg text-blue-900 flex items-center">
                          <AttachMoneyIcon />
                          <span className="m-1">
                            <h6 className="font-semibold">
                              Valor de la venta:
                            </h6>
                            <span>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(venta.ValorVenta)}
                            </span>
                          </span>
                        </p>
                        <p className="text-lg text-blue-900 flex items-center">
                          <CalendarMonthIcon />
                          <span className="m-1">
                            <h6 className="font-semibold">
                              Fecha de inicio Estimada:
                            </h6>
                            <span>
                              {new Date(venta.FechaInicio).toLocaleDateString()}
                            </span>
                          </span>
                        </p>
                        <p className="text-lg text-blue-900 flex items-center">
                          <AccountBalanceIcon />
                          <span className="m-1">
                            <h6 className="font-semibold">Numero de cuotas:</h6>
                            <span>{venta.NumeroCuotas}</span>
                          </span>
                        </p>
                        <p className="text-lg text-blue-900 flex items-center">
                          <AccessAlarm />
                          <span className="m-1">
                            <h6 className="font-semibold">Periodicidad:</h6>
                            <span>cada {venta.Periodicidad} dias</span>
                          </span>
                        </p>
                        <p className="text-lg text-blue-900 flex items-center">
                          <ModeIcon />
                          <span className="m-1">
                            <h6 className="font-semibold flex">Tasa Interes:</h6>
                            <span>{venta.TasaInteres} %</span>
                          </span>
                        </p>
                        <p className="text-lg text-blue-900 flex items-center">
                          <ModeIcon />
                          <span className="m-1">
                            <h6 className="font-semibold flex">Detalles:</h6>
                            <span>{venta.DetallesVenta}</span>
                          </span>
                        </p>
                      </div>
                    </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VentasAprobar;
