import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { FormatearFecha } from "../../utils/FormatearFecha";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/Helpers/FormatDate";
import HttpClient from "../../Services/httpService";

interface Props {
  isOpen: boolean;
  VendedorId: number;
  onClose: () => void;
}

interface Notificacion {
  Fecha: string;
  NombreCliente: string;
  NombreVendedor: string;
  NumeroVenta: string;
  TipoId: number;
  TipoSeguimiento: string;
  Valor: number;
  ValorSeguro: number;
  ValorMulta: number;
  ValorInteres: number;
  Liquidacionconse: string;
  VentaId: number;
  NombreGasto: string;
  Detalle: string;
  Archivada: boolean;
}

const NotificacionesToLiquidar: React.FC<Props> = ({
  isOpen,
  onClose,
  VendedorId,
}) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const getNotificaciones = async (VendedorIdNoti: number) => {
    try {
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/notificaciones/pendientes/${VendedorIdNoti}`
      );
      setNotificaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las notificaciones", error);
    }
  };

  useEffect(() => {
    getNotificaciones(VendedorId);
  }, [isOpen]);

  return (
    <aside
      className={`z-50 fixed right-0 top-0 h-full bg-gray-100 transition-all duration-500 ease-in-out ${
        isOpen ? "w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/2" : "w-0"
      }`}
      style={{ overflowY: "auto" }}
    >
      <header className="flex w-full bg-white shadow-md py-2">
        <button
          className={`flex items-center justify-center p-2 text-3xl text-secondary font-extrabold`}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" className="relative left-0" />
        </button>
        <h2 className="text-center text-2xl w-full font-bold overflow-hidden text-secondary my-auto">
          Movimientos Liquidacion
        </h2>
      </header>
      <ul className="text-xl md:text-2xl flex flex-col w-full p-2">
        {notificaciones.map((notificacion, index) => (
          <li
            key={index}
            className={`bg-white rounded-2xl w-1/2 p-2 shadow-sm ${
              index % 2 !== 0 && "ml-auto"
            }`}
          >
            <header className="w-full flex justify-between items-center my-auto">
              <h3 className="font-bold text-secondary">
                {notificacion.TipoSeguimiento}
              </h3>
              <h3 className="text-base font-normal">
                {notificacion.NombreVendedor}
              </h3>
            </header>
            <p className="text-sm font-normal py-1">
              {notificacion.TipoId === 1 ? (
                <>
                  se registró una venta por un valor de{" "}
                  <span className="text-quaternary font-semibold">
                    {notificacion.Valor}$
                  </span>{" "}
                  para el cliente{" "}
                  <span className="text-quaternary font-semibold">
                    {notificacion.NombreCliente}
                  </span>{" "}
                  con un valor seguro de {notificacion.ValorSeguro}$
                  <span className="ml-1">
                    <Link
                      to={`/ventas/${notificacion.VentaId}`}
                      className="font-semibold text-quaternary border-b-2 border-quaternary"
                
                      rel="noopener noreferrer"
                    >
                      ver
                    </Link>
                  </span>
                </>
              ) : notificacion.TipoId === 2 ? (
                <>
                  se registró un abono por un valor de{" "}
                  <span className="font-semibold text-tertiary">
                    {notificacion.Valor}$
                  </span>
                  con un interes de{" "}
                  <span className="text-quaternary font-semibold">
                    {notificacion.ValorInteres}$
                  </span>
                  y una multa de{" "}
                  <span className="text-quaternary font-semibold">
                    {notificacion.ValorMulta}$
                  </span>{" "}
                  para la venta{" "}
                  <Link
                    to={`/cuotas/${notificacion.VentaId}/${notificacion.NumeroVenta}/${notificacion.Archivada}`}
                  
                    rel="noopener noreferrer"
                  >
                    <span className="text-quaternary font-sembibold border-b-2 border-quaternary font-semibold">
                      {notificacion.NumeroVenta}
                    </span>
                  </Link>
                  <br />
                  <span className="font-semibold mr-1 text-quaternary">
                    detalle:
                  </span>
                  {notificacion.Detalle}
                </>
              ) : (
                notificacion.TipoId === 3 && (
                  <>
                    se registró un gasto por un valor de
                    <span className="text-quaternary font-semibold ml-1">
                      {notificacion.Valor}$
                    </span>
                    para{" "}
                    <span className="text-quaternary font-semibold">
                      {notificacion.NombreGasto}
                    </span>
                  </>
                )
              )}
            </p>
            <footer className="w-full flex justify-between items-center text-base font-semibold">
              <span>{FormatearFecha(notificacion.Fecha)}</span>
              <span>{formatDate(notificacion.Fecha)}</span>
            </footer>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NotificacionesToLiquidar;
