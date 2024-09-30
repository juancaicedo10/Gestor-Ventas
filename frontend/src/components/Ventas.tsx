import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";
import { Link, useParams } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Spinner from "../utils/Spinner";
import CrearVentaModal from "../utils/Ventas/CrearVentaModal";
import decodeToken from "../utils/tokenDecored";
import { formatDate } from "../utils/Helpers/FormatDate";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function Ventas() {
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
  }

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fechaInicia, setIsFechaInicio] = useState("");
  const [fechaFin, setIsFechaFin] = useState("");

  const { id } = useParams<{ id: string }>();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const Id = decodeToken()?.user.Id;

  const downloadPdf = () => {
    let url =
      decodeToken()?.user.role === "Administrador"
        ? "https://backendgestorventas.azurewebsites.net/api/ventas/pdf/all"
        : `https://backendgestorventas.azurewebsites.net/api/ventas/pdf/${Id}`;
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // Importante para manejar archivos binarios como PDF
    })
      .then((res) => {
        // Crear una URL a partir de los datos del archivo
        const url = window.URL.createObjectURL(new Blob([res.data]));
        // Crear un enlace <a> temporal
        const link = document.createElement("a");
        link.href = url;
        // Asignar un nombre al archivo descargado
        link.setAttribute("download", "reporte-ventas.pdf");
        // Añadir el enlace al documento y hacer clic para descargar
        document.body.appendChild(link);
        link.click();
        // Limpiar el enlace después de la descarga
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVentas = async () => {
    setIsLoading(true);
    try {
      let res;
      if (id) {
        res = await axios.get(
          `https://backendgestorventas.azurewebsites.net/api/ventas/${id}`
        );
      } else if (decodeToken()?.user.role !== "Administrador") {
        res = await axios.get(
          `https://backendgestorventas.azurewebsites.net/api/ventas/vendedor/${Id}`
        );
      } else {
        res = await axios.get(
          `https://backendgestorventas.azurewebsites.net/api/ventas/${Id}/all`
        );
      }

      let data;
      if (decodeToken()?.user.role === "Administrador" && id) {
        data = res.data;
        console.log(data, 'data with id')
      } else if (decodeToken()?.user.role === "Administrador" && !id) {
        data = res.data.data;
      } else {
        data = res.data;
      }
      console.log(res, "response");
      setVentas(data);
      console.log(data, "data");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(ventas, "ventas");

  const filter = () => {
    if (fechaInicia === "" || fechaFin === "") {
      return ventas;
    }

    const start = new Date(fechaInicia);
    const end = new Date(fechaFin);

    return ventas.filter((item) => {
      const itemDate = new Date(item.FechaInicio);
      return itemDate >= start && itemDate <= end;
    });
  };

  useEffect(() => {
    console.log(filter(), "filter");
    getVentas();
  }, []);

  return (
    <section>
      <Sidebar />
      <div className="ml-[64px]">
        <header className="flex flex-col items-center md:flex-row md:justify-between w-full border-b shadow-md bg-white">
          <div className="flex items-center md:w-1/3 w-full justify-center">
            <input
              type="date"
              className="border-2 rounded-md text-black p-2 border-blue-600 w-[43%]"
              onChange={(e) => setIsFechaInicio(e.target.value)}
            />
            <span className="px-2 text-blue-800 font-semibold text-2xl">a</span>
            <input
              type="date"
              className="border-2 rounded-md text-black p-2 border-blue-600 w-[43%]"
              onChange={(e) => setIsFechaFin(e.target.value)}
            />
          </div>
          <h1 className="w-1/3 text-2xl text-blue-900 md:text-4xl lg:text-6xl text-start md:text-center p-2 font-bold md:w-1/3">
            {decodeToken()?.user.role === "Administrador"
              ? "ventas"
              : "Tus Ventas"}
          </h1>
          <div className="w-1/3 text-end">
            <button className="text-blue-900 text-center md:text-end">
              <PictureAsPdfIcon fontSize="large" onClick={downloadPdf} />
            </button>
            <button className="text-blue-900 text-center md:text-end">
              <AddCircleIcon fontSize="large" onClick={toggleModal} />
            </button>
          </div>
        </header>
        <section
          className={`flex items-center justify-center ${
            isLoading && "h-[100vh]"
          }`}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <div className="w-full">
              <section className="w-full px-2">
                <CrearVentaModal
                  isOpen={isModalOpen}
                  onClose={toggleModal}
                  getVentas={getVentas}
                />
              </section>
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                {filter() && filter().length > 0 &&
                  filter().map((venta) => (
                    <li>
                      <div className="flex flex-col m-2 p-2">
                        <header className="bg-blue-900 text-white font-normal py-4 rounded-md px-4 w-full flex flex-col items-center min-h-[150px]">
                          <SellIcon fontSize="large" className="text-white" />
                          <h1 className="text-xl pb-2 text-center">
                            <span className="font-bold">Venta:</span>{" "}
                            {venta.NumeroVenta}
                          </h1>
                          <p className="text-gray-300 text-lg mx-3 text-center">
                            <span className="font-medium">Cliente:</span>{" "}
                            {venta.NombreCliente}
                          </p>
                          <span
                            className={`rounded-md p-1 text-sm bg-[${venta.ColorEstado}] mt-2`}
                            style={{
                              backgroundColor: `${venta.ColorEstado}`,
                              color: `${venta.ColorTexto}`,
                            }}
                          >
                            {venta.Estado}
                          </span>
                        </header>
                        <p className="rounded-md border-2 p-2 mt-2 text-sm bg-white min-h-[100px]">
                          <span className="font-bold text-xl text-blue-600">
                            Descripcion: <br />
                          </span>{" "}
                          {venta.DetallesVenta}
                        </p>
                        <ul className="flex flex-col rounded-md border-2 p-2 text-sm my-2 bg-white">
                          <h4 className="text-xl font-bold pb-2 text-blue-600">
                            Detalles:
                          </h4>
                          <li className="p-1">
                            <SellIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Numero Venta:
                            </span>{" "}
                            {venta.NumeroVenta}
                          </li>
                          <li className="p-1">
                            <PersonIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Vendedor:
                            </span>{" "}
                            {venta.NombreVendedor}
                          </li>
                          <li className="p-1">
                            <PersonIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Cliente:
                            </span>{" "}
                            {venta.NombreCliente}
                          </li>
                          <li className="p-1">
                            <AccessAlarmIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Periodicidad
                            </span>
                            : {venta.PeriodicidadNombre}
                          </li>
                          <li className="p-1">
                            <DateRangeIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Fecha Inicio:
                            </span>{" "}
                            {formatDate(venta.FechaInicio)}
                          </li>
                          <li className="p-1 text-blue-900 flex items-center">
                            <DateRangeIcon fontSize="small" />
                            <span className="font-semibold text-blue-900">
                              Fecha Fin:
                            </span>{" "}
                            <p className="text-black">
                              {formatDate(venta.FechaFin)}
                            </p>
                          </li>
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
                                }).format(venta.ValorVenta)}
                              </div>
                              <div className="text-start">
                                <span className="font-semibold flex flex-col text-blue-900">
                                  N Cuotas:
                                </span>
                                {venta.NumeroCuotas}
                              </div>
                              <div>
                                <span className="font-semibold flex flex-col text-blue-900">
                                  valor Seguro:
                                </span>
                                {new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                }).format(venta.ValorSeguro)}
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
                                }).format(venta.ValorAbonado)}
                                $
                              </div>
                              <div className="text-start">
                                <span className="font-semibold flex flex-col text-blue-900">
                                  Pagadas:
                                </span>
                                {venta.CuotasPagadas}
                              </div>
                              <div>
                                <span className="font-semibold flex flex-col text-blue-900">
                                  % Interes:
                                </span>
                                {venta.TasaInteres}%
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-md border-2 my-2 p-2 bg-white">
                          <h6 className="font-bold text-xl text-blue-600">
                            Ir a detalles de cuotas:
                          </h6>
                          <Link
                            to={`/cuotas/${venta.Id}/${venta.NumeroVenta}`}
                            className="text-blue-900 font-semibold border-b-2 border-blue-900"
                          >
                            Cuotas Detalles
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Ventas;
