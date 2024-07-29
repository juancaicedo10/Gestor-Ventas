import { useState } from "react";
import SellIcon from "@mui/icons-material/Sell";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import decodeToken from "../utils/tokenDecored";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  console.log(decodeToken().user);
  return (
    <aside
      className={`z-50 h-full flex fixed flex-col bg-blue-800 transition-all duration-500 ease-in-out ${
        show ? "w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4" : "w-16"
      }`}
    >
      <header className="flex justify-between items-center">
        <div
          className={` text-white font-bold text-center p-2 pl-5 overflow-hidden ${
            !show && "hidden"
          }`}
        >
          <h2 className="text-start text-xl w-full font-semibold overflow-hidden">
            {decodeToken()
              ?.user.NombreCompleto.split(" ")
              .slice(0, 2)
              .join(" ")}
          </h2>
          <h3 className="text-start font-light text-gray-300 overflow-hidden">
            {decodeToken()?.user.role}
          </h3>
        </div>
        <button
          className={`flex items-center justify-center p-2 text-3xl text-white font-extrabold ${
            !show ? "w-full" : "w-1/4"
          }`}
          onClick={() => setShow(!show)}
        >
          {show ? (
            <CloseIcon fontSize="large" className="relative right-0" />
          ) : (
            <ArrowForwardIosIcon fontSize="large" />
          )}
        </button>
      </header>
      <ul className="text-xl md:text-2xl flex flex-col w-full">
      {decodeToken()?.user.role === "Administrador" && (
        <Link
          to="/vendedores"
          className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <SellIcon fontSize="large" />
          <p hidden={!show} className="font-normal">
            Vendedores
          </p>
        </Link>
)}

        <Link
          to="/clientes"
          className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <PeopleIcon fontSize="large" />
          <p hidden={!show} className="font-normal">
            Clientes
          </p>
        </Link>

        <Link
          to="/ventas"
          className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <AttachMoneyIcon fontSize="large" />
          <p hidden={!show} className="font-normal">
            Ventas
          </p>
        </Link>
        {decodeToken()?.user.role === "Administrador" && (
          <>
            <Link
              to="/gastos"
              className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Gastos
              </p>
            </Link>

            <Link
              to="/abonos-retiros"
              className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Abonos y Retiros
              </p>
            </Link>
            <Link
              to="/clientes/aprobar"
              className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Clientes por aprobar
              </p>
            </Link>
            <Link
              to="/ventas/aprobar"
              className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Ventas por aprobar
              </p>
            </Link>
            <Link
              to="/liquidaciones"
              className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Liquidaciones
              </p>
            </Link>
          </>
        )}
        <Link
          to="/perfil"
          className="flex text-white hover:text-white hover:bg-blue-600 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <AccountCircleIcon fontSize="large" />
          <p hidden={!show} className="font-normal">
            Perfil
          </p>
        </Link>
      </ul>
      <Link
        to="/"
        className="flex mt-auto text-white hover:text-white bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
        onClick={() => handleLogout()}
      >
        <LogoutIcon fontSize="large" />
        <p hidden={!show} className="font-semibold text-2xl">
          Cerrar Sesion
        </p>
      </Link>
    </aside>
  );
}
