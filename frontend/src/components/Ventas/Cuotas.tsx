import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import SellIcon from "@mui/icons-material/Sell";
import NumbersIcon from "@mui/icons-material/Numbers";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Spinner from "../../utils/Spinner";
import RegistrarAbonoModal from "../../utils/Ventas/RegistrarAbonoModal";
import { formatDate } from "../../utils/Helpers/FormatDate";
import decodeToken from "../../utils/tokenDecored";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import InteresManualModal from "../../utils/Ventas/InteresManualModal";
import { FormatearFecha } from "../../utils/FormatearFecha";
import ConfirmationModal from "../Shared/ConfirmationModal";
import ModificarAbonoModal from "../../utils/Ventas/ModificarAbonoModal";
import HttpClient from "../../Services/httpService";

interface Cuota {
  Id: number;
  NumeroCuota: number;
  ValorCuota: number;
  SaldoMora: number;
  FechaPago: string;
  SaldoInteres: number;
  Pagada: boolean;
  SaldoInteresManual: number;
  NombreCliente: string;
  abonos: [Abono];
}

export interface Abono {
  Id: number;
  CuotaId: number;
  FechaAbono: string;
  ValorAbono: number;
  InteresAbono: number;
  DetallesAbono: string;
  MoraAbono: number;
  ValorRestante: number;
  SaldoInteresManual: number;
  liquidado: boolean;
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
  InteresManual: number;
  MoraManual: number;
}

