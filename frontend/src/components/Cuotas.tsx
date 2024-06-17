import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Cuota {
  Id: number;
  NumeroCuota: number;
  ValorCuota: number;
  FechaPago: string;
  Pagada: boolean;
}

function Cuotas() {
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const Id = useParams()?.id;

  console.log(cuotas);

  useEffect(() => {
    axios
      .get(`https://backendgestorventas.azurewebsites.net/api/cuotas/${Id}`)
      .then((res) => {
        setCuotas(res.data);
        console.log(cuotas);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="ml-[67px]">
      <header className="shadow-md bg-white flex items-center w-full">
        <h1 className="font-bold text-blue-900 py-2 text-lg text-start">
          Cuotas para la venta:{" "} 
          <span className="font-semibold text-blue-700">
            Zapatos Nike Originales
          </span>{" "}
        </h1>
        <button className="text-xs">Registrar abono</button>
      </header>
        <table className="w-full px-2 border border-black my-4">
          <thead>
            <tr className="border border-gray-400 text-sm text-blue-800">
              <th className="border-r border-gray-400 py-2">#</th>
              <th className="border-r border-gray-400">Valor</th>
              <th className="border-r border-gray-400">Fecha</th>
              <th>Abonado</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota, idx) => (
              <tr key={idx} className="border border-gray-400">
                <td className="text-center border-r border-gray-400 py-4 px-1 text-sm">{cuota.NumeroCuota}</td>
                <td className="text-center border-r border-gray-400 px-1 text-sm">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(cuota.ValorCuota)}
                </td>
                <td className="text-center border-r px-1 border-gray-400 text-sm">
                  {new Date(cuota.FechaPago).toLocaleDateString("es-CO")}
                </td>
                <td className="text-center">
                  <span
                    className={` ${
                      cuota.Pagada
                        ? "bg-green-200 text-green-500 px-2 text-sm rounded-sm"
                        : "bg-red-200 text-red-500 px-1 text-sm rounded-sm"
                    }`}
                  >
                    {cuota.Pagada ? "Si" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cuotas;
