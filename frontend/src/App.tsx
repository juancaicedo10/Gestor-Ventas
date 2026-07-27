import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Clientes from "./components/clientes/Clientes";
import Ventas from "./components/Ventas/Ventas";
import Vendedores from "./components/vendedores/Vendedores";
import { PermisoRoute, PrivateRoute } from "./components/routes/protectedRoutes";
import ClientesAprobar from "./components/clientes/clientesAprobar";
import Perfil from "./components/perfil";
import Cuotas from "./components/Ventas/Cuotas";
import Retiros from "./components/Abonos-Retiros/AbonosyRetiros";
import Liquidaciones from "./components/Liquidaciones/Liquidaciones";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Administradores from "./components/Administradores/Administradores";
import VentasByCliente from "./components/Ventas/VentasByCliente";
import VentasByVendedor from "./components/Ventas/VentasByVendedor";
import VentasAprobar from "./components/Ventas/ventasAprobar";
import ConfigTopesVentas from "./components/Ventas/ConfigTopesVentas";
import GastosAprobar from "./components/Gastos/GastosAprobar";
import Gastos from "./components/Gastos/Gastos";
import { useEffect } from "react";
import {
  startInactivityMonitoring,
  stopInactivityMonitoring,
} from "./Services/InactivityService";
import { SessionService } from "./Services/SessionService";
import ViewDevices from "./components/Devices/ViewDevices";
import AccesoDenegado from "./components/AccesoDenegado";
import { MODULOS } from "./constants/modulos";

function App() {
  useEffect(() => {
    SessionService.init();

    const sub = SessionService.token$.subscribe((token) => {
      if (token) {
        startInactivityMonitoring();
      } else {
        stopInactivityMonitoring();
      }
    });

    return () => {
      sub.unsubscribe();
      stopInactivityMonitoring();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/clientes"
          element={
            <PermisoRoute modulo={MODULOS.CLIENTES}>
              <Clientes />
            </PermisoRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <Ventas />
            </PermisoRoute>
          }
        />
        <Route
          path="/ventas/:id"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <Ventas />
            </PermisoRoute>
          }
        />
        <Route
          path="/vendedores"
          element={
            <PermisoRoute modulo={MODULOS.VENDEDORES}>
              <Vendedores />
            </PermisoRoute>
          }
        />
        <Route
          path="/clientes/aprobar"
          element={
            <PermisoRoute modulo={MODULOS.CLIENTES_APROBAR}>
              <ClientesAprobar />
            </PermisoRoute>
          }
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route
          path="/acceso-denegado"
          element={
            <PrivateRoute>
              <AccesoDenegado />
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas/vendedor/:id"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <VentasByVendedor />
            </PermisoRoute>
          }
        />
        <Route
          path="/ventas/cliente/:id"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <VentasByCliente />
            </PermisoRoute>
          }
        />
        <Route
          path="/cuotas/:id/:numeroVenta/:archivada"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <Cuotas />
            </PermisoRoute>
          }
        />
        <Route
          path="/ventas/topes"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS}>
              <ConfigTopesVentas />
            </PermisoRoute>
          }
        />
        <Route
          path="/ventas/aprobar"
          element={
            <PermisoRoute modulo={MODULOS.VENTAS_APROBAR}>
              <VentasAprobar />
            </PermisoRoute>
          }
        />
        <Route
          path="/gastos/aprobar"
          element={
            <PermisoRoute modulo={MODULOS.GASTOS_APROBAR}>
              <GastosAprobar />
            </PermisoRoute>
          }
        />
        <Route
          path="/gastos"
          element={
            <PermisoRoute modulo={MODULOS.GASTOS}>
              <Gastos />
            </PermisoRoute>
          }
        />
        <Route
          path="/abonos-retiros"
          element={
            <PermisoRoute modulo={MODULOS.ABONOS_RETIROS}>
              <Retiros />
            </PermisoRoute>
          }
        />
        <Route
          path="/liquidaciones"
          element={
            <PermisoRoute modulo={MODULOS.LIQUIDACIONES}>
              <Liquidaciones />
            </PermisoRoute>
          }
        />
        <Route
          path="/dispositivos"
          element={
            <PermisoRoute modulo={MODULOS.DISPOSITIVOS}>
              <ViewDevices />
            </PermisoRoute>
          }
        />
        <Route
          path="/administradores"
          element={
            <PermisoRoute modulo={MODULOS.ADMINISTRADORES}>
              <Administradores />
            </PermisoRoute>
          }
        />
      </Routes>
      <ToastContainer autoClose={1000} />
    </>
  );
}

export default App;
