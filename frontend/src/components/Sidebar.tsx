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
import { MENU_MODULOS, MODULOS, ModuloCodigo } from "../constants/modulos";
import { hasPermiso } from "../utils/permissions";

const MODULO_ICONOS: Record<ModuloCodigo, JSX.Element> = {
  [MODULOS.VENDEDORES]: <SupervisedUserCircleIcon fontSize="inherit" />,
  [MODULOS.CLIENTES]: <PeopleIcon fontSize="inherit" />,
  [MODULOS.VENTAS]: <SellIcon fontSize="inherit" />,
  [MODULOS.GASTOS]: <PaymentsIcon fontSize="inherit" />,
  [MODULOS.ADMINISTRADORES]: <SupervisedUserCircleIcon fontSize="inherit" />,
  [MODULOS.ABONOS_RETIROS]: <AccountBalanceIcon fontSize="inherit" />,
  [MODULOS.CLIENTES_APROBAR]: <HowToRegIcon fontSize="inherit" />,
  [MODULOS.GASTOS_APROBAR]: <SavingsIcon fontSize="inherit" />,
  [MODULOS.DISPOSITIVOS]: <DevicesOther fontSize="inherit" />,
  [MODULOS.VENTAS_APROBAR]: <FactCheckIcon fontSize="inherit" />,
  [MODULOS.LIQUIDACIONES]: <ReceiptLongIcon fontSize="inherit" />,
};

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const modulosVisibles = MENU_MODULOS.filter((modulo) =>
    hasPermiso(modulo.codigo)
  );

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
        {modulosVisibles.map((modulo) => (
          <Link
            key={modulo.codigo}
            to={modulo.ruta}
            className="flex text-white hover:text-white hover:bg-quaternary rounded-md m-2 p-2 cursor-pointer justify-start items-center overflow-hidden"
            onClick={() => setShow(false)}
          >
            {MODULO_ICONOS[modulo.codigo]}
            <p hidden={!show} className="font-normal text-xl">
              {modulo.label}
            </p>
          </Link>
        ))}
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
