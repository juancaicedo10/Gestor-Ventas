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
import { formatDate } from "../utils/Helpers/FormatDate";
import decodeToken from "../utils/tokenDecored";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import InteresManualModal from "../utils/Ventas/InteresManualModal";
import { FormatearFecha } from "../utils/FormatearFecha";

interface Cuota {
  Id: number;
  NumeroCuota: number;
  ValorCuota: number;
  SaldoMora: number;
  FechaPago: string;
  SaldoInteres: number;
  Pagada: boolean;
  SaldoInteresManual: number;
  abonos: [Abono];
}

interface Abono {
  CuotaId: number;
  FechaAbono: string;
  ValorAbono: number;
  InteresAbono: number;
  DetallesAbono: string;
  MoraAbono: number;
  ValorRestante: number;
  SaldoInteresManual: number;
  SaldoMoraManual: number;
}

interface DatosVenta {
  ValorVenta: number;
  ValorCuotas: number;
  MoraTotal: number;
  InteresTotal: number;
  TotalAbonado: number;
  SaldoRestante: number;
  TotalAPagar: number;
}

function Cuotas() {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const Id = useParams()?.id;
  const NumeroVenta = useParams()?.numeroVenta;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalInteresManualOpen, setIsModalInteresManualOpen] =
    useState<boolean>(false);
  const [cuotaId, setCuotaId] = useState<number>(0);
  const [DatosVenta, setDatosVenta] = useState<DatosVenta>();
  const [isDetallesAbonoOpen, setIsDetallesAbonoOpen] = useState<boolean>(true);
  const [openAbonos, setOpenAbonos] = useState<number[]>([]);

  const toggleAbonoDetails = (cuotaId: number) => {
    console.log(cuotaId, 'cuotaId');
    console.log(openAbonos, 'open abonos');
    if (openAbonos.includes(cuotaId)) {
      setOpenAbonos(openAbonos.filter((id) => id !== cuotaId));
    } else {
      setOpenAbonos([...openAbonos, cuotaId]);
    }
  };

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

  const getDatosVenta = async () => {
    await axios
      .get(
        `https://backendgestorventas.azurewebsites.net/api/cuotas/datos/${Id}`
      )
      .then((res) => {
        setDatosVenta(res.data);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const detallesAbonoModal = () => {
    setIsDetallesAbonoOpen(!isDetallesAbonoOpen);
  };

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
        <InteresManualModal
          isOpen={isModalInteresManualOpen}
          onClose={() => setIsModalInteresManualOpen(!isModalInteresManualOpen)}
          getCuotas={getCuotas}
          getDataCuotas={getDatosVenta}
          cuotaId={cuotaId}
        />
      </section>
      <div className="flex justify-center flex-col items-center w-full px-1 overflow-hidden">
        <table className="border-2 border-black my-4 bg-[#f7f7f7] shadow-lg w-full md:w-3/4">
          <thead>
            <tr className="border border-black text-[7px] md:text-sm lg:text-lg text-white bg-blue-800">
              <th className="border-r border-black py-4 text-[7px] md:text-sm lg:text-lg">
                <NumbersIcon fontSize="small" />
              </th>
              <th className="border-r border-black text-[7px] md:text-sm lg:text-lg">
                <SellIcon fontSize="inherit" /> Valor
              </th>
              <th className="border-r border-black text-[7px] md:text-sm lg:text-lg">
                <DateRangeIcon fontSize="inherit" /> Fecha
              </th>
              <th className="border-r border-black text-[7px] md:text-sm lg:text-lg">
                <SellIcon fontSize="inherit" />
                Mora
              </th>
              <th className="border-r border-black text-[7px] md:text-sm lg:text-lg">
                Interes
              </th>
              <th className="px-1 border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                <PriceCheckIcon fontSize="medium" />
              </th>
              <th className="border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                Int.Manual
              </th>
              {decodeToken().user.role === "Administrador" && (
                <>
                  <th className="border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                    Acciones
                  </th>
                </>
              )}
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
                      className={`bg-blue-800 text-white text-[7px] md:text-xs rounded-sm p-1 ${
                        cuota.abonos.length < 1 && "hidden"
                      }`}
                      onClick={() => {
                        toggleAbonoDetails(cuota.Id);
                      }}
                      disabled={cuota.abonos.length < 1}
                    >
                      abonos
                    </button>
                  </td>
                  <td className="text-center border-r border-black px-1 text-[7px] md:text-sm lg:text-lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(cuota.ValorCuota)}
                  </td>
                  <td className="text-center border-r px-1 border-black text-[7px] md:text-sm lg:text-lg">
                    {formatDate(cuota.FechaPago)}
                  </td>
                  <td className="text-center border-r px-1 border-black text-[7px] md:text-sm lg:text-lg">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(cuota.SaldoMora)}
                    $
                  </td>
                  <td className="text-center text-[7px] md:text-sm lg:text-lg border-r border-black px-1">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(cuota.SaldoInteres)}
                  </td>
                  <td className="text-center border-r border-black text-[7px] md:text-sm lg:text-lg px-1">
                    <span
                      className={`${
                        cuota.Pagada
                          ? "bg-green-200 text-green-500 px-2 text-[7px] md:text-sm lg:text-lg rounded-sm"
                          : "bg-red-200 text-red-500 px-1 text-[7px] md:text-sm lg:text-lg rounded-sm"
                      }`}
                    >
                      {cuota.Pagada ? "Si" : "No"}
                    </span>
                  </td>
                  <td className="text-center border-r border-black text-[7px] md:text-sm lg:text-lg">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(cuota.SaldoInteresManual)}
                  </td>
                  {decodeToken().user.role === "Administrador" && (
                    <>
                      <td className="text-center border-r border-black text-[7px] md:text-sm lg:text-lg text-blue-800">
                        <button
                          className="text-[7px]"
                          onClick={() => {
                            setIsModalInteresManualOpen(true);
                            setCuotaId(cuota.Id);
                          }}
                        >
                          <ModeEditIcon />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  {openAbonos.includes(cuota.Id) && (
                    <td colSpan={8}>
                      <div className="w-full flex flex-col justify-center items-center">
                        <section className="w-full md:w-3/4 flex flex-col items-center justify-center bg-white shadow-md my-2 rounded-md p-2">
                          <table className="w-full text-sm text-center">
                            <thead className="font-semibold">
                              <tr>
                                <th className="text-[7px] md:text-sm lg:text-lg text-blue-800">
                                  Valor Abono
                                </th>
                                <th className="text-[9px] md:text-sm lg:text-lg text-blue-800">
                                  Fecha Abono
                                </th>
                                <th className="text-[9px] md:text-sm lg:text-lg text-blue-800">
                                  Abono Interes
                                </th>
                                <th className="text-[9px] md:text-sm lg:text-lg text-blue-800">
                                  Abono Mora
                                </th>
                                <th className="text-[9px] md:text-sm lg:text-lg text-blue-800">
                                  interes Manual
                                </th>
                                <th className="text-[9px] md:text-sm lg:text-lg text-blue-800">
                                  Mora Manual
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {cuota.abonos.map((abono, index) => (
                                <tr key={index}>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg">
                                    {" "}
                                    {new Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                    }).format(abono?.ValorAbono || 0)}
                                  </td>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg flex flex-col ">
                                    {formatDate(abono.FechaAbono) +
                                      " " +
                                      FormatearFecha(abono?.FechaAbono)}
                                  </td>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg">
                                    {new Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                    }).format(abono?.InteresAbono || 0)}
                                  </td>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg">
                                    {new Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                    }).format(abono?.MoraAbono || 0)}
                                  </td>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg">
                                    {new Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                    }).format(abono?.SaldoInteresManual || 0)}
                                  </td>
                                  <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg">
                                    {new Intl.NumberFormat("es-CO", {
                                      style: "currency",
                                      currency: "COP",
                                    }).format(abono?.SaldoMoraManual || 0)}
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
            <tr className="text-white bg-blue-800 text-center text-[7px] md:text-sm lg:text-lg border-r border-black px-1">
              <th className="py-2 border-r border-black px-1">Valor venta</th>
              <th className="border-r border-black px-1">Valor Cuotas</th>
              <th className="border-r border-black px-1">Mora Total</th>
              <th className="border-r border-black px-1">Interes Total</th>
              <th className="border-r border-black px-1">Total Abonado</th>
              <th className="border-r border-black px-1">Valor a Pagar</th>
              <th className="px-1">Valor restante</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-[7px] md:text-sm lg:text-lg border-r border-black px-1">
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
                }).format(DatosVenta?.InteresTotal || 0)}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(Number(DatosVenta?.TotalAbonado || 0))}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(Number(DatosVenta?.TotalAPagar || 0))}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(Number(DatosVenta?.SaldoRestante || 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cuotas;
