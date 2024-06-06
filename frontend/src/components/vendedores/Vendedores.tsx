import { useState, useEffect } from "react";
import axios from "axios";
import SellIcon from "@mui/icons-material/Sell";
import Sidebar from "../Sidebar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaginationButtons from "../../helpers/paginator";
import decodeToken from "../../utils/tokenDecored";
import { Link } from "react-router-dom";

function Vendedores() {
  interface Client {
    ID: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
  }

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vendedores")
      .then((res) => setClients(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="flex w-full">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold w-full ml-[80px]">
        <header className="flex justify-center w-[97%]">
          <h1 className="my-2 text-3xl text-blue-800 md:text-4xl lg:text-6xl text-start border-b-4 py-2 border-blue-400 w-full">
            vendedores
          </h1>
          <button className="mx-4 text-blue-300">
            <AddCircleIcon fontSize="large" />
          </button>
        </header>
        <section className="w-full min-h-lvh">
          <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md">
            {clients.map((client, Id) => (
              <li
                className="w-11/12 min-h-[260px] rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                key={Id}
              >
                <div className="w-10/12 flex flex-col px-2 py-2">
                  <SellIcon fontSize="large" className="text-blue-800" />
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
                      <Link to={`/ventas/${client.ID}`} className="border-b text-blue-700">Mostrar ventas</Link>
                    </li>
                  </div>
                </div>
                {decodeToken() === "Administrador" && (
                  <div className="h-full flex items-center justify-start mx-2">
                    <button className="text-black">
                      <VisibilityIcon fontSize="medium" />
                    </button>
                    <button className="text-blue-500">
                      <EditIcon fontSize="medium" />
                    </button>
                    <button className="text-red-500">
                      <DeleteIcon fontSize="medium" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
        <PaginationButtons page={1} />
      </div>
    </section>
  );
}

export default Vendedores;
