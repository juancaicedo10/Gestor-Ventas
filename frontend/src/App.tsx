import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Clientes from "./components/clientes/Clientes";
import Ventas from "./components/Ventas/Ventas";
import Vendedores from "./components/vendedores/Vendedores";
import { PrivateRoute } from "./components/routes/protectedRoutes";
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
import GastosAprobar from "./components/Gastos/GastosAprobar";
import Gastos from "./components/Gastos/Gastos";
import { useEffect } from "react";
import {
  startInactivityMonitoring,
  stopInactivityMonitoring,
} from "./Services/InactivityService";
import { SessionService } from "./Services/SessionService";

function App() {
  useEffect(() => {
    SessionService.init(); // para el canal de comunicación

    const sub = SessionService.token$.subscribe((token) => {
      if (token) {
        startInactivityMonitoring();
      } else {
        stopInactivityMonitoring();
      }
    });

    return () => {
      sub.unsubscribe();
      stopInactivityMonitoring(); // limpieza
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <PrivateRoute>
              <Ventas />
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas/:id"
          element={
            <PrivateRoute>
              <Ventas />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendedores"
          element={
            <PrivateRoute>
              <Vendedores />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/aprobar"
          element={
            <PrivateRoute>
              <ClientesAprobar />
            </PrivateRoute>
          }
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/ventas/vendedor/:id" element={<VentasByVendedor />} />
        <Route path="/ventas/cliente/:id" element={<VentasByCliente />} />
        <Route
          path="/cuotas/:id/:numeroVenta/:archivada"
          element={
            <PrivateRoute>
              <Cuotas />
            </PrivateRoute>
          }
        />
        <Route
          path="/ventas/aprobar"
          element={
            <PrivateRoute>
              <VentasAprobar />
            </PrivateRoute>
          }
        />
        <Route
          path="/gastos/aprobar"
          element={
            <PrivateRoute>
              <GastosAprobar />
            </PrivateRoute>
          }
        />
        <Route
          path="/gastos"
          element={
            <PrivateRoute>
              <Gastos />
            </PrivateRoute>
          }
        />

        <Route
          path="/abonos-retiros"
          element={
            <PrivateRoute>
              <Retiros />
            </PrivateRoute>
          }
        />

        <Route
          path="/liquidaciones"
          element={
            <PrivateRoute>
              <Liquidaciones />
            </PrivateRoute>
          }
        />
        <Route
          path="/administradores"
          element={
            <PrivateRoute>
              <Administradores />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer autoClose={1000} />
    </>
  );
}

export default App;
