import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

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
  }

  const { id } = useParams<{ id: string }>();

  console.log(id);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [vendedor, setVendedor] = useState<any>({});

  console.log(id);
  
  useEffect(() => {
    // Fetch ventas
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/ventas/vendedor/${id}`)
      .then((res) => setVentas(res.data))
      .catch((err) => console.log(err));

    // Fetch vendedor info
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/vendedores/${id}`)
      .then((res) => setVendedor(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  console.log(ventas);
  console.log(vendedor);
  return (
    <section className="flex w-full">
      <Sidebar />
      <div className="w-full ml-16">
        <h5 className="w-full text-center bg-white font-bold text-blue-900 text-lg md:text-xl lg:text-2xl xl:text-3xl py-4 border-b shadow-md mb-4">
          Ventas realizadas por: <span className="text-blue-700">{vendedor.NombreCompleto}</span>
        </h5>
        {ventas.map((venta) => (
          <li className="grid sm:w-11/12 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col justify-center items-center border m-2 bg-white">
              <h1 className="bg-blue-700 text-white font-normal py-1 rounded-t-md px-4 w-full">
                Numero Venta:{" "}
                <span className="font-bold">0000{venta.NumeroVenta}</span>
              </h1>
              <p className="p-2">
                <span className="font-semibold">Descripcion</span>{" "}
                {venta.DetallesVenta}
              </p>
              <ul className="flex flex-col w-full p-2">
                <li>
                  <span className="font-semibold">Vendedor:</span>{" "}
                  {venta.NombreVendedor}
                </li>
                <li>
                  <span className="font-semibold">Cliente:</span>
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
                  <span className="font-semibold flex flex-col">N Cuotas</span>
                  {venta.NumeroCuotas}
                </li>
              </ul>
            </div>
          </li>
        ))}
      </div>
    </section>
  );
}

export default VentasByVendedor;
