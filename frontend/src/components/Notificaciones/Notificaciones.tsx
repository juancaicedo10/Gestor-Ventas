import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { FormatearFecha } from "../../utils/FormatearFecha";
import { Link } from "react-router-dom";
import Select from "react-select";
import { formatDate } from "../../utils/Helpers/FormatDate";
import decodeToken from "../../utils/tokenDecored";
import HttpClient from "../../Services/httpService";
import { saveAs } from "file-saver";

interface Props {
  isOpen: boolean;
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
  NombreGasto: string;
  VentaId: number;
  Detalle: string;
  Archivada: boolean;
  AbonoId: number;
}

interface Vendedor {
  Id: number;
  NombreCompleto: string;
}

const Notificaciones: React.FC<Props> = ({ isOpen, onClose }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  //filtro

  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(
    undefined
  );

  const [selectedFechaInicio, setSelectedFechaInicio] = useState<
    string | undefined
  >(undefined);

  const [selectedFechaFin, setSelectedFechaFin] = useState<string | undefined>(
    undefined
  );

  const [selectedVentas, setSelectedVentas] = useState<boolean | undefined>(
    undefined
  );

  const [selectedAbonos, setSelectedAbonos] = useState<boolean | undefined>(
    undefined
  );

  const [selectedGastos, setSelectedGastos] = useState<boolean | undefined>(
    undefined
  );

  const handleSelectSeller = (sellerId: number | undefined) => {
    setSelectedSeller(sellerId);
  };

  const descargarDocumento = async (notificacion: Notificacion) => {
    const { AbonoId } = notificacion;

    try {
      const response = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/recibo`,
        { AbonoId: AbonoId },
        { responseType: "blob" } // MUY IMPORTANTE
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `recibo_${AbonoId}.pdf`);
    } catch (error) {
      console.error("Error al descargar recibo:", error);
    }
  };

  const getVendedores = async () => {
    try {
      const response = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${
          decodeToken()?.user?.Id
        }/all`
      );
      setVendedores(response.data);
    } catch (error) {
      console.error("Error al obtener los vendedores", error);
    }
  };

  const getNotificacionesFiltered = async () => {
    try {
      const response = await HttpClient.post(
        `${import.meta.env.VITE_API_URL}/api/notificaciones/filtro`,
        {
          VendedorId: selectedSeller,
          FechaInicio: selectedFechaInicio,
          FechaFin: selectedFechaFin,
          Ventas: selectedVentas,
          Abonos: selectedAbonos,
          Gastos: selectedGastos,
          AdministradorId: decodeToken()?.user?.Id,
        }
      );
      setNotificaciones(response.data.data);
      console.log(response.data.data, "notificaciones filtradas");
    } catch (error) {
      console.error("Error al obtener las notificaciones", error);
    }
  };

  const options = vendedores?.map((vendedor) => ({
    value: vendedor.Id,
    label: vendedor.NombreCompleto,
  }));

  useEffect(() => {
    getNotificacionesFiltered();
    getVendedores();
  }, [isOpen]);

  useEffect(() => {
    return () => {
      setSelectedFechaFin(undefined);
      setSelectedFechaInicio(undefined);
      setSelectedGastos(undefined);
      setSelectedAbonos(undefined);
      setSelectedVentas(undefined);
      setSelectedSeller(undefined);
    };
  }, [!isOpen]);

  useEffect(() => {
    getNotificacionesFiltered();
  }, [
    selectedSeller,
    selectedFechaInicio,
    selectedFechaFin,
    selectedVentas,
    selectedAbonos,
    selectedGastos,
  ]);

  return (
    <aside
      className={`z-50 fixed right-0 top-0 h-full bg-gray-100 transition-all duration-500 ease-in-out ${
        isOpen ? "w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/2" : "w-0"
      }`}
      style={{ overflowY: "auto" }}
    >
      <header className="w-full bg-white py-2 shadow-md flex-col">
        <div className="w-full flex">
          <button
            className={`flex items-center justify-center p-2 text-3xl text-secondary font-extrabold`}
            onClick={onClose}
          >
            <CloseIcon fontSize="large" className="relative left-0" />
          </button>
          <h2 className="font-bold text-secondary p-2 w-full text-center my-auto text-3xl">
            Movimientos
          </h2>
        </div>
        <div className="w-full flex items-center flex-col">
          <Select
            id="seller"
            options={options}
            placeholder="Seleccione un vendedor"
            onChange={(selectedOption) =>
              handleSelectSeller(selectedOption?.value)
            }
            value={
              options.find((option) => option.value === selectedSeller) || null
            }
            maxMenuHeight={170}
            menuPlacement="auto"
            className="w-3/4"
          />
          <section className="my-2">
            <input
              type="date"
              className="border-2 rounded-md p-1 mr-2"
              onChange={(e) => setSelectedFechaInicio(e.target.value)}
              value={selectedFechaInicio || ""}
            />
            a
            <input
              type="date"
              className="border-2 rounded-md p-1 ml-2"
              onChange={(e) => setSelectedFechaFin(e.target.value)}
              value={selectedFechaFin || ""}
            />
          </section>
          <section className="w-1/2 py-1 flex justify-between items-center">
            <div>
              <label htmlFor="checkbox">Ventas</label>
              <input
                type="checkbox"
                className="m-1"
                checked={!!selectedVentas}
                onChange={(e) =>
                  setSelectedVentas(e.target.checked ? true : undefined)
                }
              />
            </div>
            <div>
              <label htmlFor="checkbox">Abonos</label>
              <input
                type="checkbox"
                className="m-1"
                checked={!!selectedAbonos}
                onChange={(e) =>
                  setSelectedAbonos(e.target.checked ? true : undefined)
                }
              />
            </div>
            <div>
              <label htmlFor="checkbox">Gastos</label>
              <input
                type="checkbox"
                className="m-1"
                checked={!!selectedGastos}
                onChange={(e) =>
                  setSelectedGastos(e.target.checked ? true : undefined)
                }
              />
            </div>
          </section>
        </div>
      </header>
      <ul className="text-xl md:text-2xl flex flex-col w-full p-2">
        {notificaciones.length !== 0 &&
          notificaciones.map((notificacion, index) => (
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
              <p className="text-sm text-black">
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
                    con un valor seguro de{" "}
                    <span className="font-semibold text-quaternary">
                      {notificacion.ValorSeguro}$
                    </span>
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
                    <span className="font-semibold text-quaternary">
                      {notificacion.Valor}$
                    </span>{" "}
                    con un interes de{" "}
                    <span className="font-semibold text-quaternary">
                      {notificacion.ValorInteres}$
                    </span>{" "}
                    una multa de{" "}
                    <span className="font-semibold text-quaternary">
                      {notificacion.ValorMulta}$
                    </span>{" "}
                    para la venta{" "}
                    <Link
                      to={`/cuotas/${notificacion.VentaId}/${notificacion.NumeroVenta}/${notificacion.Archivada}`}
                      className="font-semibold text-quaternary border-b-2 border-quaternary"
                      rel="noopener noreferrer"
                    >
                      {notificacion.NumeroVenta}
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
                      se registró un gasto por un valor de{" "}
                      <span className="font-semibold text-quaternary">
                        {notificacion.Valor}$
                      </span>{" "}
                      para{" "}
                      <span className="font-semibold text-quaternary">
                        {notificacion.NombreGasto}
                      </span>
                    </>
                  )
                )}

                {[1, 2].includes(notificacion.TipoId) && (
                  <>
                    <p>
                      <span className="font-semibold mr-1 text-quaternary">
                        Cliente:
                      </span>
                      <span className="text-black">
                        {notificacion.NombreCliente}
                      </span>
                    </p>
                    <button
                      onClick={() => descargarDocumento(notificacion)}
                      className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-tertiary transition justify-end w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                      Descargar
                    </button>
                  </>
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

export default Notificaciones;
