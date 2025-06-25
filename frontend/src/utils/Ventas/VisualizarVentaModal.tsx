import { Link } from "react-router-dom";
import { formatDate } from "../Helpers/FormatDate";
import SellIcon from "@mui/icons-material/Sell";
import { FormatearFecha } from "../FormatearFecha";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ActualizarFechaInicioVenta from "./ActualizarFechaInicioVenta";
import { useEffect, useState } from "react";
import decodeToken from "../tokenDecored";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventaSelected: Venta | null;
}

interface Venta {
  Id: number;
  FechaInicio: string;
  FechaFin: string;
  NumeroCuotas: number;
  NumeroVenta: string;
  SaldoMoraTotal: number;
  DetallesVenta: string;
  ValorVenta: number;
  NombreVendedor: string;
  NombreCliente: string;
  PeriodicidadNombre: string;
  CuotasPagadas: number;
  ValorAbonado: number;
  ValorSeguro: number;
  TasaInteres: number;
  Liquidada: boolean;
  Estado: string;
  ColorEstado: string;
  ColorTexto: string;
  FechaServer: string;
  TelefonoCliente: string;
  Archivada: boolean;
  FotoCliente: string;
}

const VisualizarVentaModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  ventaSelected,
}) => {
  const [isUpdateFechaPagoOpen, setIsUpdateFechaPagoOpen] =
    useState<boolean>(false);

  const [fechaInicio, setNewFechaInicio] = useState<string>(
    ventaSelected?.FechaInicio || ""
  );

  const isAdmin = decodeToken()?.user?.role === "Administrador";

  useEffect(() => {
    if (ventaSelected && ventaSelected.FechaInicio) {
      setNewFechaInicio(ventaSelected.FechaInicio);
    }
  }, [ventaSelected, isOpen]);

  return (
    <div>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-4">
              <header className="flex w-full items-center justify-between">
                <h3
                  className="text-3xl leading-6 font-bold text-blue-900"
                  id="modal-title"
                >
                  Visualizar Venta
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-4xl text-gray-500 hover:text-gray-900"
                >
                  &times;
                </button>
              </header>
              <p className="rounded-md border-2 p-2 mt-2 text-sm bg-white min-h-[100px]">
                <span className="font-bold text-xl text-blue-600">
                  Descripcion: <br />
                </span>{" "}
                {ventaSelected?.DetallesVenta}
              </p>

              <ActualizarFechaInicioVenta
                isOpen={isUpdateFechaPagoOpen}
                onClose={() => setIsUpdateFechaPagoOpen(false)}
                ventaSelected={ventaSelected}
                onFechaUpdate={(e) => setNewFechaInicio(e)}
              ></ActualizarFechaInicioVenta>

              <ul className="flex flex-col rounded-md border-2 p-2 text-sm my-2 bg-white">
                <h4 className="text-xl font-bold pb-2 text-blue-600">
                  Detalles:
                </h4>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <li className="p-1">
                      <SellIcon fontSize="small" className="text-blue-900" />
                      <span className="font-semibold text-blue-900">
                        Numero Venta:
                      </span>{" "}
                      {ventaSelected?.NumeroVenta}
                    </li>
                    <li className="p-1">
                      <PersonIcon fontSize="small" className="text-blue-900" />
                      <span className="font-semibold text-blue-900">
                        Vendedor:
                      </span>{" "}
                      {ventaSelected?.NombreVendedor}
                    </li>
                    <li className="p-1">
                      <PersonIcon fontSize="small" className="text-blue-900" />
                      <span className="font-semibold text-blue-900">
                        Cliente:
                      </span>{" "}
                      {ventaSelected?.NombreCliente}
                    </li>
                    <li className="p-1 w-full flex">
                      <PhoneIcon fontSize="small" className="text-blue-900" />
                      <span className="font-semibold text-blue-900">
                        Contacto:
                      </span>{" "}
                      <p className="border-blue-600 text-blue-600 ml-1 border-b">
                        <a
                          href={`https://wa.me/${ventaSelected?.TelefonoCliente}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ventaSelected?.TelefonoCliente}
                        </a>
                      </p>
                    </li>
                    <li className="p-1">
                      <AccessAlarmIcon
                        fontSize="small"
                        className="text-blue-900"
                      />
                      <span className="font-semibold text-blue-900">
                        Periodicidad
                      </span>
                      : {ventaSelected?.PeriodicidadNombre}
                    </li>
                    <li className="p-1">
                      <DateRangeIcon
                        fontSize="small"
                        className="text-blue-900"
                      />
                      <span className="font-semibold text-blue-900">
                        Fecha Creacion:
                      </span>{" "}
                      {ventaSelected?.FechaServer
                        ? `${formatDate(
                            ventaSelected.FechaServer
                          )} ${FormatearFecha(ventaSelected.FechaServer)}`
                        : ""}
                    </li>
                    <li className="p-1">
                      <DateRangeIcon
                        fontSize="small"
                        className="text-blue-900"
                      />
                      <span className="font-semibold text-blue-900">
                        Fecha Inicio:
                      </span>{" "}
                      {/* si es administrador se puede abrir el modal de modificar fecha */}
                      {isAdmin ? (
                        <span
                          onClick={() => setIsUpdateFechaPagoOpen(true)}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          {fechaInicio ? formatDate(fechaInicio) : ""}
                        </span>
                      ) : (
                        <span>
                          {fechaInicio ? formatDate(fechaInicio) : ""}
                        </span>
                      )}
                    </li>
                    <li className="p-1 text-blue-900 flex items-center">
                      <DateRangeIcon fontSize="small" />
                      <span className="font-semibold text-blue-900">
                        Fecha Fin:
                      </span>{" "}
                      <p className="text-black">
                        {ventaSelected?.FechaFin
                          ? formatDate(ventaSelected.FechaFin)
                          : ""}
                      </p>
                    </li>
                  </div>

                  <div className="w-full h-full flex justify-center items-center"><img src={ventaSelected?.FotoCliente} alt="foto cliente" className="w-36 h-36 rounded-full"/></div>
                </section>
              </ul>
              <div className="rounded-md border-2 p-2 w-full py-2 bg-white">
                <h4 className="font-bold text-xl text-blue-600">
                  Datos Financieros:
                </h4>
                <ul className="grid grid-cols-2 w-full py-2 ">
                  <li>
                    <div className="text-start flex flex-col">
                      <span className="font-semibold text-blue-900">
                        Valor Venta:
                      </span>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(ventaSelected?.ValorVenta ?? 0)}
                    </div>
                    <div className="text-start">
                      <span className="font-semibold flex flex-col text-blue-900">
                        N Cuotas:
                      </span>
                      {ventaSelected?.NumeroCuotas}
                    </div>
                    <div>
                      <span className="font-semibold flex flex-col text-blue-900">
                        valor Seguro:
                      </span>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(ventaSelected?.ValorSeguro ?? 0)}
                      $
                    </div>
                  </li>
                  <li>
                    <div className="text-start flex flex-col">
                      <span className="font-semibold text-blue-900">
                        Abonado:
                      </span>
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(ventaSelected?.ValorAbonado ?? 0)}
                      $
                    </div>
                    <div className="text-start">
                      <span className="font-semibold flex flex-col text-blue-900">
                        Pagadas:
                      </span>
                      {ventaSelected?.CuotasPagadas}
                    </div>
                    <div>
                      <span className="font-semibold flex flex-col text-blue-900">
                        % Interes:
                      </span>
                      {ventaSelected?.TasaInteres}%
                    </div>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border-2 my-2 p-2 bg-white">
                <h6 className="font-bold text-xl text-blue-600">
                  Ir a detalles de cuotas:
                </h6>
                <Link
                  to={`/cuotas/${ventaSelected?.Id}/${ventaSelected?.NumeroVenta}/${ventaSelected?.Archivada}`}
                  className="text-blue-900 font-semibold border-b-2 border-blue-900"
            
                  rel="noopener noreferrer"
                >
                  Cuotas Detalles
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarVentaModal;
