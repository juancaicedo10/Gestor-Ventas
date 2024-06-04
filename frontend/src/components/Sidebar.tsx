import { useState } from "react"
import SellIcon from '@mui/icons-material/Sell';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import decodeToken from "../utils/tokenDecored";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


export default function Sidebar() {
  const [show, setShow] = useState(false)

  return (
    <aside className={`z-50 h-dvh flex fixed md:mr-9 flex-col bg-green-500 transition-all duration-500 ease-in-out ${show ? 'w-3/4 sm:w-1/2 md:w-1/2' : 'w-16'}`}>
      <button className="w-full flex items-center justify-center p-2 text-3xl text-white font-extrabold" onClick={() => setShow(!show)}>
        {show ? <CloseIcon fontSize="large" className="relative right-0"/> : <ArrowForwardIosIcon fontSize="large"/>}
      </button>
      <ul className="text-2xl flex flex-col w-full">
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link to="/vendedores" className="flex text-white justify-center items-center" onClick={() =>setShow(false)}>
            <SellIcon fontSize="large"/>
            <p hidden={!show} className="font-bold">Vendedores</p>
          </Link>
          </li>
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link to='/clientes' className="flex text-white" onClick={() =>setShow(false)}>
          <PeopleIcon fontSize="large"/>
          <p hidden={!show} className="font-bold">Clientes</p>
          </Link>
        </li>
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link to='/ventas' className="flex text-white" onClick={() =>setShow(false)}>
        <AttachMoneyIcon fontSize="large"/>
          <p hidden={!show} className="font-bold">Ventas</p>
          </Link>
        </li>
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link to='/ventas' className="flex text-white" onClick={() =>setShow(false)}>
        <AttachMoneyIcon fontSize="large"/>
          <p hidden={!show} className="font-bold">Panel de Control</p>
          </Link>
        </li>
        { decodeToken().role === 'Administrador' &&
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <Link to='/clientes/aprobar' className="flex text-white" onClick={() =>setShow(false)}>
        <AdminPanelSettingsIcon fontSize="large"/>
          <p hidden={!show} className="font-bold">Clientes por aprobar</p>
          </Link>
        </li>
        }
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer justify-start">
          <AccountCircleIcon fontSize="large"/>
          <p hidden={!show} className="font-bold">Perfil</p>
        </li>
      </ul>
      <Link to='/home'>
      <button className="m-2 py-2 px-4 rounded-lg text-white text-2xl font-bold bg-green-900 absolute bottom-0 mx-auto">
        <LogoutIcon fontSize="large"/>
        <p hidden={!show} className="font-bold">Cerrar Sesion</p>
      </button>
      </Link>
    </aside>
  )
}
