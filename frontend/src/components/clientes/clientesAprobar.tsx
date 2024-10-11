import Sidebar from "../Sidebar";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../../utils/Spinner";
import ClientsImage from "../../images/clients.png";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { toast } from "react-toastify";
import decodeToken from "../../utils/tokenDecored";

function clientesAprobar() {
  interface ClientToApprove {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    Telefono: string;
  }

  const [clientsToApprove, setClientsToApprove] = useState<ClientToApprove[]>(
    []
  );
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://backend-gestor-ventas.onrender.com/api/clientes/aprobar/${decodeToken()?.user?.Id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setClientsToApprove(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [refresh]);

  const HandleApprove = async (id: number, approval: { aprobado: boolean }) => {
    try {
      await axios.put(
        `https://backend-gestor-ventas.onrender.com/api/clientes/aprobar/${id}`,
        approval,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh(!refresh);
      toast.success(approval.aprobado ? "Cliente aprobado" : "Cliente rechazado");
    } catch (error) {
      console.error("Error al aprobar cliente", error);
    }
  };


  

  return (
    <section className="w-full">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <h1 className="mb-2 py-4 text-2xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full">
          Clientes por aprobar
        </h1>
        <section
          className={`${isLoading && "flex items-center justify-center"} h-dvh`}
        >
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : clientsToApprove.length === 0 ? (
            <div className="flex items-center flex-col justify-center w-full h-[70vh]">
              <img src={ClientsImage} alt="clientes image" />
              <h1 className="w-full md:w-1/2 text-center font-extrabold text-3xl md:text-4xl lg:text-6xl text-blue-900">
                En este momento no hay ningun cliente por aprobar
              </h1>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full place-items-center md:place-items-start md:ml-4">
              {clientsToApprove.map((client) => (
                  <li className="flex flex-col w-full">
                    <div className="w-full">
                      <button
                        className="bg-green-50 text-green-500 px-2 py-1 rounded-md w-1/2 border-2 border-green-500 font-bold text-xl hover:bg-green-200"
                        onClick={() =>
                          HandleApprove(client.Id, { aprobado: true })
                        }
                      >
                        <div className="w-full flex justify-between">
                        <h5>Aprobar</h5>
                        <span>
                          <CheckIcon />
                        </span>
                        </div>
                      </button>
                      <button
                        className="bg-red-50 text-red-500 px-2 py-1 rounded-md w-1/2 border-2 border-red-500 font-bold text-xl hover:bg-red-200"
                        onClick={() => HandleApprove(client.Id, { aprobado: false })}
                      >
                        <div className="w-full flex justify-between">
                        <h5>Rechazar</h5>
                        <span>
                          <CloseIcon />
                        </span>
                        </div>
                      </button>
                    </div>
                    <div className="bg-blue-900 rounded-md p-2 md:p-4">
                      <p className="text-lg font-bold text-white">
                        <h6 className="font-normal text-center">{client.NombreCompleto}</h6>
                      </p>
                      <p className="text-lg text-white">
                        <h6 className="font-normal text-center">
                          CC.{client.NumeroDocumento}
                        </h6>
                      </p>
                    </div>
                    <div className="bg-white rounded-md border shadow-sm p-2">
                      <p className="text-lg text-blue-900 flex items-center"></p>
                      <p className="text-lg text-blue-900 flex items-center">
                        <CalendarMonthIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Correo:</h6>
                          <span className="text-black font-normal">{client.Correo}</span>
                        </span>
                      </p>
                      <p className="text-lg text-blue-900 flex items-center">
                        <AccountBalanceIcon />
                        <span className="m-1">
                          <h6 className="font-semibold">Telefono:</h6>
                          <span className="text-black font-normal">+57 {client.Telefono}</span>
                        </span>
                      </p>
                    </div>
                  </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default clientesAprobar;
