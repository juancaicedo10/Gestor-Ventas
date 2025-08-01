
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Spinner from "../../utils/Spinner";
import SellIcon from "@mui/icons-material/Sell";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RegistrarAbonoRetiroModal from "../../utils/Abonos-Retiros/RegistrarAbonoRetiroModal";
import Select from "react-select";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoney from "@mui/icons-material/AttachMoney";
import decodeToken from "../../utils/tokenDecored";
import { useVendedorContext } from "../../utils/Context/VendedorSelectedContext";
import HttpClient from "../../Services/httpService";

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
  const { VendedorSelectedContext } = useVendedorContext();

  const [Base, setBase] = useState<number>(0);
  const [BaseCapital, setBaseCapital] = useState<number>(0);

  const getAbonosyRetiros = async (VendedorId: number) => {
    setIsLoading(true);
    Promise.all([
      await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/abonos/${VendedorId}`
      ),
      await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/retiros/${VendedorId}`
      ),
      await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/abonos/bases/${VendedorId}`
      ),
    ])
      .then(([abonosRes, retirosRes, res]) => {
        const combinedData = [
          ...abonosRes.data.abonos,
          ...retirosRes.data.retiros,
        ];

        setBase(res.data.BaseVendedor);
        setBaseCapital(res.data.BaseCapital);
        setRetiros(combinedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getVendedores = async () => {
    try {
      const res = await HttpClient.get(
        `${import.meta.env.VITE_API_URL}/api/vendedores/${
          decodeToken()?.user?.Id
        }/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSellers(res.data);
      if (VendedorSelectedContext) {
        setSelectedSeller(VendedorSelectedContext);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getVendedores();
    if (VendedorSelectedContext) {
      getAbonosyRetiros(VendedorSelectedContext);
      return;
    }
    getAbonosyRetiros(Number(selectedSeller));
  }, []);

  const handleVendedorChange = async (selectedOption: any) => {
    setIsLoading(true);
    setSelectedSeller(selectedOption.value);
    await getAbonosyRetiros(Number(selectedOption.value));
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
            <h1 className="text-2xl text-primary md:text-4xl lg:text-6xl text-start md:text-center p-2 w-full">
              Abonos y Retiros
            </h1>
            <button
              className="mx-4 text-primary"
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
              value={vendedoresOptions.find(
                (option) => option.value === selectedSeller
              )}
            />
          </div>
          <div className="flex flex-col w-full items-center justify-center">
            {isLoading ? (
              <div className="w-full flex items-center justify-center m-4">
                <Spinner isLoading={isLoading} />
              </div>
            ) : (
              <>
                <h3>
                  <span className="font-bold text-3xl text-secondary">
                    Base Capital:
                  </span>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(BaseCapital || 0)}
                </h3>
                <h2 className="text-center text-2xl py-4 font-semibold">
                  <span className="font-bold text-3xl text-secondary">
                    Base Vendedor:
                  </span>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(Base || 0)}
                </h2>
              </>
            )}
          </div>
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
                      <section className="w-full p-2 flex items-center justify-center rounded-md bg-primary text-white">
                        <span>
                          <h1 className="font-normal text-2xl py-2">
                            {retiro?.NombreVendedor?.split(" ")
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
                          <SellIcon className="text-secondary" />
                          <span
                            className={`mx-4 font-bold ${
                              retiro.Tipo === "Retiro"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            <h3 className="font-bold text-xl text-secondary">
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
                          <DescriptionIcon className="text-secondary" />
                          <span className="mx-4">
                            <h3 className="font-bold text-xl text-secondary">
                              Descripcion:
                            </h3>
                            <p className="overflow-ellipsis overflow-hidden w-40 md:w-full">
                              {retiro.Descripcion}
                            </p>
                          </span>
                        </li>
                        <li className="flex items-center my-1">
                          <AttachMoney className="text-secondary" />
                          <span className="mx-4">
                            <h3 className="font-bold text-xl text-secondary">
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
