
import { useEffect, useState } from "react";
import SellImage from "../../images/Sells.png";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ModeIcon from "@mui/icons-material/Mode";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import { toast } from "react-toastify";
import HttpClient from "../../Services/httpService";
import { formatDate } from "../../utils/Helpers/FormatDate";
import { FormatearFecha } from "../../utils/FormatearFecha";
import decodeToken from "../../utils/tokenDecored";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import { formatCopCurrency } from "../../utils/PricesFormat";


interface VentaAprobar {
  Id: number;
  ClienteId: number;
  NombreCliente: string;
  NombreVendedor: string;
  ValorVenta: number;
  FechaInicio: string;
  FechaServer: string;
  FechaFin: Date;
  NumeroCuotas: number;
  DetallesVenta: string;
  Periodicidad: number;
  TasaInteres: number;
  ValorSeguro: number;
  NumeroVenta: string;
  FechaInicioPago: string;
  ExcedeTope?: boolean | number;
  ValorTopeAplicado?: number | null;
  TopeActualCliente?: number | null;
}

const requiereAmpliarTope = (venta: VentaAprobar) => {
  const tope = Number(venta.TopeActualCliente) || 0;
  return tope > 0 && Number(venta.ValorVenta) > tope;
};

function VentasAprobar() {
  const [sellsToApprove, setSellsToApprove] = useState<VentaAprobar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setIsDisabled] = useState<boolean>(false);
  const [topeDrafts, setTopeDrafts] = useState<Record<number, string>>({});
  const [savingTopeVentaId, setSavingTopeVentaId] = useState<number | null>(
    null
  );

  const actualizarTopeLocal = (clienteId: number, tope: number) => {
    setSellsToApprove((prev) =>
      prev.map((venta) =>
        venta.ClienteId === clienteId
          ? { ...venta, TopeActualCliente: tope }
          : venta
      )
    );
  };

  const handleAmpliarTope = async (venta: VentaAprobar) => {
    const nuevoTope = Number(
      (topeDrafts[venta.Id] ?? String(venta.ValorVenta)).replace(/\D/g, "")
    );

    if (!nuevoTope || nuevoTope < Number(venta.ValorVenta)) {
      toast.warn(
        `El nuevo tope debe ser mínimo ${formatCopCurrency(venta.ValorVenta)}`
      );
      return;
    }

    setSavingTopeVentaId(venta.Id);
    try {
      const res = await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/ventas/topes/cliente/${venta.ClienteId}`,
        { TopeMaximoVenta: nuevoTope }
      );
      actualizarTopeLocal(
        venta.ClienteId,
        Number(res.data?.TopeMaximoVenta ?? nuevoTope)
      );
      toast.success(
        `Tope de ${venta.NombreCliente} ampliado a ${formatCopCurrency(nuevoTope)}`
      );
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "No se pudo ampliar el tope del cliente"
      );
    } finally {
      setSavingTopeVentaId(null);
    }
  };

  const getVentasAprobar = async () => {
    setIsLoading(true);
    try {
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/ventas/aprobar/${
          decodeToken()?.user?.Id
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSellsToApprove(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprobar = async (ventaId: number) => {
    setIsDisabled(true);
    setIsLoading(true);
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/ventas/${ventaId}/aprobar`,
        { aprobado: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Venta aprobada correctamente");
      setIsDisabled(false);
      setSellsToApprove(sellsToApprove.filter((venta) => venta.Id !== ventaId));
      toast.success("Venta aprobada correctamente");
    } catch (err: any) {
      console.error(err);
      const data = err?.response?.data;
      if (data?.requiereAmpliarTope) {
        actualizarTopeLocal(data.clienteId, Number(data.topeActual));
      }
      toast.error(data?.message || "Error al aprobar la venta");
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const handleRechazar = async (ventaId: number) => {
    setIsLoading(true);
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/ventas/${ventaId}/aprobar`,
        { aprobado: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Venta rechazada correctamente");
      toast.success("Venta rechazada correctamente");
      setSellsToApprove(sellsToApprove.filter((venta) => venta.Id !== ventaId));
    } catch (err) {
      console.error(err);
      toast.error("Error al rechazar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVentasAprobar();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="ml-[63px]">
        <h1 className="mb-2 py-4 text-2xl text-primary md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full font-bold">
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
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-primary py-4 text-center w-full md:w-1/2">
                    En este momento no hay ninguna venta por aprobar
                  </h1>
                </div>
              </div>
            ) : (
              <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:ml-4 px-2">
                {sellsToApprove.map((venta) => {
                  const bloqueadaPorTope = requiereAmpliarTope(venta);
                  const topeActual = Number(venta.TopeActualCliente) || 0;

                  return (
                  <li key={venta.Id} className="flex flex-col w-full mb-2">
                    {bloqueadaPorTope && (
                      <div className="w-full bg-red-600 text-white py-2 px-3 rounded-t-md border-2 border-red-700">
                        <p className="font-bold text-center">
                          Esta venta supera el tope del cliente (
                          {formatCopCurrency(topeActual)})
                        </p>
                        <p className="text-sm text-center mt-1">
                          Para aprobarla, amplía el tope a mínimo{" "}
                          {formatCopCurrency(venta.ValorVenta)}.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="flex-1 min-w-0 rounded-md px-2 py-1 text-gray-800"
                            value={
                              topeDrafts[venta.Id] ?? String(venta.ValorVenta)
                            }
                            onChange={(e) =>
                              setTopeDrafts((prev) => ({
                                ...prev,
                                [venta.Id]: e.target.value.replace(/\D/g, ""),
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="bg-white text-red-700 font-semibold px-3 py-1 rounded-md hover:bg-red-50 disabled:opacity-60"
                            disabled={savingTopeVentaId === venta.Id}
                            onClick={() => handleAmpliarTope(venta)}
                          >
                            {savingTopeVentaId === venta.Id
                              ? "Guardando..."
                              : "Ampliar tope"}
                          </button>
                        </div>
                      </div>
                    )}
                    {!bloqueadaPorTope && !!venta.ExcedeTope && (
                      <div className="w-full bg-amber-100 text-amber-900 font-semibold text-center py-2 px-3 rounded-t-md border-2 border-amber-300">
                        Superaba el tope de{" "}
                        {formatCopCurrency(Number(venta.ValorTopeAplicado ?? 0))}.
                        Tope actual:{" "}
                        {topeActual > 0
                          ? formatCopCurrency(topeActual)
                          : "sin tope"}
                      </div>
                    )}
                    <div className="w-full">
                      <button
                        className="bg-green-50 text-green-500 px-2 py-1 rounded-md w-1/2 border-2 border-green-500 font-bold text-xl hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-50"
                        disabled={disabled || bloqueadaPorTope}
                        title={
                          bloqueadaPorTope
                            ? "Amplía el tope del cliente para aprobar"
                            : undefined
                        }
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
                    <div className="bg-primary rounded-md p-2 md:p-4">
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
                      <p className="text-lg text-primary flex items-center">
                        <AttachMoneyIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Valor de la venta:</h6>
                          <span>
                            {formatCopCurrency(venta.ValorVenta)}
                          </span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <AttachMoneyIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Valor Seguro:</h6>
                          <span>
                            {formatCopCurrency(venta.ValorSeguro)}
                          </span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <CalendarMonthIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Fecha de Creacion:</h6>
                          <span>
                            {`${formatDate(venta.FechaServer)} ${FormatearFecha(
                              venta.FechaServer
                            )}`}
                          </span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <CalendarMonthIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Fecha de Inicio:</h6>
                          <span>{formatDate(venta.FechaInicioPago)}</span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <AccountBalanceIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Numero de cuotas:</h6>
                          <span>{venta.NumeroCuotas}</span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <AccessAlarm />
                        <span className="m-1">
                          <h6 className="font-semibold">Periodicidad:</h6>
                          <span>cada {venta.Periodicidad} dias</span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <ModeIcon />
                        <span className="m-1">
                          <h6 className="font-semibold flex">Tasa Interes:</h6>
                          <span>{venta.TasaInteres} %</span>
                        </span>
                      </p>
                      <p className="text-lg text-primary flex items-center">
                        <ModeIcon />
                        <span className="m-1">
                          <h6 className="font-semibold flex">Detalles:</h6>
                          <span>{venta.DetallesVenta}</span>
                        </span>
                      </p>
                    </div>
                  </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VentasAprobar;

