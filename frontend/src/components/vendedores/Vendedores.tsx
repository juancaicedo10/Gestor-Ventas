import { useState, useEffect } from "react";
import axios from "axios";
import SellIcon from "@mui/icons-material/Sell";
import Sidebar from "../Sidebar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaginationButtons from "../../helpers/paginator";
import decodeToken from "../../utils/tokenDecored";
import { Link } from "react-router-dom";
import Dropdown from "../../utils/DropDown";

function Vendedores() {
  interface Vendedor {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
  }

  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  console.log(vendedores);

  useEffect(() => {
    axios
      .get("https://backendgestorventas.azurewebsites.net/api/vendedores")
      .then((res) => setVendedores(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="w-full overflow-y-hidden">
      <Sidebar />
      <div className="text-3xl font-bold ml-[64px] px-2">
        <header className="flex justify-center">
          <h1 className="my-2 text-3xl text-blue-800 md:text-4xl lg:text-6xl text-start border-b-4 py-2 border-blue-800 w-full">
            Vendedores
          </h1>
          <button className="mx-4 text-blue-800">
            <AddCircleIcon fontSize="large" />
          </button>
        </header>
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 place-items-center rounded-md min-h-svh">
          {vendedores.map((client) => (
            <li
              className="w-full p-2 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
              key={client.Id}
            >
              <div className="flex flex-col">
                <section className="flex items-center justify-between">
                  <SellIcon fontSize="large" className="text-blue-800" />
                  {decodeToken()?.role === "Administrador" && <Dropdown />}
                </section>
                <h2 className="text-xl text-start my-3">
                  Informacion General:
                </h2>
                <div className="text-lg font-light flex flex-col">
                  <li className="flex">
                    <h3 className="font-bold">Nombre:</h3>
                    <p>{client.NombreCompleto}</p>
                  </li>
                  <li className="flex">
                    <h3 className="font-bold">Correo:</h3>
                    <p>{client.Correo}</p>
                  </li>
                  <li className="flex">
                    <h3 className="font-bold">NIT : </h3>
                    <p> {client.NumeroDocumento}</p>
                  </li>
                  <li className="flex">
                    <h3 className="font-bold">Telefono :</h3>
                    <p> {client.Telefono}</p>
                  </li>
                  <li className="flex">
                    <h3 className="font-bold">Ventas:</h3>
                    <Link
                      to={`/ventas/vendedor/${client.Id}`}
                      className="text-blue-700"
                    >
                      Mostrar ventas
                    </Link>
                  </li>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <PaginationButtons page={1} />
      </div>
    </section>
  );
}

export default Vendedores;
