import { ReactNode } from "react";

export enum TipoSeguimientoId {
  VENTA = 1,
  ABONO = 2,
  GASTO = 3,
  ABONO_BASE_CAPITAL = 4,
  RETIRO_BASE_CAPITAL = 5,
  TRASLADO_RUTA = 6,
  ABONO_BASE_VENDEDOR = 7,
  RETIRO_BASE_VENDEDOR = 8,
}

export interface MovimientoSeguimiento {
  TipoId: number | string;
  Valor: number;
  ValorSeguro?: number;
  ValorInteres?: number;
  ValorMulta?: number;
  ValorCuota?: number;
  NombreCliente?: string;
  NombreGasto?: string;
  NumeroVenta?: string;
  Detalle?: string;
  NombreAdmin?: string | null;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

const normalizeTipoId = (tipoId: number | string | undefined) =>
  Number(tipoId ?? 0);

type RenderHandlers = {
  onVentaClick?: () => void;
  onCuotaClick?: () => void;
};

function renderDetalleYAdmin(movimiento: MovimientoSeguimiento) {
  const detalle = movimiento.Detalle?.trim();

  return (
    <>
      <br />
      <span className="font-semibold mr-1 text-quaternary">Detalle:</span>
      {detalle || "—"}
      {movimiento.NombreAdmin ? (
        <>
          <br />
          <span className="font-semibold mr-1 text-quaternary">
            Administrador:
          </span>
          <span className="font-semibold text-secondary">
            {movimiento.NombreAdmin}
          </span>
        </>
      ) : null}
    </>
  );
}

export function renderMovimientoSeguimiento(
  movimiento: MovimientoSeguimiento,
  handlers: RenderHandlers = {}
): ReactNode {
  const { onVentaClick, onCuotaClick } = handlers;
  const tipoId = normalizeTipoId(movimiento.TipoId);

  switch (tipoId) {
    case TipoSeguimientoId.ABONO_BASE_CAPITAL:
      return (
        <>
          Se registró un abono a base capital por un valor de{" "}
          <span className="font-semibold text-green-700">
            {formatMoney(movimiento.Valor)}
          </span>
          {renderDetalleYAdmin(movimiento)}
        </>
      );

    case TipoSeguimientoId.RETIRO_BASE_CAPITAL:
      return (
        <>
          Se registró un retiro de base capital por un valor de{" "}
          <span className="font-semibold text-red-600">
            {formatMoney(movimiento.Valor)}
          </span>
          {renderDetalleYAdmin(movimiento)}
        </>
      );

    case TipoSeguimientoId.ABONO_BASE_VENDEDOR:
      return (
        <>
          Se registró un abono a base vendedor por un valor de{" "}
          <span className="font-semibold text-green-700">
            {formatMoney(movimiento.Valor)}
          </span>
          {renderDetalleYAdmin(movimiento)}
        </>
      );

    case TipoSeguimientoId.RETIRO_BASE_VENDEDOR:
      return (
        <>
          Se registró un retiro de base vendedor por un valor de{" "}
          <span className="font-semibold text-red-600">
            {formatMoney(movimiento.Valor)}
          </span>
          {renderDetalleYAdmin(movimiento)}
        </>
      );

    case TipoSeguimientoId.TRASLADO_RUTA:
      return (
        <>
          traslado de ruta registrado
          {renderDetalleYAdmin(movimiento)}
        </>
      );

    default:
      return <>movimiento registrado</>;
  }
}

export function movimientoEsAjusteBase(tipoId: number | string) {
  const id = normalizeTipoId(tipoId);
  return (
    id === TipoSeguimientoId.ABONO_BASE_CAPITAL ||
    id === TipoSeguimientoId.RETIRO_BASE_CAPITAL ||
    id === TipoSeguimientoId.ABONO_BASE_VENDEDOR ||
    id === TipoSeguimientoId.RETIRO_BASE_VENDEDOR
  );
}
