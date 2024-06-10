import Sidebar from "./Sidebar";

function PanelAdministracion() {
  return (
    <div>
      <Sidebar />
      <div className="ml-[64px]">
        <h1>Bienvenido al panel de administracion</h1>
        <div>Ventas</div>
        <div>Cuotas</div>
        <div>Clientes por aprobar </div>
        <div>Ventas por aprobar</div>
      </div>
    </div>
  );
}

export default PanelAdministracion;
