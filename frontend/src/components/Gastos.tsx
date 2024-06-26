import Sidebar from "./Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import SellIcon from "@mui/icons-material/Sell";
import StoreIcon from "@mui/icons-material/Store";
import { useEffect, useState } from "react";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface Gasto {
  id: number;
  Nombre: string;
  Descripcion: string;
  MontoMaximo: number;
}

interface GastoPorVendedor {
  GastoId: number;
  Nombre: string;
  Descripcion: string;
  Valor: number;
  Fecha: string;
  NombreVendedor: string;
}

function Gastos() {
  const [activeView, setActiveView] = useState<
    "tiposDeGastos" | "gastosPorVendedor"
  >("tiposDeGastos");

  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [gastosPorVendedor, setGastosPorVendedor] = useState<
    GastoPorVendedor[]
  >([]);
  //const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/gastos/tipos")
      .then((res) => {
        setGastos(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/gastos")
      .then((res) => {
        setGastosPorVendedor(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [activeView === "gastosPorVendedor"]);

  return (
    <section>
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex justify-center w-full border-b shadow-md bg-white">
          <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
            Gastos
          </h1>
        </header>
        <ul className="flex text-base font-normal rounded-lg w-full justify-end px-1 md:px-2 ">
          <li
            className={`w-full md:w-1/4 lg:w-1/6 cursor-pointer select-none px-2 py-2 text-sm md:text-base text-center ${
              activeView === "tiposDeGastos"
                ? "bg-blue-800 text-white"
                : "bg-white text-black"
            } transition-colors duration-300 ease-in-out`}
            onClick={() => setActiveView("tiposDeGastos")}
          >
            Tipos de Gastos
          </li>
          <li
            className={`w-full md:w-1/4 lg:w-1/6 cursor-pointer select-none px-2 py-2 text-sm md:text-base text-center ${
              activeView === "gastosPorVendedor"
                ? "bg-blue-800 text-white"
                : "bg-white text-black"
            } transition-colors duration-300 ease-in-out`}
            onClick={() => setActiveView("gastosPorVendedor")}
          >
            Gastos por vendedor
          </li>
        </ul>
        <div>
          {activeView === "tiposDeGastos" ? (
            <div className="px-4">
              <div className="w-full flex justify-between items-center">
                <h4 className="text-blue-900 py-2 text-xl md:text-2xl lg:text-3xl">
                  Tipos de Gastos:
                </h4>
                <button className="mx-4 text-blue-900">
            <AddCircleIcon fontSize="large" />
          </button>
              </div>
              <ul className="w-full text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gastos.map((gasto) => (
                  <li className="bg-white border rounded-md p-1">
                    <div className="w-full flex bg-blue-800 text-white py-4 text-xl rounded-lg p-2 font-medium justify-between">
                      <StoreIcon />
                      <h4>{gasto.Nombre}</h4>
                      <button>M</button>
                    </div>
                    <div className="flex items-center text-blue-800 py-2">
                      <DescriptionIcon />
                      <span className="px-2">
                        <h6 className="font-semibold text-blue-800 text-lg">
                          Descripcion:
                        </h6>
                        <p className="font-normal text-black">
                          {gasto.Descripcion}
                        </p>
                      </span>
                    </div>
                    <div className="flex items-center text-blue-800 py-2">
                      <SellIcon />
                      <span className="px-2">
                        <h6 className="font-semibold text-blue-800 text-lg">
                          Monto Maximo:{" "}
                        </h6>
                        <p className="text-black font-normal">
                          {gasto.MontoMaximo} $
                        </p>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="px-2 md:px-4">
              <div className="w-full py-5 flex items-center justify-between bg-blue-800 rounded-md border border-black">
                <input
                  type="text"
                  placeholder="nombre vendedor"
                  className="font-normal text-xl p-2 w-full border-2 md:w-1/2 rounded-full border-blue-800"
                />
                   <button className="mx-4 text-white">
            <AddCircleIcon fontSize="large" />
          </button>
              </div>
              <div>
                <h4 className="text-blue-900 py-2 text-xl md:text-2xl lg:text-3xl text-center md:text-start">
                  Gastos por vendedor:
                </h4>
                <ul className="w-full text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gastosPorVendedor.map((gasto) => (
                    <li className="bg-white border rounded-md p-1">
                      <div className="w-full text-white bg-blue-800 rounded-md p-4 text-xl font-semibold">
                        <h6 className="text-center">{gasto.NombreVendedor}</h6>
                      </div>
                      <div className="flex items-center my-2 text-blue-800">
                        <SellIcon />
                        <span className="mx-2">
                          <h6>Nombre Gasto:</h6>
                          <p className="font-normal text-black">
                            {gasto.Nombre}
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center my-2 text-blue-800">
                        <DescriptionIcon />
                        <span className="mx-2">
                          <h6>Descripcion Gasto: </h6>
                          <p className="font-normal text-black">
                            {gasto.Descripcion}
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center my-2 text-blue-800">
                        <AttachMoneyIcon />

                        <span className="mx-2">
                          <h6>Valor del gasto:</h6>
                          <p className="font-normal text-black">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(gasto.Valor)}
                            $
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center text-blue-800">
                        <CalendarMonthIcon />
                        <span className="mx-2">
                          <h6>Fecha del gasto:</h6>
                          <p className="font-normal text-black">
                            {new Date(gasto.Fecha).toLocaleDateString("es-CO")}
                          </p>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Gastos;
