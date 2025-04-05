import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCuotas: () => void;
  getDataCuotas: () => void;
  cuotaId: number;
  abonoSelected?: any;
}

interface Cuota {
  Id: number;
  NumeroCuota: number;
  ValorCuota: number;
  FechaPago: string;
  Pagada: boolean;
}

const RegistrarAbonoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  getCuotas,
  getDataCuotas,
  cuotaId,
  abonoSelected,
}) => {
  const [valorAbono, setValorAbono] = useState<string>("");
  const [fechaPago, setFechaPago] = useState<string>("");
  const [detallesAbono, setDetallesAbono] = useState<string>("");
  const [saldoInteres, setSaldoInteres] = useState<string>("");
  const [saldoMora, setSaldoMora] = useState<string>("");
  const [cuota, setCuota] = useState<Cuota | null>(null);

  const [isSendButtonLoading, setIsSendButtonLoading] =
    useState<boolean>(false);

  const [isValorAbonoValid, setIsValorAbonoValid] = useState(true);
  const [isDetallesAbonoValid, setIsDetallesAbonoValid] = useState(true);
  const [date, setDate] = useState("");

  const registrarAbono = async (e: any) => {
    e.preventDefault();
    setIsSendButtonLoading(true);

    let esValido = true;

    if (!valorAbono) {
      setIsValorAbonoValid(false);
      esValido = false;
      console.log("valor abono invalido", esValido);
    }

    if (!detallesAbono) {
      setIsDetallesAbonoValid(false);
      esValido = false;
      console.log("detalles abono invalido", esValido);
    }

    if (!esValido) {
      setIsSendButtonLoading(false);
      return;
    }

    await axios
      .post(
        `
        ${import.meta.env.VITE_API_URL}/api/cuotas/cuota/abonar/${cuotaId}`,
        {
          ValorAbono: Number(valorAbono),
          FechaAbono: fechaPago,
          SaldoMora: Number(saldoMora) ?? 0,
          DetallesAbono: detallesAbono,
          SaldoInteres: Number(saldoInteres) ?? 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        console.log("CUOTA CREADA EXITOSAMENTE");
        setIsSendButtonLoading(false);
        onClose();
        getCuotas();
        getDataCuotas();
        toast.success("Abono registrado correctamente");
      })
      .catch((err) => {
        console.log(err);
        setIsSendButtonLoading(false);
      });
  };

  const getCuotaById = async () => {
    try {
      await axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/cuotas/cuota/${cuotaId}`
        )
        .then((response) => {
          setCuota(response.data);
          setFechaPago(
            new Date(response.data.FechaPago).toISOString().split("T")[0]
          );
        });
    } catch (error) {
      console.error("Error obteniendo cuota:", error);
    }
  };

  useEffect(() => {
    if (cuotaId !== 0) {
      getCuotaById();
      const today = new Date();
      const offset = today.getTimezoneOffset();
      const colombiaTime = new Date(today.getTime() - offset * 60 * 1000);
      const formattedDate = colombiaTime.toISOString().split("T")[0];
      setDate(formattedDate);
    }
  }, [cuotaId]);

  useEffect(() => {
    console.log("abonoSelected", abonoSelected);
    if (!isOpen) {
      setValorAbono("");
      setFechaPago("");
      setDetallesAbono("");
      setSaldoInteres("");
      setSaldoMora("");
      setIsValorAbonoValid(true);
      setIsDetallesAbonoValid(true);

      if (abonoSelected) {
        setValorAbono(abonoSelected.ValorAbono);
        setFechaPago(abonoSelected.FechaAbono);
        setDetallesAbono(abonoSelected.DetallesAbono);
        setSaldoInteres(abonoSelected.SaldoInteres);
        setSaldoMora(abonoSelected.SaldoMora);
      }
    }
  }, [isOpen]);

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
              onSubmit={registrarAbono}
            >
              {" "}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <header className="flex w-full items-center justify-between">
                  <h3
                    className="text-2xl leading-6 font-bold text-blue-900"
                    id="modal-title"
                  >
                    Registrar Abono <br />{" "}
                    <span className="text-blue-600 text-xl flex">
                      Cuota Numero:{" "}
                      <h5 className="mx-2 text-blue-800">
                        {cuota?.NumeroCuota}
                      </h5>
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-4xl text-gray-500 hover:text-gray-900"
                  >
                    &times;
                  </button>
                </header>
                <div className="mt-4 w-full mb-2"></div>
                <div className="mb-2">
                  <label htmlFor="">Valor Abono: </label>
                  <input
                    type="text"
                    className={`p-2 rounded-md border w-full ${
                      !isValorAbonoValid ? "border-red-500" : ""
                    }`}
                    placeholder="valor abono"
                    onChange={(e) => {
                      let value = (e.target.value = e.target.value.replace(
                        /[^.0-9]/g,
                        ""
                      ));
                      setValorAbono(value); // Almacena el valor como cadena
                      setIsValorAbonoValid(true);
                    }}
                    value={valorAbono} // Asegura que el valor del input se actualice correctamente
                  />
                  {!isValorAbonoValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="interes">Abono Interes: </label>
                  <input
                    type="text"
                    className={`p-2 rounded-md border w-full`}
                    placeholder="abono interes"
                    onChange={(e) => {
                      let value = (e.target.value = e.target.value.replace(
                        /[^.0-9]/g,
                        ""
                      ));
                      setSaldoInteres(value);
                    }}
                    value={saldoInteres}
                  />
                </div>
                <div>
                  <label htmlFor="mora">Abono Multas:</label>
                  <input
                    type="text"
                    className={`p-2 rounded-md border w-full`}
                    placeholder="abono multas"
                    onChange={(e) => {
                      let value = (e.target.value = e.target.value.replace(
                        /[^.0-9]/g,
                        ""
                      ));
                      setSaldoMora(value);
                    }}
                    value={saldoMora}
                  />
                </div>
                <div>
                  <label htmlFor="fecha">Fecha Pago:</label>
                  <input
                    type="date"
                    className={`p-2 rounded-md border w-full`}
                    value={date}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="detalle">Detalles Abono:</label>
                  <textarea
                    name=""
                    id=""
                    cols={10}
                    rows={4}
                    placeholder="detalles cuota"
                    className={`p-2 rounded-md border w-full ${
                      !isDetallesAbonoValid ? "border-red-500" : ""
                    }`}
                    style={{ resize: "none" }}
                    onChange={(e) => {
                      setDetallesAbono(e.target.value);
                      setIsDetallesAbonoValid(true);
                    }}
                  ></textarea>
                  {!isDetallesAbonoValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-900 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={isSendButtonLoading}
                >
                  {isSendButtonLoading ? (
                    <div
                      className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                      role="status"
                    ></div>
                  ) : (
                    "Registrar Abono"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarAbonoModal;
