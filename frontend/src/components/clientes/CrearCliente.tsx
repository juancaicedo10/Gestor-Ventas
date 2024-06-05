import SellIcon from "@mui/icons-material/Sell";
import Sidebar from "../Sidebar";

function CrearCliente() {
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="w-full h-dvh flex items-center justify-center">
        <section className="flex flex-col justify-center items-center w-full md:w-3/4 mx-2">
          <SellIcon fontSize="large" />
          <h1>Crear Vendedor</h1>
          <form action="post" className="">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              id="nombre"
              className="my-2 py-2 border-2 w-[90%]"
            />
            <label htmlFor="correo">Correo Electronico</label>
            <input
              type="email"
              name="correo"
              id="correo"
              className="my-2 py-2 border-2 w-[90%]"
            />
            <label htmlFor="documento">Numero de Documento</label>
            <input
              type="text"
              name="documento"
              id="documento"
              className="my-2 py-2 border-2 w-[90%]"
            />
            <label htmlFor="telefono">Telefono</label>
            <input
              type="tel"
              name="telefono"
              id="telefono"
              className="my-2 py-2 border-2 w-[90%]"
            />
            <button
              type="submit"
              className="bg-green-400 text-white font-bold py-2 px-4 rounded-lg"
            >
              Crear Vendedor
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CrearCliente;
