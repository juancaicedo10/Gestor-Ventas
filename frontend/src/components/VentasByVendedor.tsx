import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SellIcon from "@mui/icons-material/Sell";
import Spinner from "../utils/Spinner";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PersonIcon from "@mui/icons-material/Person";

function VentasByVendedor() {
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
    Periodicidad: string;
    Pagadas: number;
    Abonado: number;
  }

  const { id } = useParams<{ id: string }>();

  console.log(id);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [vendedor, setVendedor] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  console.log(id);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `http://localhost:5000/api/ventas/vendedor/${id}`
      )
      .then((res) => {
        setVentas(res.data);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    // Fetch vendedor info
    axios
      .get(`http://localhost:5000/api/vendedores/${id}`)
      .then((res) => setVendedor(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  console.log(ventas);
  console.log(vendedor);
  return (
    <section className="flex w-full">
      <Sidebar />
      {isLoading ? (
        <div className="w-full h-[80vh] flex items-center justify-center">
          <Spinner isLoading={isLoading} />
        </div>
      ) : (
        <section className="w-full">
          <header className="bg-white text-center border-b shadow-md ml-[65px]">
            <h1 className="text-xl md:text-3xl font-bold text-blue-900 py-4 text-center">
              Ventas de:{" "} <br />
              <span className="text-blue-600">{vendedor.NombreCompleto}</span>
            </h1>
          </header>
          <section
            className={`flex items-center justify-center ml-[67px] ${
              isLoading && "h-[100vh]"
            }`}
          >
            {isLoading ? (
              <Spinner isLoading={isLoading} />
            ) : (
              <div className="w-full">
                <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                  {ventas.map((venta) => (
                    <li>
                      <div className="flex flex-col m-2 p-2">
                        <header className="bg-blue-900 text-white font-normal py-4 rounded-md px-4 w-full flex flex-col items-center min-h-[200px]">
                          <SellIcon fontSize="large" className="text-white" />
                          <h1 className="text-xl pb-2 text-center">
                            <span className="font-bold">Venta:</span> { venta.NumeroVenta }
                          </h1>
                          <p className="text-gray-300 text-lg mx-3 text-center">
                            <span className="font-medium">Cliente:</span>{" "}
                            {venta.NombreCliente}
                          </p>
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
                            : {venta.Periodicidad}
                          </li>
                          <li className="p-1">
                            <DateRangeIcon
                              fontSize="small"
                              className="text-blue-900"
                            />
                            <span className="font-semibold text-blue-900">
                              Fecha Inicio:
                            </span>{" "}
                            {new Date(venta.FechaInicio).toLocaleDateString(
                              "es-ES"
                            )}
                          </li>
                          <li className="p-1 text-blue-900 flex items-center">
                            <DateRangeIcon fontSize="small" />
                            <span className="font-semibold text-blue-900">
                              Fecha Fin:
                            </span>{" "}
                            <p className="text-black">
                              {new Date(venta.FechaFin).toLocaleDateString(
                                "es-ES"
                              )}
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
                            </li>
                            <li>
                              <div className="text-start flex flex-col">
                                <span className="font-semibold text-blue-900">
                                  Abonado:
                                </span>
                                {new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                }).format(venta.Abonado)}$
                              </div>
                              <div className="text-start">
                                <span className="font-semibold flex flex-col text-blue-900">
                                  Pagadas:
                                </span>
                                {venta.Pagadas}
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
        </section>
      )}
    </section>
  );
}

export default VentasByVendedor;
