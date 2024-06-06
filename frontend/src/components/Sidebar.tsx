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

  console.log(localStorage.getItem("user"), "user")
  return (
    <aside
      className={`z-50 h-full flex fixed flex-col bg-blue-800 transition-all duration-500 ease-in-out ${
        show ? "w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4" : "w-16"
      }`}
    >
      <button
        className="w-full flex items-center justify-center p-2 text-3xl text-white font-extrabold"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <CloseIcon fontSize="large" className="relative right-0" />
        ) : (
          <ArrowForwardIosIcon fontSize="large" />
        )}
      </button>
      <ul className="text-2xl flex flex-col w-full">
        <li className="flex hover:text-white hover:bg-blue-300 rounded-md m-2 p-2 cursor-pointer justify-start overflow-hidden">
          <Link
            to="/vendedores"
            className="flex text-white justify-center items-center"
            onClick={() => setShow(false)}
          >
            <SellIcon fontSize="large" />
            <p hidden={!show} className="font-normal">
              Vendedores
            </p>
          </Link>
        </li>
        <li className="flex hover:text-white hover:bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link
            to="/clientes"
            className="flex text-white"
            onClick={() => setShow(false)}
          >
            <PeopleIcon fontSize="large" />
            <p hidden={!show} className="font-normal">
              Clientes
            </p>
          </Link>
        </li>
        <li className="flex hover:text-white hover:bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link
            to="/ventas"
            className="flex text-white"
            onClick={() => setShow(false)}
          >
            <AttachMoneyIcon fontSize="large" />
            <p hidden={!show} className="font-normal">
              Ventas
            </p>
          </Link>
        </li>
        <li className="flex hover:text-white hover:bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link
            to="/cuotas"
            className="flex text-white"
            onClick={() => setShow(false)}
          >
            <AttachMoneyIcon fontSize="large" />
            <p hidden={!show} className="font-normal">
              Cuotas
            </p>
          </Link>
        </li>
        {decodeToken().role === "Administrador" && (
          <li className="flex hover:text-white hover:bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start">
            <Link
              to="/clientes/aprobar"
              className="flex text-white"
              onClick={() => setShow(false)}
            >
              <AdminPanelSettingsIcon fontSize="large" />
              <p hidden={!show} className="font-normal">
                Clientes por aprobar
              </p>
            </Link>
          </li>
        )}
        <li className="flex hover:text-white hover:bg-blue-500 rounded-md m-2 p-2 cursor-pointer justify-start">
        <AccountCircleIcon fontSize="large" />
          <Link 
          to='/perfil'
          className="flex text-white"
          onClick={() => setShow(false)}
          >
          <p hidden={!show} className="font-normal">
            Perfil
          </p>
          </Link>
        </li>
      </ul>
      <li onClick={() => handleLogout()}>
        <button className="m-2 py-2 px-4 rounded-lg text-white text-2xl font-bold bg-blue-500 absolute bottom-0 mx-auto">
          <LogoutIcon fontSize="large" />
          <p hidden={!show} className="font-normal">
            Cerrar Sesion
          </p>
        </button>
      </li>
    </aside>
  );
}
