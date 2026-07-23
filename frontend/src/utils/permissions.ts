import decodeToken from "./tokenDecored";
import { MENU_MODULOS, MODULOS, ModuloCodigo } from "../constants/modulos";

const VENDOR_MODULES: ModuloCodigo[] = [
  MODULOS.CLIENTES,
  MODULOS.VENTAS,
  MODULOS.GASTOS,
];

export function getAuthUser() {
  return decodeToken()?.user as
    | {
        role?: string;
        permisos?: string[];
        esSuperAdmin?: boolean;
      }
    | undefined;
}

export function isSuperAdmin() {
  const user = getAuthUser();
  return user?.role === "Administrador" && !!user?.esSuperAdmin;
}

export function hasPermiso(codigo: ModuloCodigo) {
  const user = getAuthUser();

  if (!user?.role) {
    return false;
  }

  if (user.role === "Vendedor") {
    return VENDOR_MODULES.includes(codigo);
  }

  if (user.role === "Administrador") {
    if (user.esSuperAdmin) {
      return true;
    }

    return (user.permisos || []).includes(codigo);
  }

  return false;
}

export function canManageAdministradores() {
  return isSuperAdmin();
}

export function getDefaultAccessibleRoute() {
  const firstModule = MENU_MODULOS.find((modulo) => hasPermiso(modulo.codigo));
  return firstModule?.ruta || "/perfil";
}
