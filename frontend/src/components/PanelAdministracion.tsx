import Sidebar from "./Sidebar";

function PanelAdministracion() {
  return (
    <div>
      <Sidebar />
      <div className="ml-[64px]">
        <h1 className="w-full py-4 text-center font-bold text-2xl md:text-3xl lg:text-4xl bg-white text-blue-900 border-b shadow-md mb-3">Bienvenido al panel de administracion</h1>
        <div>
          <h3>Ganancias totales</h3>
          <p>$4.5000,34$</p>
        </div>
        <div>
          <h4>Clientes</h4>
          <p>56</p>
        </div>
        <div>Clientes por aprobar </div>
        <div>Ventas por aprobar</div>
      </div>
    </div>
  );
}

export default PanelAdministracion;
