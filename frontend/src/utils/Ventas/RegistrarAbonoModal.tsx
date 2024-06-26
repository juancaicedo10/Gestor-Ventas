import axios from "axios";
import { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  getCuotas: () => void;
  cuotaId: number;
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
  cuotaId,
}) => {

  const [isLoading, setIsLoading] = useState(true);

  const [valorAbono, setValorAbono] = useState<number>(0);
  const [numeroCuota, setNumeroCuota] = useState<number>(0);
  const [fechaPago, setFechaPago] = useState<string>("");
  const [detallesCuota, setDetallesCuota] = useState<string>("");
  const [saldoMora, setSaldoMora] = useState<number>(0);
  const [cuota, setCuota] = useState<Cuota | null>(null);

  const [isValorAbonoValid, setIsValorAbonoValid] = useState(true);
  const [isNumeroCuotasValid, setIsNumeroCuotasValid] = useState(true);
  const [isFechaPagoValid, setIsFechaPagoValid] = useState(true);
  const [isSaldoMoraValid, setIsSaldoMoraValid] = useState(true);
  const [isDetallesCuotaValid, setIsDetallesCuotaValid] = useState(true);


  console.log(isNumeroCuotasValid)
  console.log(setNumeroCuota)
  console.log(isLoading)

  const registrarAbono = async (e: any) => {
    e.preventDefault();

    let esValido = true;
    if (!valorAbono || valorAbono === 0) {
      setIsValorAbonoValid(false);
      esValido = false;
    }
    if (!numeroCuota || numeroCuota === 0) {
      setIsNumeroCuotasValid(false);
      esValido = false;
    }
    if (!fechaPago) {
      setIsFechaPagoValid(false);
      esValido = false;
    }

    if (!saldoMora) {
      setIsSaldoMoraValid(false);
      esValido = false;
    }

    if (!detallesCuota) {
      setIsDetallesCuotaValid(false);
      esValido = false;
    }

    if (!esValido) return;

    try {
      await axios
        .post(
          `https://backendgestorventas.azurewebsites.net/api/cuotas/abonar/${cuotaId}`,
          {
            VentaId: 1,
            ValorCuota: valorAbono,
            NumeroCuota: numeroCuota,
            FechaPago: fechaPago,
            Pagada: false,
            DetallesCuota: detallesCuota,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          console.log("CUOTA CREADA EXITOSAMENTE");
          getCuotas();
        });
    } catch (error) {
      console.error("Error creando cuota:", error);
    }
  };

  console.log(registrarAbono);

  const getCuotaById = async () => {
    setIsLoading(true);
    try {
      await axios
        .get(
          `https://backendgestorventas.azurewebsites.net/api/cuotas/cuota/${cuotaId}`
        )
        .then((response) => {
          setCuota(response.data);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error obteniendo cuota:", error);
      setIsLoading(false);
    }
  };

  console.log(cuota);

  useEffect(() => {
    if (cuotaId !== 0) {
      getCuotaById();
    }
  }, [cuotaId]);

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
                <section className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <label htmlFor="">Valor Abono: </label>
                    <input
                      type="number"
                      className={`p-2 rounded-md border w-full ${
                        !isValorAbonoValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setValorAbono(Number(e.target.value));
                        setIsValorAbonoValid(true);
                      }}
                    />
                      {!isValorAbonoValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="" className="">
                      Saldo Mora:{" "}
                    </label>
                    <input
                      type="number"
                      value={saldoMora}
                      className={`p-2 rounded-md border w-full ${
                        !isSaldoMoraValid ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setSaldoMora(Number(e.target.value));
                        setIsNumeroCuotasValid(true);
                      }}
                    />
                    {!isSaldoMoraValid && (
                      <p className="text-red-500 text-xs">
                        Este campo es obligatorio
                      </p>
                    )}
                  </div>
                </section>
                <div>
                  <label htmlFor="">Fecha Pago:</label>
                  <input
                    type="date"
                    className={`p-2 rounded-md border w-full ${
                      !isFechaPagoValid ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setFechaPago(e.target.value);
                      setIsFechaPagoValid(true);
                    }}
                  />
                  {!isFechaPagoValid && (
                    <p className="text-red-500 text-xs">
                      Este campo es obligatorio
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="">Detalles Cuota:</label>
                  <textarea
                    name=""
                    id=""
                    cols={10}
                    rows={4}
                    className={`p-2 rounded-md border w-full ${
                      !isDetallesCuotaValid ? "border-red-500" : ""
                    }`}
                    style={{ resize: "none" }}
                    onChange={(e) => {
                      setDetallesCuota(e.target.value);
                      setIsDetallesCuotaValid(true);
                    }}
                  ></textarea>
                  {!isDetallesCuotaValid && (
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
                >
                  Registrar Abono
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
