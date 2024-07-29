import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RegistrarAbonoRetiroModal from "../../utils/Abonos-Retiros/RegistrarAbonoRetiroModal";
import Select from "react-select";
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoney from "@mui/icons-material/AttachMoney";

interface Retiro {
  NombreVendedor: string;
  Id: number;
  Valor: number;
  Descripcion: string;
  Tipo: string;
  VendedorId: number;
  Liquidado: boolean;
}

function AbonosyRetiros() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retiros, setRetiros] = useState<Retiro[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sellers, setSellers] = useState<[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<number | undefined>(0);

  const [Base, setBase] = useState<number>(0);

  const getAbonosyRetiros = async (VendedorId: number) => {
    setIsLoading(true);
    console.log("selectedSeller:", selectedSeller);
    Promise.all([
      axios.get(`http://localhost:5000/api/abonos/${VendedorId}`),
      axios.get(`http://localhost:5000/api/retiros/${VendedorId}`),
    ])
      .then(([abonosRes, retirosRes]) => {
        const combinedData = [...abonosRes.data.abonos, ...retirosRes.data.retiros];

        console.log(abonosRes.data.TotalAbonos, "abonosRes.data.base");
        console.log(retirosRes.data.TotalRetiros, "retirosRes.data.base");

        setBase(abonosRes.data.TotalAbonos - retirosRes.data.TotalRetiros);

        console.log("BASE", Base)
        console.log(combinedData, "data");
        setRetiros(combinedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  console.log("retiros:", retiros);

  const getVendedores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vendedores", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSellers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getVendedores();
    getAbonosyRetiros(Number(selectedSeller));

  }, []);


  const handleVendedorChange = (selectedOption: any) => {
    setSelectedSeller(selectedOption);
    getAbonosyRetiros(Number(selectedOption.value));
  };

  const vendedoresOptions = sellers.map((seller: any) => {
    return {
      value: seller.Id,
      label: seller.NombreCompleto,
    };
  });

  return (
    <section className="w-full overflow-hidden min-h-screen">
      <Sidebar />
      <div className="flex flex-col justify-center text-3xl font-bold ml-[64px]">
        <header className="flex flex-col w-full border-b shadow-md bg-white mb-4">
          <div className="flex w-full">
            <h1 className="text-2xl text-blue-900 md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
              Abonos y Retiros
            </h1>
            <button
              className="mx-4 text-blue-900"
              onClick={() => setIsOpen(true)}
            >
              <AddCircleIcon fontSize="large" />
            </button>
          </div>
          <div className="flex justify-center py-4">
            <Select
              options={vendedoresOptions}
              placeholder="Seleccione un vendedor"
              className="w-1/2 mx-4 text-3xl font-semibold"
              onChange={handleVendedorChange}
              value={vendedoresOptions.find((option) => option.value === selectedSeller)}
            />
          </div>
          <h2 className="text-center text-2xl py-4 font-semibold"><span className="font-bold text-3xl text-blue-800">Base:</span>{new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                }).format(Base)}</h2>
        </header>
        <section
          className={`w-full px-2 ${
            isLoading ? "flex items-center justify-center h-screen" : ""
          }`}
        >
          <RegistrarAbonoRetiroModal
            isOpen={isOpen}
            onClose={() => setIsOpen(!isOpen)}
            getGastos={() => getAbonosyRetiros(Number(selectedSeller))}
            setSelectedVendedor={setSelectedSeller}
            selectedVendedor={selectedSeller}
          />
          {isLoading ? (
            <Spinner isLoading={isLoading} />
          ) : (
            <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-start rounded-md">
              {retiros.map((retiro, i) => {
                return (
                  <li
                    className="w-full p-2 rounded-md border flex flex-col bg-white shadow-md md:hover:scale-105 transition-transform duration-100"
                    key={i}
                  >
                    <div className="flex flex-col">
                      <section className="w-full p-2 flex items-center justify-center rounded-md bg-blue-900 text-white">
                        <span>
                          <h1 className="font-normal text-2xl py-2">
                            {retiro.NombreVendedor.split(" ")
                              .slice(0, 2)
                              .join(" ")}
                          </h1>
                          <h2
                            className={`rounded-md font-semibold text-lg text-white text-center ${
                              retiro.Tipo === "Retiro"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          >
                            {retiro.Tipo}
                          </h2>
                        </span>
                      </section>
                      <div className="text-lg font-light flex flex-col">
                        <li className="flex items-center my-1">
                          <SellIcon className="text-blue-800" />
                          <span
                            className={`mx-4 font-bold ${
                              retiro.Tipo === "Retiro"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            <h3 className="font-bold text-xl text-blue-800">
                              Valor:
                            </h3>
                            {retiro.Tipo === "Abono"
                              ? `+ ${new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                }).format(retiro.Valor)}`
                              : `- ${new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                }).format(retiro.Valor)}`}
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <DescriptionIcon className="text-blue-800" />
                          <span className="mx-4">
                            <h3 className="font-bold text-xl text-blue-800">
                              Descripcion:
                            </h3>
                            <p className="overflow-ellipsis overflow-hidden w-40 md:w-full">
                              {retiro.Descripcion}
                            </p>
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <AttachMoney className="text-blue-800" />
                          <span className="mx-4">
                            <h3 className="font-bold text-xl text-blue-800">
                              Liquidado:
                            </h3>
                            <p className="overflow-ellipsis overflow-hidden w-40 md:w-full">
                              {retiro.Liquidado ? "Si" : "No"}
                            </p>
                          </span>
                        </li>

                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

export default AbonosyRetiros;
