import { useState } from "react"
import SellIcon from '@mui/icons-material/Sell';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
export default function Sidebar() {
  const [show, setShow] = useState(false)

  return (
    <aside className={`h-dvh bg-white md:w-1/2 lg:w-1/3 border-r-4 mr-2 ${show ? 'w-3/4 absolute' : 'w-[75px] md:w-[120px] lg:w-[130px]'}`}>
      <button className="w-full flex items-center justify-center p-2 text-xl" onClick={() => setShow(!show)}>
        {show ? 'Menu' : <ArrowForwardIosIcon fontSize="large"/>}
      </button>
      <ul className="mx-2 text-2xl flex flex-col w-full overflow-hidden">
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer">
          <SellIcon fontSize="large"/>
          <p hidden={!show}>Vendedores</p>
          </li>
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer">
          <PeopleIcon fontSize="large"/>
          <p hidden={!show}>Clientes</p>
        </li>
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer">
        <AttachMoneyIcon fontSize="large"/>
          <p hidden={!show}>Ventas</p>
        </li>
      
        <li className="flex hover:text-white hover:bg-green-400 rounded-md m-2 p-2 cursor-pointer">
          <AccountCircleIcon fontSize="large"/>
          <p hidden={!show} >Perfil</p>
        </li>
      </ul>
    </aside>
  )
}
