import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { FormatearFecha } from "../../utils/FormatearFecha";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/Helpers/FormatDate";

interface Props {
  isOpen: boolean;
  Consecutivo: string;
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

const NotificacionesLiquidacion: React.FC<Props> = ({
  isOpen,
  onClose,
  Consecutivo,
  VendedorId,
}) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const getNotificaciones = async (
    ConsecutivoNoti: string,
    VendedorIdNoti: number
  ) => {
    try {
      const response = await axios.post(
        "https://backendgestorventas1.azurewebsites.net/api/notificaciones/liquidacion",
        {
          Consecutivo: ConsecutivoNoti,
          VendedorId: VendedorIdNoti,
        }
      );
      setNotificaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las notificaciones", error);
    }
  };

  useEffect(() => {
    setNotificaciones([]);
    getNotificaciones(Consecutivo, VendedorId);
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
          className={`flex items-center justify-center p-2 text-3xl text-blue-800 font-extrabold`}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" className="relative left-0" />
        </button>
        <h2 className="text-center text-2xl w-full font-bold overflow-hidden text-blue-800 my-auto">
          Movimientos Liquidacion <br />{" "}
          <span className="text-blue-600">{Consecutivo}</span>
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
              <h3 className="font-bold text-blue-800">
                {notificacion.TipoSeguimiento}
              </h3>
              <h3 className="text-base font-normal">
                {notificacion.NombreVendedor}
              </h3>
            </header>
            <p className="text-sm py-1">
              {notificacion.TipoId === 1 ? (
                <>
                  se registró una venta por un valor de{" "}
                  <span className="text-blue-600 font-semibold">
                    {notificacion.Valor}$
                  </span>{" "}
                  para el cliente{" "}
                  <span className="text-blue-600 font-semibold">
                    {notificacion.NombreCliente}
                  </span>{" "}
                  con un valor seguro de {notificacion.ValorSeguro}$
                  <span className="ml-1">
                    <Link
                      to={`/ventas/${notificacion.VentaId}`}
                      className="font-semibold text-blue-600 border-b-2 border-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ver
                    </Link>
                  </span>
                </>
              ) : notificacion.TipoId === 2 ? (
                <>
                  se registró un abono por un valor de{" "}
                  <span className="font-semibold text-blue-700">
                    {notificacion.Valor}$
                  </span>
                  con un interes de{" "}
                  <span className="text-blue-600 font-semibold">
                    {notificacion.ValorInteres}$
                  </span>
                  y una multa de{" "}
                  <span className="text-blue-600 font-semibold">
                    {notificacion.ValorMulta}$
                  </span>{" "}
                  para la venta{" "}
                  <Link
                    to={`/cuotas/${notificacion.VentaId}/${notificacion.NumeroVenta}/${notificacion.Archivada}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-blue-600 font-sembibold border-b-2 border-blue-600 font-semibold">
                      {notificacion.NumeroVenta}
                    </span>
                  </Link>
                  <br />
                  <span className="font-semibold mr-1 text-blue-600">
                    detalle:
                  </span>
                  {notificacion.Detalle}
                </>
              ) : (
                notificacion.TipoId === 3 && (
                  <>
                    se registró un gasto por un valor de
                    <span className="text-blue-600 font-semibold ml-1">
                      {notificacion.Valor}$
                    </span>{" "}
                    para{" "}
                    <span className="text-blue-600 font-semibold">
                      {notificacion.NombreGasto}
                    </span>
                  </>
                )
              )}
            </p>
            <footer className="w-full flex justify-between items-center text-base">
              <span>{FormatearFecha(notificacion.Fecha)}</span>
              <span>{formatDate(notificacion.Fecha)}</span>
            </footer>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default NotificacionesLiquidacion;
