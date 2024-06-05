import Sidebar from "./Sidebar";
import PaginationButtons from "../helpers/paginator";
function Ventas() {
  // Datos de ejemplo
  const cuotas = [1, 2, 3, 4, 5];
  const valores = [100, 200, 300, 400, 500];
  const intereses = [10, 20, 30, 40, 50];
  const fechas = ["1/01/22", "1/01/22", "1/01/22", "1/01/22", "1/01/22"];
  const estados = [
    "Pagado",
    "Pendiente",
    "Pendiente",
    "Pendiente",
    "Pendiente",
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex flex-col items-center ml-12">
        <h1 className="text-center font-bold my-2 text-2xl">
          Juan Caicedo Ventas
        </h1>
        <li className="grid w-10/12 sm:w-10/12 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col justify-center items-center border m-2 bg-white">
          <h1 className="bg-blue-700 text-white font-normal py-1 rounded-t-md px-4 w-full">
            Numero Venta: <span className="font-bold">00001</span>
          </h1>
          <p className="p-2">
            <span className="font-semibold">Descripcion</span> Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Error eaque aliquid eveniet
            corrup
          </p>
          <ul className="flex flex-col w-full p-2">
            <li>
              <span className="font-semibold">Vendedor:</span> juanito
            </li>
            <li>
              <span className="font-semibold">Cliente:</span>
              Pepito
            </li>
            <li>
            <span className="font-semibold">Periodicidad</span>: quincenal
          </li>
          </ul>
          <ul className="grid grid-cols-2 w-full py-2 ">
            <li className="text-center flex flex-col">
              <span className="font-semibold">Valor Venta:</span>
               2000$</li>
            <li className="text-center">
              <span className="font-semibold flex flex-col">N Cuotas</span>
               10</li>
          </ul>
          <h3 className="text-blue-500 font-bold">Detalle de Cuotas</h3>
          <table className="w-full">
            <thead>
              <tr>
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
        <li className="grid w-10/12 sm:w-10/12 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col justify-center items-center border">
          <h1 className="bg-blue-700 text-white font-normal py-1 rounded-t-md px-4 w-full">
            Numero Venta: 00001
          </h1>
          <p className="p-2">
            <span className="font-semibold">Descripcion</span> Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Error eaque aliquid eveniet
            corrup
          </p>
          <ul className="flex flex-col w-full p-2">
            <li>
              <span className="font-semibold">Vendedor:</span> juanito
            </li>
            <li>
              <span className="font-semibold">Cliente:</span>
              Pepito
            </li>
            <li>
            <span className="font-semibold">Periodicidad</span>: quincenal
          </li>
          </ul>
          <ul className="grid grid-cols-2 w-full py-2 ">
            <li className="text-center flex flex-col">
              <span className="font-semibold">ValorVenta:</span>
               2000$</li>
            <li className="text-center">
              <span className="font-semibold flex flex-col">N Cuotas</span>
               10</li>
          </ul>
          <h3 className="text-blue-500 font-bold">Detalle de Cuotas</h3>
          <table className="w-full">
            <thead>
              <tr>
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
          <h4>
            Venta Activa:{" "}
            <span className="text-white font-semibold rounded-md bg-green-700 px-2">
              Si
            </span>
          </h4>
          <h5>Saldo Morativo total: 300%</h5>
        </div>
        </li>
        <li className="grid w-10/12 sm:w-10/12 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="flex flex-col justify-center items-center border">
          <h1 className="bg-blue-700 text-white font-normal py-1 rounded-t-md px-4 w-full">
            Numero Venta: 00001
          </h1>
          <p className="p-2">
            <span className="font-semibold">Descripcion</span> Lorem ipsum dolor
            sit amet consectetur adipisicing elit. Error eaque aliquid eveniet
            corrup
          </p>
          <ul className="flex flex-col w-full p-2">
            <li>
              <span className="font-semibold">Vendedor:</span> juanito
            </li>
            <li>
              <span className="font-semibold">Cliente:</span>
              Pepito
            </li>
            <li>
            <span className="font-semibold">Periodicidad</span>: quincenal
          </li>
          </ul>
          <ul className="grid grid-cols-2 w-full py-2 ">
            <li className="text-center flex flex-col">
              <span className="font-semibold">ValorVenta:</span>
               2000$</li>
            <li className="text-center">
              <span className="font-semibold flex flex-col">N Cuotas</span>
               10</li>
          </ul>
          <h3 className="text-blue-500 font-bold">Detalle de Cuotas</h3>
          <table className="w-full">
            <thead>
              <tr>
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
          <h4>
            Venta Activa:{" "}
            <span className="text-white font-semibold rounded-md bg-green-700 px-2">
              Si
            </span>
          </h4>
          <h5>Saldo Morativo total: 300%</h5>
        </div>
        </li>
        <PaginationButtons page={1} />
      </div>
    </div>
  );
}

export default Ventas;
