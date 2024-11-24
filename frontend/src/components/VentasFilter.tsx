import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Spinner from "../utils/Spinner";

interface Filtro {
  Id: number;
  Nombre: string;
  ColorTailwind: string;
  ColorHoverTailwind: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: number) => void;
  vendedorId: number | undefined;
  administradorId: number | undefined;
}

const VentasFilter: React.FC<Props> = ({ isOpen, onClose, onChange, vendedorId, administradorId }) => {
  const [filtros, setFiltros] = useState<Filtro[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Llama a la API para obtener los filtros de ventas
    const fetchFiltros = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://backendgestorventas.azurewebsites.net/api/filtros",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              vendedorId: vendedorId,
              administradorId: administradorId
            },
          }
        );
        await setFiltros(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los filtros:", error);
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchFiltros();
    }

    return () => {
      setSelectedOption(undefined);
    };
  }, [isOpen]);

  const handleButtonClick = (filtroId: number) => {
    setSelectedOption(selectedOption === filtroId ? undefined : filtroId);
    onChange(filtroId);
    onClose();
  };

  const backgroundColor = [
    "bg-yellow-700",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
  ];

  return (
    <div
      className={`z-50 fixed right-0 top-0 h-full bg-white transition-all duration-500 ease-in-out ${
        isOpen ? "w-3/4 md:w-1/3" : "w-0"
      }`}
      style={{ overflowY: "auto" }}
    >
      <header className="w-full bg-white py-2 shadow-md flex-col mb-3">
        <div className="w-full flex">
          <button
            className="flex items-center justify-center p-2 text-3xl text-blue-800 font-extrabold"
            onClick={onClose}
          >
            <CloseIcon fontSize="large" className="relative left-0" />
          </button>
          <h2 className="font-bold text-blue-800 p-2 w-full text-center my-auto text-xl md:text-2xl lg:text-3xl">
            Filtrar Ventas
          </h2>
        </div>
      </header>
      <section>
        <div className="w-full flex items-center flex-col">
          <section className="w-3/4 py-1 min-h-[40vh] flex flex-col items-center justify-between ">
            {isLoading ? (
              <section className="min-h-[100vh] flex justify-center items-center">
                <Spinner isLoading={isLoading} />
              </section>
            ) : (
              filtros.map((filtro) => (
                <button
                  key={filtro.Id}
                  className={`w-full py-2 text-white font-bold text-xl md:text-2xl lg:text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                    backgroundColor[filtro.Id - 1]
                  }`}
                  onClick={() => handleButtonClick(filtro.Id)}
                >
                  <h6 className="text-xl md:text-2xl lg:text-3xl py-2">
                    {filtro.Nombre}
                  </h6>
                </button>
              ))
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default VentasFilter;