function Cuotas() {
  const textConfirmation =
    "Estas Seguro que deseas archivar esta venta?, una vez archivada no podras realizar cambios";

  const url = `${import.meta.env}/ventas/archivar/${useParams()?.id}`;

  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const Id = useParams()?.id;
  const NumeroVenta = useParams()?.numeroVenta;
  const VentaArchivada = useParams()?.archivada;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isArchivada, setIsArchivada] = useState<boolean>(
    VentaArchivada === "true"
  );
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState<boolean>(false);
  const [isModalInteresManualOpen, setIsModalInteresManualOpen] =
    useState<boolean>(false);
  const [cuotaId, setCuotaId] = useState<number>(0);
  const [DatosVenta, setDatosVenta] = useState<DatosVenta>();
  const [openAbonos, setOpenAbonos] = useState<number[]>([]);

  //modals edit functions

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [abonoSelected, setAbonoSelected] = useState<Abono>();

  const toggleAbonoDetails = (cuotaId: number) => {
    if (openAbonos.includes(cuotaId)) {
      setOpenAbonos(openAbonos.filter((id) => id !== cuotaId));
    } else {
      setOpenAbonos([...openAbonos, cuotaId]);
    }
  };

  const getCuotas = () => {
    setIsLoading(true);
    HttpClient.get(`${import.meta.env.VITE_API_URL}/api/cuotas/${Id}`)
      .then((res) => {
        setCuotas(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const descargarDocumento = async (abono: Abono) => {
    const { Id } = abono;

    try {
      const response = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/recibo`,
        { AbonoId: Id },
        { responseType: "blob" } // MUY IMPORTANTE
      );
        // Crear una URL a partir de los datos del archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        // Crear un enlace <a> temporal
        const link = document.createElement("a");
        link.href = url;
        // Asignar un nombre al archivo descargado
        link.setAttribute("download", "factura-abono.pdf");
        // Añadir el enlace al documento y hacer clic para descargar
        document.body.appendChild(link);
        link.click();
        // Limpiar el enlace después de la descarga
        document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error al descargar el documento:", error);
    } 
  };

  const getDatosVenta = async () => {
    await HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/cuotas/datos/${Id}`
    )
      .then((res) => {
        setDatosVenta(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCuotas();
    getDatosVenta();
  }, []);

  return isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner isLoading={isLoading} />
    </div>
  ) : (
    <div>
      <header className="shadow-md bg-white flex flex-col md:flex-row items items-center text-primary justify-between relative">
        <Link to="/ventas" className="absolute left-0 ml-4">
          <ReplyIcon fontSize="large" />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="font-semibold text-primary py-2 text-xl md:text-2xl lg:text-3xl">
            Cuotas para la venta: <br />
            <span className="font-bold text-tertiary">{NumeroVenta}</span>{" "}
            <br />
            <span className="font-semibold text-tertiary text-sm md:text-2xl">
              Cliente:{" "}
            </span>
            <span className="font-semibold text-black text-sm md:text-2xl">
              {cuotas[0]?.NombreCliente}
            </span>{" "}
            <br />
            <span>
              {isArchivada && (
                <span className="text-red-500 text-2xl"> Archivada</span>
              )}
            </span>
          </h1>
        </div>
        {!isArchivada && decodeToken()?.user.role === "Administrador" && (
          <button
            className="bg-red-600 text-white mx-2 p-2 rounded-md shadow-sm md:absolute md:right-0 mr-4"
            onClick={() => setIsModalDeleteOpen(true)}
          >
            Archivar Venta
          </button>
        )}
      </header>
      <section className="w-full px-2">
        <ConfirmationModal
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(!isModalDeleteOpen)}
          text={textConfirmation}
          getData={getCuotas}
          archivada={() => setIsArchivada(true)}
          url={url}
        />
        <RegistrarAbonoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(!isModalOpen)}
          getCuotas={getCuotas}
          getDataCuotas={getDatosVenta}
          cuotaId={cuotaId}
        />
        <ModificarAbonoModal
          isOpen={isOpenEdit}
          onClose={() => setIsOpenEdit(!isOpenEdit)}
          getCuotas={getCuotas}
          getDataCuotas={getDatosVenta}
          cuotaId={cuotaId}
          abonoSelected={abonoSelected}
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
            <tr className="border border-black text-[7px] md:text-sm lg:text-lg text-white bg-secondary">
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
                Multa
              </th>
              <th className="px-1 border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                <PriceCheckIcon fontSize="medium" />
              </th>
              <th className="border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                Interes
              </th>
              {decodeToken().user.role === "Administrador" && !isArchivada && (
                <>
                  <th className="border-r border-black text-center text-[7px] md:text-sm lg:text-lg">
                    Acciones
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota, idx) => {
              const valorCuotaTotal = cuota.ValorCuota + cuota.SaldoInteres;
              return (
                <React.Fragment key={idx}>
                  <tr className="border border-black" key={idx}>
                    <td className="text-center border-r border-black py-4 px-1 text-xs md:text-sm lg:text-lg flex flex-col justify-center items-center">
                      {cuota.NumeroCuota}
                      <button
                        className={`text-xl ${
                          cuota.Pagada || isArchivada
                            ? "hidden"
                            : "text-primary"
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
                        className={`${
                          cuota.Pagada ? "bg-green-500" : "bg-secondary"
                        } text-white text-[7px] md:text-xs rounded-sm p-1 ${
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
                      }).format(valorCuotaTotal)}
                    </td>
                    <td className="text-center border-r px-1 border-black text-[7px] md:text-sm lg:text-lg">
                      {formatDate(cuota.FechaPago)}
                    </td>
                    <td className="text-center border-r px-1 border-black text-[7px] md:text-sm lg:text-lg text-fifth font-semibold">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(cuota.SaldoMora)}
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
                    <td className="text-center border-r border-black text-[7px] md:text-sm lg:text-lg text-fifth font-semibold">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(cuota.SaldoInteresManual)}
                    </td>
                    {decodeToken().user.role === "Administrador" &&
                      !isArchivada && (
                        <>
                          <td className="text-center border-r border-black text-[7px] md:text-sm lg:text-lg text-secondary">
                            <button
                              className="text-[7px]"
                              onClick={() => {
                                setIsModalInteresManualOpen(true);
                                setCuotaId(cuota.Id);
                              }}
                            >
                              {!cuota.Pagada && <ModeEditIcon />}
                            </button>
                          </td>
                        </>
                      )}
                  </tr>
                  <tr className="w-full">
                    {openAbonos.includes(cuota.Id) && (
                      <td colSpan={6}>
                        <div className="w-full flex flex-col justify-center items-center">
                          <section className="w-full md:w-3/4 flex flex-col items-center justify-center bg-white shadow-md my-2 rounded-md p-2">
                            <table className="w-full text-sm text-center">
                              <thead className="font-semibold">
                                <tr>
                                  <th className="text-[7px] md:text-sm lg:text-lg text-secondary">
                                    Valor Abono
                                  </th>
                                  <th className="text-[9px] md:text-sm lg:text-lg text-secondary">
                                    Fecha Abono
                                  </th>
                                  <th className="text-[9px] md:text-sm lg:text-lg text-secondary">
                                    Abono Interes
                                  </th>
                                  <th className="text-[9px] md:text-sm lg:text-lg text-secondary">
                                    Abono Mora
                                  </th>
                                  <th className="text-[9px] md:text-sm lg:text-lg text-secondary">Descargar</th>
                                  {decodeToken()?.user.Id === 14 && (
                                    <th className="text-[9px] md:text-sm lg:text-lg text-secondary">
                                      Acciones
                                    </th>
                                  )}
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
                                    <td className="text-center h-full flex items-center px-1 text-[7px] md:text-sm lg:text-lg">
                                      <button
                                        onClick={() => descargarDocumento(abono)}
                                        className="flex items-center gap-1 text-md font-medium text-secondary hover:text-tertiary transition justify-center w-full"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                          />
                                        </svg>
                                        
                                      </button>
                                    </td>
                                    {decodeToken()?.user.role ===
                                      "Administrador" &&
                                      decodeToken()?.user.Id === 14 &&
                                      !abono.liquidado && (
                                        <td className="text-center px-1 text-[7px] md:text-sm lg:text-lg text-secondary">
                                          <button
                                            onClick={() => {
                                              setIsOpenEdit(true);
                                              setAbonoSelected(abono);
                                              setCuotaId(abono.CuotaId);
                                            }}
                                          >
                                            <ModeEditIcon />
                                          </button>
                                        </td>
                                      )}
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
              );
            })}
          </tbody>
        </table>
        <table className="border-2 border-black bg-[#f7f7f7] shadow-sm w-1/2">
          <thead>
            <tr className="text-white bg-secondary text-center text-[7px] md:text-sm lg:text-lg border-r border-black px-1">
              <th className="py-2 border-r border-black px-1">Valor venta</th>
              <th className="border-r border-black px-1">Valor Cuotas</th>
              <th className="border-r border-black px-1">Total Multa</th>
              <th className="border-r border-black px-1">Total Interes</th>
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
                }).format(DatosVenta?.MoraManual || 0)}
              </td>
              <td className="border-r border-black px-1">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(Number(DatosVenta?.InteresManual || 0))}
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
