import { useEffect, useState } from "react";
import Select from "react-select";
import HttpClient from "../../Services/httpService";
import { toast } from "react-toastify";

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
  const [monto, setMonto] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string | undefined>("");
  const [isMontoValid, setIsMontoValid] = useState<boolean>(false);
  const [isTipoValid, setIsTipoValid] = useState<boolean>(false);
  const [fechaPago, setFechaPago] = useState<Date>(new Date());

  const [isSendButtonLoading, setIsSendButtonLoading] =
    useState<boolean>(false);

  const getEndpointUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL;

    switch (selectedTipo) {
      case "Multa":
        return `${baseUrl}/api/cuotas/cuota/mora/${cuotaId}`;
      case "Interes":
        return `${baseUrl}/api/cuotas/cuota/interes/${cuotaId}`;
      case "Reagenda":
        return `${baseUrl}/api/cuotas/cuota/reagenda/${cuotaId}`;
      case "Reagenda Todas":
        return `${baseUrl}/api/cuotas/cuota/reagenda/todas/${cuotaId}`;
      default:
        throw new Error("Tipo no válido");
    }
  };

  // Extraer el título a una función
  const getModalTitle = () => {
    switch (selectedTipo) {
      case "Multa":
        return "Registrar Multa";
      case "Interes":
        return "Registrar Interés";
      case "Reagenda":
        return "Reagendar Fecha de Pago";
      case "Reagenda Todas":
        return "Reagendar Restantes";
      default:
        return "Seleccione una operación";
    }
  };

  const verifyReagendaIsValid = (e: any) => {
   setFechaPago(new Date(e.target.value));
  };

  const Tipos = [
    {
      value: "Multa",
      label: "Multa",
    },
    {
      value: "Interes",
      label: "Interes",
    },
    {
      value: "Reagenda",
      label: "Reagendar",
    },
    {
      value: "Reagenda Todas",
      label: "Reagendar Restantés",
    },
  ];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSendButtonLoading(true);

    let isValid = true;

    if (
      !monto &&
      !(selectedTipo === "Reagenda" || selectedTipo === "Reagenda Todas")
    ) {
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
      FechaPago: fechaPago,
    };

    let url: string = getEndpointUrl();

    HttpClient.post(url, AbonoRetiro, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
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
      setMonto("");
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
                    {getModalTitle()}
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
                  <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                    <label htmlFor="tipo">Tipo: </label>
                    <Select
                      options={TiposOptions}
                      onChange={(e) => handleSelectTipo(e?.value)}
                      isSearchable={true}
                      placeholder="Seleccione un tipo"
                      className="w-full"
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                    {!isTipoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  {selectedTipo === "Reagenda" ||
                  selectedTipo == "Reagenda Todas" ? (
                    <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                      <label htmlFor="numero cuotas">Fecha de Reajuste:</label>
                      <input
                        type="date"
                        className={`p-2 rounded-md border w-full text-sm ${
                          !fechaPago ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          verifyReagendaIsValid(e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="block text-base md:text-lg font-normal mb-2 text-gray-700">
                      <label htmlFor="numero cuotas">Valor:</label>
                      <input
                        type="number"
                        className={`p-2 rounded-md border w-full text-sm ${
                          !isMontoValid ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          let value = (e.target.value = e.target.value.replace(
                            /[^.0-9]/g,
                            ""
                          ));
                          setMonto(value);
                        }}
                      />
                      {!isMontoValid && (
                        <p className="text-red-500 text-xs">
                          Este campo es obligatorio
                        </p>
                      )}
                    </div>
                  )}
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
                    `Registrar ${selectedTipo || ""}`
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
