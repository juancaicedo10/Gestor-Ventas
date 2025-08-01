
import { useEffect, useState } from "react";
import SellsImage from "../../images/Sells.png";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ModeIcon from '@mui/icons-material/Mode';
import { toast } from "react-toastify";
import HttpClient from "../../Services/httpService";
import decodeToken from "../../utils/tokenDecored";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import { formatDate } from "../../utils/Helpers/FormatDate";

interface GastoAprobar {
  Id: number;
  GastoId: number;
  Nombre: string;
  Descripcion: string;
  Monto: number;
  Fecha: string;
  NombreVendedor: string;
}

function GastosAprobar() {
  const [sellsToApprove, setSellsToApprove] = useState<GastoAprobar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setIsDisabled] = useState<boolean>(false);

  const getgastosAprobar = async () => {
    setIsLoading(true);
    try {
      const res = await HttpClient.get(`${import.meta.env.VITE_API_URL}/api/gastos/aprobar/${decodeToken()?.user?.Id}/all`, {
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

  const handleAprobar = async (gastoId: number) => {
    setIsDisabled(true);
    setIsLoading(true);
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/gastos/${gastoId}/aprobar`,
        { aprobado: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("gasto aprobado correctamente");
      setSellsToApprove(sellsToApprove.filter((gasto) => gasto.Id !== gastoId));
      toast.success("gasto aprobado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al aprobar el gasto");
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const handleRechazar = async (gastoId: number) => {
    setIsLoading(true);
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/gastos/${gastoId}/aprobar`,
        { aprobado: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("gasto rechazado correctamente");
      toast.success("gasto rechazado correctamente");
      setSellsToApprove(sellsToApprove.filter((gasto) => gasto.Id !== gastoId));
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar el gasto");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getgastosAprobar();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="ml-[63px]">
        <h1 className="mb-2 py-4 text-2xl text-primary md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full font-bold">
          Gastos por aprobar
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
                    src={SellsImage}
                    alt="gasto imagen"
                    className="w-3/4 md:w-1/4"
                  />
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-primary py-4 text-center w-full md:w-1/2">
                    En este momento no hay ningun gasto por aprobar
                  </h1>
                </div>
              </div>
            ) : (
              <ul
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:ml-4 px-2"
            >
                {sellsToApprove.map((gasto) => (
                    <li key={gasto.Id} className="flex flex-col w-full mb-2">
                      <div className="w-full">
                        <button
                          className="bg-green-50 text-green-500 px-2 py-1 rounded-md w-1/2 border-2 border-green-500 font-bold text-xl hover:bg-green-200"
                          onClick={() => handleAprobar(gasto.Id)}
                          disabled={disabled}
                        >
                          Aprobar
                        </button>
                        <button
                          className="bg-red-50 text-red-500 px-2 py-1 rounded-md w-1/2 border-2 border-red-500 font-bold text-xl hover:bg-red-200"
                          onClick={() => handleRechazar(gasto.Id)}
                        >
                          Rechazar
                        </button>
                      </div>
                      <div className="bg-primary rounded-md p-2 md:p-4">
                        <p className="text-lg text-white flex flex-col justify-center items-center md:flex-row md:justify-start">
                          <span className="font-semibold mr-2">Vendedor:</span>{" "}
                          <h6 className="font-normal">{gasto.NombreVendedor}</h6>
                        </p>
                        <p className="text-lg text-white flex flex-col justify-center items-center md:flex-row md:justify-start">
                          <span className="font-semibold mr-2">Gasto:</span>{" "}
                          <h6 className="font-normal">{gasto.Nombre}</h6>
                        </p>
                      </div>
                      <div className="bg-white rounded-md border shadow-sm p-2">
                        <p className="text-lg text-primary flex items-center">
                          <AttachMoneyIcon />
                          <span className="m-1">
                            <h6 className="font-semibold">
                              Valor de la gasto:
                            </h6>
                            <span>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(gasto.Monto)}
                            </span>
                          </span>
                        </p>
                        <p className="text-lg text-primary flex items-center">
                          <CalendarMonthIcon />
                          <span className="m-1">
                            <h6 className="font-semibold">
                              Fecha del Gasto:
                            </h6>
                            <span>
                              {formatDate(gasto.Fecha)}
                            </span>
                          </span>
                        </p>
                        <p className="text-lg text-primary flex items-center">
                          <ModeIcon />
                          <span className="m-1">
                            <h6 className="font-semibold flex">Detalles:</h6>
                            <span>{gasto.Descripcion}</span>
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

export default GastosAprobar;
