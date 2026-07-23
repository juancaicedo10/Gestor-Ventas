import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BlockIcon from "@mui/icons-material/Block";
import HomeIcon from "@mui/icons-material/Home";
import { MENU_MODULOS, ModuloCodigo } from "../constants/modulos";
import { getDefaultAccessibleRoute } from "../utils/permissions";

interface AccesoDenegadoState {
  modulo?: ModuloCodigo;
  from?: string;
}

export default function AccesoDenegado() {
  const location = useLocation();
  const state = (location.state as AccesoDenegadoState) || {};
  const moduloLabel =
    MENU_MODULOS.find((modulo) => modulo.codigo === state.modulo)?.label ||
    "esta seccion";
  const defaultRoute = getDefaultAccessibleRoute();

  return (
    <section className="w-full min-h-screen overflow-y-hidden">
      <Sidebar />
      <div className="flex flex-col items-center justify-center min-h-screen ml-[64px] px-4 py-8 bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-md border p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <BlockIcon className="text-red-500" sx={{ fontSize: 48 }} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">
            Acceso denegado
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-2">
            No tienes permiso para acceder a{" "}
            <span className="font-semibold text-gray-800">{moduloLabel}</span>.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Si crees que deberias tener acceso, contacta a la administradora
            general del sistema.
          </p>
          <Link
            to={defaultRoute}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-tertiary transition-colors"
          >
            <HomeIcon fontSize="small" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
