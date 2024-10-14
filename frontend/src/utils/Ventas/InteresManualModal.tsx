import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCuotas: () => void;
  getDataCuotas: () => void;
  cuotaId: number;
}

const InteresManualModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getCuotas,
  cuotaId,
  getDataCuotas,
}) => {
  const [monto, setMonto] = useState<number>(0);
  const [selectedTipo, setSelectedTipo] = useState<string | undefined>("");
  const [isMontoValid, setIsMontoValid] = useState<boolean>(false);
  const [isTipoValid, setIsTipoValid] = useState<boolean>(false);
  const [optionSelected, setOptionSelected] = useState<string | undefined>(
    undefined
  );

  console.log(optionSelected, "");

  const [isSendButtonLoading, setIsSendButtonLoading] =
    useState<boolean>(false);

  console.log(isSendButtonLoading, "oe la buenq");

  const Tipos = [
    {
      value: "Multa",
      label: "Multa",
    },
    {
      value: "Interes",
      label: "Interes",
    },
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSendButtonLoading(true);

    let isValid = true;

    if (!monto) {
      isValid = false;
      setIsMontoValid(false);
    }

    if (!selectedTipo || selectedTipo === "") {
      isValid = false;
      setIsTipoValid(false);
    }

    if (!isValid) {
      setIsSendButtonLoading(false);
      return;
    }

    const AbonoRetiro = {
      Valor: monto,
    };

    let url =
      selectedTipo === "Multa"
        ? `https://backendgestorventas.azurewebsites.net/api/cuotas/cuota/mora/${cuotaId}`
        : `https://backendgestorventas.azurewebsites.net/api/cuotas/cuota/interes/${cuotaId}`;

    axios
      .post(url, AbonoRetiro, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        console.log("Venta CREADA EXITOSAMENTE");
        setIsSendButtonLoading(false);
        onClose();
        getCuotas();
        getDataCuotas();
      })
      .catch((err) => {
        console.log(err);
        setIsSendButtonLoading(false);
        onClose();
      });
  };

  useEffect(() => {
    if (!isOpen) {
      setMonto(0);
      setIsMontoValid(true);
      setSelectedTipo("");
      setIsTipoValid(true);
      setIsSendButtonLoading(false);
    }
  }, [isOpen]);

  const TiposOptions = Tipos.map((seller) => ({
    value: seller.value,
    label: seller.label,
  }));

  const handleSelectTipo = (TipoId: string | undefined) => {
    if (TipoId !== null) {
      setIsTipoValid(true);
      setSelectedTipo(TipoId);
      if (TipoId === "Abono") {
        setOptionSelected("abonos");
      } else if (TipoId === "Retiro") {
        setOptionSelected("retiros");
      } else if (TipoId === "Abono a Base Capital") {
        setOptionSelected("abonos/capital");
      } else if (TipoId === "Retiro a Base Capital") {
        setOptionSelected("retiros/capital");
      }
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <form
              action="submit"
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onSubmit={handleSubmit}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-3xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Registrar {selectedTipo || ""} Manual
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mb-2">
                  <div className="block text-base md:text-lg font-normal mb-8 text-gray-700">
                    <label htmlFor="tipo">Tipo: </label>
                    <Select
                      options={TiposOptions}
                      onChange={(e) => handleSelectTipo(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un tipo"
                      className="w-full"
                    />
                    {!isTipoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="numero cuotas">Valor:</label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full text-sm ${
                        !isMontoValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setIsMontoValid(true);
                        setMonto(Number(e.target.value));
                      }}
                    />
                    {!isMontoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm min-w-14"
                  disabled={isSendButtonLoading}
                >
                  {isSendButtonLoading ? (
                    <div
                      className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    ></div>
                  ) : (
                    `Registar ${selectedTipo || ""}`
                  )}{" "}
                  {/* Agregado un fallback para evitar [object Object] */}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteresManualModal;
