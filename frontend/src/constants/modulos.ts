export const MODULOS = {
  VENDEDORES: "VENDEDORES",
  CLIENTES: "CLIENTES",
  VENTAS: "VENTAS",
  GASTOS: "GASTOS",
  ADMINISTRADORES: "ADMINISTRADORES",
  ABONOS_RETIROS: "ABONOS_RETIROS",
  CLIENTES_APROBAR: "CLIENTES_APROBAR",
  GASTOS_APROBAR: "GASTOS_APROBAR",
  DISPOSITIVOS: "DISPOSITIVOS",
  VENTAS_APROBAR: "VENTAS_APROBAR",
  LIQUIDACIONES: "LIQUIDACIONES",
} as const;

export type ModuloCodigo = (typeof MODULOS)[keyof typeof MODULOS];

export interface ModuloMenuItem {
  codigo: ModuloCodigo;
  label: string;
  ruta: string;
}

export const MENU_MODULOS: ModuloMenuItem[] = [
  { codigo: MODULOS.VENDEDORES, label: "Vendedores", ruta: "/vendedores" },
  { codigo: MODULOS.CLIENTES, label: "Clientes", ruta: "/clientes" },
  { codigo: MODULOS.VENTAS, label: "Ventas", ruta: "/ventas" },
  { codigo: MODULOS.GASTOS, label: "Gastos", ruta: "/gastos" },
  {
    codigo: MODULOS.ADMINISTRADORES,
    label: "Administradores",
    ruta: "/administradores",
  },
  {
    codigo: MODULOS.ABONOS_RETIROS,
    label: "Abonos y Retiros",
    ruta: "/abonos-retiros",
  },
  {
    codigo: MODULOS.CLIENTES_APROBAR,
    label: "Clientes por aprobar",
    ruta: "/clientes/aprobar",
  },
  {
    codigo: MODULOS.GASTOS_APROBAR,
    label: "Gastos por aprobar",
    ruta: "/gastos/aprobar",
  },
  { codigo: MODULOS.DISPOSITIVOS, label: "Dispositivos", ruta: "/dispositivos" },
  {
    codigo: MODULOS.VENTAS_APROBAR,
    label: "Ventas por aprobar",
    ruta: "/ventas/aprobar",
  },
  {
    codigo: MODULOS.LIQUIDACIONES,
    label: "Liquidaciones",
    ruta: "/liquidaciones",
  },
];

export const RUTA_MODULO_MAP: Record<string, ModuloCodigo> = {
  "/vendedores": MODULOS.VENDEDORES,
  "/clientes": MODULOS.CLIENTES,
  "/clientes/aprobar": MODULOS.CLIENTES_APROBAR,
  "/ventas": MODULOS.VENTAS,
  "/ventas/aprobar": MODULOS.VENTAS_APROBAR,
  "/gastos": MODULOS.GASTOS,
  "/gastos/aprobar": MODULOS.GASTOS_APROBAR,
  "/administradores": MODULOS.ADMINISTRADORES,
  "/abonos-retiros": MODULOS.ABONOS_RETIROS,
  "/dispositivos": MODULOS.DISPOSITIVOS,
  "/liquidaciones": MODULOS.LIQUIDACIONES,
};
