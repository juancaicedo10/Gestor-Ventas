import Sidebar from "./Sidebar";
import PaginationButtons from "../helpers/paginator";
import { useEffect, useState } from "react";
import axios from "axios";
function Ventas() {
  // Datos de ejemplo
  const cuotas = [1, 2, 3, 4, 5];
  const valores = [100, 200, 300, 400, 500];
  const intereses = [10, 20, 30, 40, 50];
  const fechas = ["1/01/22", "1/01/22", "1/01/22", "1/01/22", "1/01/22"];

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
  }

  const [ventas, setVentas] = useState<Venta[]>([]);

  console.log(ventas);
  useEffect(() => {
    axios
      .get("https://gestor-ventas.vercel.app/api/ventas")
      .then((res) => setVentas(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="w-full">
      <Sidebar />
      <div className="ml-[64px]">
        <h1 className="text-center font-bold text-2xl">Ventas</h1>
        <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {ventas.map((venta) => (
            <li>
              <div className="flex flex-col justify-center items-center border m-2 bg-white">
                <h1 className="bg-blue-900 text-white font-normal py-1 rounded-t-md px-4 w-full">
                  Numero Venta:{" "}
                  <span className="font-bold">{venta.NumeroVenta}</span>
                </h1>
                <p className="p-2">
                  <span className="font-semibold">Descripcion</span> Lorem ipsum
                  dolor sit amet consectetur adipisicing elit. Error eaque
                  aliquid eveniet corrup
                </p>
                <ul className="flex flex-col w-full p-2">
                  <li>
                    <span className="font-semibold">Vendedor:</span>{" "}
                    {venta.NombreVendedor}
                  </li>
                  <li>
                    <span className="font-semibold">Cliente:</span>{" "}
                    {venta.NombreCliente}
                  </li>
                  <li>
                    <span className="font-semibold">Periodicidad</span>:{" "}
                    {venta.Periodicidad}
                  </li>
                </ul>
                <ul className="grid grid-cols-2 w-full py-2 ">
                  <li className="text-center flex flex-col">
                    <span className="font-semibold">Valor Venta:</span>
                    {venta.ValorVenta}
                  </li>
                  <li className="text-center">
                    <span className="font-semibold flex flex-col">
                      N Cuotas
                    </span>
                    {venta.NumeroCuotas}
                  </li>
                </ul>
                <h3 className="text-blue-500 font-bold">Detalle de Cuotas</h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-center">
                      <th>Cuota</th>
                      <th>Valor</th>
                      <th>% Interes</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuotas.map((cuota, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{cuota}</td>
                        <td className="text-center">{valores[idx]}</td>
                        <td className="text-center">{intereses[idx]}</td>
                        <td className="text-center">{fechas[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h4 className="py-2">
                  Venta Activa:{" "}
                  <span className="text-white font-semibold rounded-md bg-green-700 px-2">
                    Si
                  </span>
                </h4>
                <h5 className="py-2">Saldo Morativo total: 300%</h5>
              </div>
            </li>
          ))}
        </ul>
        <PaginationButtons page={1} />
      </div>
    </section>
  );
}

export default Ventas;
