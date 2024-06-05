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
      <div className="w-full">
        <h1 className="text-center font-bold my-2 text-2xl">Ventas</h1>
        <section className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center">Cuota</h1>
            <ul className="list-none">
              {cuotas.map((cuota, index) => (
                <li key={index}>{cuota}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center">Valor</h1>
            <ul className="list-none">
              {valores.map((valor, index) => (
                <li key={index}>{valor}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center">Interes</h1>
            <ul className="list-none">
              {intereses.map((interes, index) => (
                <li key={index}>{interes}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl text-center">Fecha</h1>
            <ul className="list-none">
              {fechas.map((fecha, index) => (
                <li key={index}>{fecha}</li>
              ))}
            </ul>
          </div>
        </section>
        <PaginationButtons page={1} />
      </div>
    </div>
  );
}

export default Ventas;
