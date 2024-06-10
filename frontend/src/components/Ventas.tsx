import Sidebar from "./Sidebar";
import PaginationButtons from "../helpers/paginator";
import { useEffect, useState } from "react";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  console.log(ventas);
  useEffect(() => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/ventas")
      .then((res) => setVentas(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section>
      <Sidebar />
      <div className="ml-[64px]">
      <header className="flex justify-center w-full border-b shadow-md bg-white">
          <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-center py-2 w-full font-bold">
            Ventas
          </h1>
          <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" onClick={toggleModal}/>
          </button>
        </header>
        <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {ventas.map((venta) => (
            <li>
              <div className="flex flex-col border m-2 bg-white p-2">
                <header className="bg-blue-900 text-white font-normal py-4 rounded-md px-4 w-full flex flex-col items-center">
                  <SellIcon fontSize="large" className="text-white" />
                  <h1 className="text-2xl pb-2 text-center">
                    <span className="font-bold">Venta:</span> Zapatos Nike
                    originales
                  </h1>
                  <p className="text-gray-300 text-lg mx-3 text-center">
                    <span className="font-medium">Cliente:</span> Juan Esteban
                    Caicedo Valencia
                  </p>
                </header>
                <p className="rounded-md border-2 p-2 mt-2 text-sm">
                  <span className="font-bold text-xl">Descripcion: <br /></span> Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Error eaque
                  aliquid eveniet corrup Lorem ipsum dolor sit amet consectetur
                  adipisicing eli
                </p>
                <ul className="flex flex-col rounded-md border-2 p-2 text-sm my-2">
                <h4 className="text-xl font-bold pb-2">Detalles:</h4>
                <li className="p-1">
                <SellIcon fontSize="small"/>
                      <span className="font-semibold">Numero Venta:</span>{" "}
                      {'000001'}
                    </li>
                    <li className="p-1">
                      <SellIcon fontSize="small"/>
                      <span className="font-semibold">Vendedor:</span>{" "}
                      {venta.NombreVendedor}
                    </li>
                    <li className="p-1">
                    <SellIcon fontSize="small"/>
                      <span className="font-semibold">Cliente:</span>{" "}
                      {venta.NombreCliente}
                    </li>
                    <li className="p-1">
                    <SellIcon fontSize="small"/>
                      <span className="font-semibold">Periodicidad</span>:{" "}
                      {venta.Periodicidad}
                    </li>
                    <li className="p-1">
                    <SellIcon fontSize="small"/>
                      <span className="font-semibold">Fecha Inicio:</span>{" "}
                      {venta.FechaInicio}
                    </li>
                    <li className="p-1 text-blue-800 flex items-center">
                    <SellIcon fontSize="small"/>
                      <span className="font-semibold">Fecha Fin:</span>{" "}
                      <p className="text-black">
                      {venta.FechaFin}
                      </p>
                    </li>
                </ul>
                <h4 className="font-bold text-xl">Datos Financieros:</h4>
                <ul className="grid grid-cols-2 rounded-md border-2 p-2 w-full py-2 ">
                <li>
                <div className="text-start flex flex-col">
                    <span className="font-semibold">Valor Venta:</span>
                    {venta.ValorVenta}$
                  </div>
                  <div className="text-start">
                    <span className="font-semibold flex flex-col">
                      N Cuotas
                    </span>
                    {venta.NumeroCuotas}
                  </div>
                </li>
                <li>
                <div className="text-start flex flex-col">
                    <span className="font-semibold">Abonado:</span>
                    {venta.SaldoMoraTotal}$
                  </div>
                  <div className="text-start">
                    <span className="font-semibold flex flex-col">
                      Cuotas Pagadas
                    </span>
                    {venta.NumeroCuotas}
                  </div>
                </li>
                </ul>
                <Link to='/'>Cuotas Detalles</Link>
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
