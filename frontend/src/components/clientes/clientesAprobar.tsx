import Sidebar from "../Sidebar";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import { useState, useEffect } from "react";
import Spinner from "../../utils/Spinner";
import ClientsImage from "../../images/clients.png";
import { toast } from "react-toastify";
import decodeToken from "../../utils/tokenDecored";
import HttpClient from "../../Services/httpService";
import PinDropIcon from "@mui/icons-material/PinDrop";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Work from "@mui/icons-material/Work";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PersonIcon from "@mui/icons-material/Person";

function clientesAprobar() {
  interface ClientToApprove {
    Id: number;
    NombreCompleto: string;
    Correo: string;
    NumeroDocumento: string;
    VendedorNombre: string;
    Telefono: string;
    Direccion: string;
    Ocupacion: string;
    Detalle: string;
    Foto: string;
  }

  const [clientsToApprove, setClientsToApprove] = useState<ClientToApprove[]>(
    []
  );
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    HttpClient.get(
      `${import.meta.env.VITE_API_URL}/api/clientes/aprobar/${
        decodeToken()?.user?.Id
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
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
    setDisabled(true);
    try {
      await HttpClient.put(
        `${import.meta.env.VITE_API_URL}/api/clientes/aprobar/${id}`,
        approval,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefresh(!refresh);
      toast.success(
        approval.aprobado ? "Cliente aprobado" : "Cliente rechazado"
      );
      setClientsToApprove((prevClients) =>
        prevClients.filter((client) => client.Id !== id)
      );
      setDisabled(false);
    } catch (error) {
      console.error("Error al aprobar cliente", error);
      toast.error("Error al aprobar cliente");
      setDisabled(false);
    }
  };

  return (
    <section className="w-full">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <h1 className="mb-2 py-4 text-2xl text-primary md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full">
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
              <h1 className="w-full md:w-1/2 text-center font-extrabold text-3xl md:text-4xl lg:text-6xl text-primary">
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
                      disabled={disabled}
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
                      disabled={disabled}
                      onClick={() =>
                        HandleApprove(client.Id, { aprobado: false })
                      }
                    >
                      <div className="w-full flex justify-between">
                        <h5>Rechazar</h5>
                        <span>
                          <CloseIcon />
                        </span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-primary rounded-md p-2 md:p-4 flex flex-row">
                    <img
                      src={client.Foto}
                      alt=""
                      className="rounded-full w-16 h-16"
                    />
                    <div className="flex flex-col justify-center items-start ml-4">
                      <p className="text-lg font-bold text-white">
                        <h6 className="font-normal text-start">
                          {client.NombreCompleto}
                        </h6>
                      </p>
                      <p className="text-lg text-white">
                        <h6 className="font-normal text-center">
                          CC.{client.NumeroDocumento}
                        </h6>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-md border shadow-sm p-2">
                    <p className="text-lg text-primary flex items-center">
                      <PersonIcon />
                      <span className="m-1">
                        <h6 className="font-semibold">Vendedor:</h6>
                        <span className="text-black font-normal">
                          {client.VendedorNombre}
                        </span>
                      </span>
                    </p>
                    <p className="text-lg text-primary flex items-center">
                      <EmailIcon />
                      <span className="m-1">
                        <h6 className="font-semibold">Correo:</h6>
                        <span className="text-black font-normal">
                          {client.Correo}
                        </span>
                      </span>
                    </p>
                    <p className="text-lg text-primary flex items-center">
                      <PhoneIcon />
                      <span className="m-1">
                        <h6 className="font-semibold">Telefono:</h6>
                        <span className="text-black font-normal">
                          +57 {client.Telefono}
                        </span>
                      </span>
                    </p>
                    <p className="text-lg text-primary flex items-center">
                      <PinDropIcon />
                      <span className="m-1">
                        <h6 className="font-semibold">Dirección:</h6>
                        <span className="text-black font-normal">
                          {client.Direccion}
                        </span>
                      </span>
                    </p>
                    <p className="text-lg text-primary flex items-center">
                      <Work />
                      <span className="m-1">
                        <h6 className="font-semibold">Ocupación:</h6>
                        <span className="text-black font-normal">
                          {client.Ocupacion}
                        </span>
                      </span>
                    </p>
                    <p className="text-lg text-primary flex items-center">
                      <BorderColorIcon />
                      <span className="m-1">
                        <h6 className="font-semibold">Detalle:</h6>
                        <span className="text-black font-normal">
                          {client.Detalle}
                        </span>
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
