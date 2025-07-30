import { useState } from "react";
import SellIcon from "@mui/icons-material/Sell";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import decodeToken from "../utils/tokenDecored";
import { useNavigate } from "react-router-dom";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PaymentsIcon from "@mui/icons-material/Payments";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SavingsIcon from "@mui/icons-material/Savings";
import { DevicesOther } from "@mui/icons-material";

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
      className={`z-50 h-full overflow-y-auto flex fixed flex-col bg-secondary transition-all duration-500 ease-in-out ${
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
      <ul className="text-xl flex flex-col w-full">
        {decodeToken()?.user.role === "Administrador" && (
          <Link
            to="/vendedores"
            className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            onClick={() => setShow(false)}
          >
            <SupervisedUserCircleIcon fontSize="inherit" />
            <p hidden={!show} className="font-normal text-xl">
              Vendedores
            </p>
          </Link>
        )}

        <Link
          to="/clientes"
          className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <PeopleIcon fontSize="inherit" />
          <p hidden={!show} className="font-normal text-xl">
            Clientes
          </p>
        </Link>

        <Link
          to="/ventas"
          className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <SellIcon fontSize="inherit" />
          <p hidden={!show} className="font-normal text-xl">
            Ventas
          </p>
        </Link>
        <Link
          to="/gastos"
          className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
        >
          <PaymentsIcon fontSize="inherit" />
          <p hidden={!show} className="font-normal text-xl">
            Gastos
          </p>
        </Link>
        {decodeToken()?.user.role === "Administrador" && (
          <>
         {decodeToken()?.user.Id === 14 && (
          <Link
            to="/administradores"
            className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            onClick={() => setShow(false)}
          >
            <SupervisedUserCircleIcon fontSize="inherit" />
            <p hidden={!show} className="font-normal text-xl">
              Administradores
            </p>
          </Link>
)}
            <Link
              to="/abonos-retiros"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            >
              <AccountBalanceIcon fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Abonos y Retiros
              </p>
            </Link>
            <Link
              to="/clientes/aprobar"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <HowToRegIcon fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Clientes por aprobar
              </p>
            </Link>
            <Link
              to="/gastos/aprobar"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <SavingsIcon fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Gastos por aprobar
              </p>
            </Link>
            <Link
              to="/dispositivos"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <DevicesOther fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Dispositivos
              </p>
            </Link>
            <Link
              to="/ventas/aprobar"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <FactCheckIcon fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Ventas por aprobar
              </p>
            </Link>
            <Link
              to="/liquidaciones"
              className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
              onClick={() => setShow(false)}
            >
              <ReceiptLongIcon fontSize="inherit" />
              <p hidden={!show} className="font-normal text-xl">
                Liquidaciones
              </p>
            </Link>
          </>
        )}
        <Link
          to="/perfil"
          className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
          onClick={() => setShow(false)}
        >
          <AccountCircleIcon fontSize="inherit" />
          <p hidden={!show} className="font-normal text-xl">
            Perfil
          </p>
        </Link>
      </ul>
      <Link
        to="/"
        className="flex mt-auto min-h-[50px] text-white hover:text-white bg-fifth rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
        onClick={() => handleLogout()}
      >
        <LogoutIcon fontSize="large" />
        <p hidden={!show} className="font-semibold text-xl ml-3">
          Cerrar Sesion
        </p>
      </Link>
    </aside>
  );
}
