import Sidebar from "./Sidebar";
import { useState } from "react";
import SellImage from '../images/Sells.png'

function ventasAprobar() {
  const [SellsToApprove, setSellsToApprove] = useState([]);

  console.log(setSellsToApprove);

  return (
    <div>
      <Sidebar />
      <div className="ml-[63px]">
        <h1 className="mb-2 py-4 text-2xl text-blue-900 md:text-4xl lg:text-5xl text-center border-b shadow-md bg-gray-50 w-full font-bold">
          Ventas por aprobar
        </h1>
        <div>{SellsToApprove.length === 0 ? <div className="flex w-full h-[80vh] items-center justify-center">
          <div className="flex items-center flex-col justify-center w-full">
            <img src={SellImage} alt="venta imagen" className="w-3/4 md:w-1/4" />
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-blue-900 py-4 text-center w-full md:w-1/2">
              En este momento no hay ninguna venta por aprobar
            </h1>
          </div>
        </div> : <></>}</div>
      </div>
    </div>
  );
}

export default ventasAprobar;
