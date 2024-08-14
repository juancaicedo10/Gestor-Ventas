import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SellIcon from "@mui/icons-material/Sell";
import NumbersIcon from "@mui/icons-material/Numbers";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Spinner from "../utils/Spinner";
import RegistrarAbonoModal from "../utils/Ventas/RegistrarAbonoModal";

interface Cuota {
  Id: number;
  NumeroCuota: number;
  ValorCuota: number;
  SaldoMora: number;
  FechaPago: string;
  SaldoInteres: number;
  Pagada: boolean;
  abonos: [Abono];
}

interface Abono {
  CuotaId: number;
  FechaAbono: string;
  ValorAbono: number;
  InteresAbono: number;
  DetallesAbono: string;
  MoraAbono: number;
  SaldoRestante: number;
}

interface DatosVenta {
  ValorVenta: number;
  ValorCuotas: number;
  MoraTotal: number;
  TotalAbonado: number;
}

function Cuotas() {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const Id = useParams()?.id;
  const NumeroVenta = useParams()?.numeroVenta;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cuotaId, setCuotaId] = useState<number>(0);
  const [DatosVenta, setDatosVenta] = useState<DatosVenta>();
  const [isDetallesAbonoOpen, setIsDetallesAbonoOpen] = useState<boolean>(true);

  console.log(cuotas);

  const getCuotas = () => {
    setIsLoading(true);
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/cuotas/${Id}`)
      .then((res) => {
        setCuotas(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  console.log(Id);

  const getDatosVenta = async () => {
    await axios
      .get(`https://backendgestorventas.azurewebsites.net/api/cuotas/datos/${Id}`)
      .then((res) => {
        setDatosVenta(res.data);
        console.log("oe:", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("datos venta:", DatosVenta?.ValorVenta);

  useEffect(() => {
    setIsDetallesAbonoOpen(false);
    getCuotas();
    getDatosVenta();
  }, []);

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner isLoading={isLoading} />
    </div>
  ) : (
    <div>
      <header className="shadow-md bg-white flex items-center text-blue-900">
        <Link to="/ventas" className="w-1/4 absolute">
          <ReplyIcon fontSize="large" />
        </Link>
        <h1 className="font-semibold text-blue-900 py-2 text-xl md:text-2xl lg:text-3xl text-center w-full">
          Cuotas para la venta: <br />
          <span className="font-bold text-blue-700">{NumeroVenta}</span>{" "}
        </h1>
      </header>
      <section className="w-full px-2">
        <RegistrarAbonoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(!isModalOpen)}
          getCuotas={getCuotas}
          getDataCuotas={getDatosVenta}
          cuotaId={cuotaId}
        />
      </section>
      <div className="flex justify-center flex-col items-center w-full px-1 overflow-hidden">
        <table className="border-2 border-black my-4 bg-[#f7f7f7] shadow-lg w-full md:w-3/4">
          <thead>
            <tr className="border border-black text-xs md:text-sm lg:text-lg text-white bg-blue-800">
              <th className="border-r border-black py-4 text-xs md:text-sm lg:text-lg">
                <NumbersIcon fontSize="small" />
              </th>
              <th className="border-r border-black text-xs md:text-sm lg:text-lg">
                <SellIcon fontSize="inherit" /> Valor
              </th>
              <th className="border-r border-black text-xs md:text-sm lg:text-lg">
                <DateRangeIcon fontSize="inherit" /> Fecha
              </th>
              <th className="border-r border-black text-xs md:text-sm lg:text-lg">
                <SellIcon fontSize="inherit" />
                Mora
              </th>
              <th className="border-r border-black text-xs md:text-sm lg:text-lg">
                Interes
              </th>
              <th className="px-1 text-center text-xs md:text-sm lg:text-lg">
                <PriceCheckIcon fontSize="medium" />
              </th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota, idx) => (
              <React.Fragment key={idx}>
                <tr className="border border-black">
                  <td className="text-center border-r border-black py-4 px-1 text-xs md:text-sm lg:text-lg flex flex-col justify-center items-center">
                    {cuota.NumeroCuota}
                    <button
                      className={`text-xl ${
                        cuota.Pagada ? "hidden" : "text-blue-900"
                      }`}
                      onClick={() => {
                        setIsModalOpen(true);
                        setCuotaId(cuota.Id);
                      }}
                      disabled={cuota.Pagada}
                    >
                      <AddCircleIcon fontSize="inherit" />
                    </button>
                    <button
                      className={`bg-blue-800 text-white text-xs rounded-sm p-1 ${cuota.abonos.length < 1 && "hidden"}`}
                      onClick={() => {
                        setIsDetallesAbonoOpen(!isDetallesAbonoOpen);
                        setCuotaId(cuota.Id);
                      }}
                      disabled={cuota.abonos.length < 1}
                    >
                      abonos
                    </button>
                  </td>
                  <td className="text-center border-r border-black px-1 text-xs md:text-sm lg:text-lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(cuota.ValorCuota)}
                  </td>
                  <td className="text-center border-r px-1 border-black text-xs md:text-sm lg:text-lg">
                    {new Date(cuota.FechaPago).toLocaleDateString("es-CO")}
                  </td>
                  <td className="text-center border-r px-1 border-black text-xs md:text-sm lg:text-lg">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(cuota.SaldoMora)}
                    $
                  </td>
                  <td className="text-center text-xs md:text-sm lg:text-lg border-r border-black px-1">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(cuota.SaldoInteres)}
                    $
                  </td>
                  <td className="text-center border-r border-black text-xs md:text-sm lg:text-lg px-1">
                    <span
                      className={`${
                        cuota.Pagada
                          ? "bg-green-200 text-green-500 px-2 text-xs md:text-sm lg:text-lg rounded-sm"
                          : "bg-red-200 text-red-500 px-1 text-xs md:text-sm lg:text-lg rounded-sm"
                      }`}
                    >
                      {cuota.Pagada ? "Si" : "No"}
                    </span>
                  </td>
                </tr>
                <tr>
                  {isDetallesAbonoOpen &&
                    cuota.Id === cuotaId &&
                    cuota.abonos.length > 0 && (
                      <td colSpan={6}>
                        <div className="w-full flex flex-col justify-center items-center">
                          <section className="w-full md:w-3/4 flex flex-col items-center justify-center bg-white shadow-md my-2 rounded-md p-2">
                            <table className="w-full text-lg text-center">
                              <thead className="font-semibold">
                                <tr>
                                  <th className="text-xs md:text-sm lg:text-lg text-blue-800">
                                    Valor Abono
                                  </th>
                                  <th className="text-xs md:text-sm lg:text-lg text-blue-800">
                                    Fecha Abono
                                  </th>
                                  <th className="text-xs md:text-sm lg:text-lg text-blue-800">
                                    Abono Interes
                                  </th>
                                  <th className="text-xs md:text-sm lg:text-lg text-blue-800">
                                    Abono Mora
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {cuota.abonos.map((abono, index) => (
                                  <tr key={index}>
                                    <td className="text-center px-1 text-xs md:text-sm lg:text-lg">
                                      {" "}
                                      {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                      }).format(abono?.ValorAbono || 0)}
                                    </td>
                                    <td className="text-center px-1 text-xs md:text-sm lg:text-lg">
                                    {new Date(cuota.FechaPago).toLocaleDateString("es-CO")}
                                    </td>
                                    <td className="text-center px-1 text-xs md:text-sm lg:text-lg">
                                      {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                      }).format(abono?.InteresAbono || 0)}
                                    </td>
                                    <td className="text-center px-1 text-xs md:text-sm lg:text-lg">
                                      {new Intl.NumberFormat("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                      }).format(abono?.MoraAbono || 0)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </section>
                        </div>
                      </td>
                    )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <table className="border-2 border-black bg-[#f7f7f7] shadow-sm w-1/2">
          <thead>
            <tr className="text-white bg-blue-800 text-center text-xs md:text-sm lg:text-lg border-r border-black px-1">
              <th className="py-2 border-r border-black px-1">Valor venta</th>
              <th className="border-r border-black px-1">Valor Cuotas</th>
              <th className="border-r border-black px-1">Mora Total</th>
              <th className="px-1">Total Abonado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-xs md:text-sm lg:text-lg border-r border-black px-1">
              <td className="py-2 border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(DatosVenta?.ValorVenta || 0)}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(DatosVenta?.ValorCuotas || 0)}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(DatosVenta?.MoraTotal || 0)}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(Number(DatosVenta?.TotalAbonado || 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cuotas;
