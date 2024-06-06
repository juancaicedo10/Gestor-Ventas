import Sidebar from "./Sidebar";

function Cuotas() {
  const cuotas = [1, 2, 3, 4, 5];
  const valores = [100, 200, 300, 400, 500];
  const intereses = ["10%", "20%", "30%", "40%", "50%"];
  const fechas = ["1/01/22", "1/01/22", "1/01/22", "1/01/22", "1/01/22"];
  const pagos = ["Si", "Si", "Si", "No", "No", "No"];
  return (
    <div>
      <Sidebar />
      <div className="ml-[67px] px-2">
        <h1>Cuotas para la venta: Zapatos</h1>
        <table className="w-full border border-black">
          <thead>
            <tr className="border border-black">
              <th>Cuota</th>
              <th>Valor</th>
              <th>% Interes</th>
              <th>Fecha</th>
              <th>Abonado</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota, idx) => (
              <tr key={idx} className="border border-gray-400">
                <td className="text-center py-4">{cuota}</td>
                <td className="text-center">{valores[idx]}</td>
                <td className="text-center">{intereses[idx]}</td>
                <td className="text-center">{fechas[idx]}</td>
                <td className="text-center">
                  <span
                    className={` ${
                      pagos[idx] === "Si" ? "bg-green-200 text-green-500 px-2" : "bg-red-200 text-red-500 px-1"
                    }`}
                  >
                    {pagos[idx]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cuotas;
