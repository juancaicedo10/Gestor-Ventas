import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: number) => void;
  inputChange?: (value: string) => void;
}

const VentasFilter: React.FC<Props> = ({
  isOpen,
  onClose,
  onChange,
  inputChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    if (inputChange) {
      inputChange(searchValue);
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      setSelectedOption(undefined);
    };
  }, [!isOpen]);

  const handleButtonClick = (option: string) => {
    setSelectedOption(selectedOption === option ? undefined : option);

    switch (option) {
      case "Vencidas":
        onChange(1);
        break;
      case "Proximas":
        onChange(2);
        break;
      case "Por Vencer":
        onChange(3);
        break;
      case "Alerta":
        onChange(4);
        break;
      case "Al Corriente":
        onChange(5);
        break;
    }

    onClose();
  };

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
            className={`flex items-center justify-center p-2 text-3xl text-blue-800 font-extrabold`}
            onClick={onClose}
          >
            <CloseIcon fontSize="large" className="relative left-0" />
          </button>
          <h2 className="font-bold text-blue-800 p-2 w-full text-center my-auto text-3xl">
            Filtrar Ventas
          </h2>
        </div>
      </header>
      <section>
        <div className="w-full flex items-center flex-col">
          <section className="w-3/4 py-1 min-h-[40vh] flex flex-col items-center justify-between">
            <button
              className={`w-full py-2 text-white font-bold text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                selectedOption === "Vencidas" ? "bg-yellow-700" : "bg-[#c98b54]"
              }`}
              onClick={() => handleButtonClick("Vencidas")}
            >
              Vencidas
            </button>
            <button
              className={`w-full py-2 text-white font-bold text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                selectedOption === "Proximas" ? "bg-green-700" : "bg-green-500"
              }`}
              onClick={() => handleButtonClick("Proximas")}
            >
              Proximas
            </button>
            <button
              className={`w-full py-2 text-white font-bold text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                selectedOption === "Por Vencer"
                  ? "bg-yellow-700"
                  : "bg-yellow-500"
              }`}
              onClick={() => handleButtonClick("Por Vencer")}
            >
              Por Vencer
            </button>
            <button
              className={`w-full py-2 text-white font-bold text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                selectedOption === "Alerta" ? "bg-red-700" : "bg-red-500"
              }`}
              onClick={() => handleButtonClick("Alerta")}
            >
              Alerta
            </button>
            <button
              className={`w-full py-2 text-white font-bold text-3xl rounded-md transition-transform transform hover:scale-105 active:scale-95 active:shadow-inner ${
                selectedOption === "Al Corriente"
                  ? "bg-purple-700"
                  : "bg-purple-500"
              }`}
              onClick={() => handleButtonClick("Al Corriente")}
            >
              Al Corriente
            </button>
          </section>
          <section className="w-3/4 py-1 flex items-center justify-between mt-5">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Buscar..."
              className="w-3/4 py-2 px-4 border"
            />
            <button
              onClick={handleSearchClick}
              className="w-1/4 py-2 text-white font-semibold text-xl rounded-r-md bg-blue-800 hover:bg-blue-900 transition-colors"
            >
              Buscar
            </button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default VentasFilter;
