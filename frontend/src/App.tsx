import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Clientes from "./components/clientes/Clientes";
import Ventas from "./components/Ventas";
import Vendedores from "./components/vendedores/Vendedores";
import { PrivateRoute } from "./components/routes/protectedRoutes";
import ClientesAprobar from "./components/clientes/clientesAprobar";
import Perfil from "./components/perfil";
import VentasByVendedor from "./components/VentasByVendedor";
import Cuotas from "../src/components/Cuotas";
import VentasAprobar from "./components/ventasAprobar";
import Gastos from "./components/Gastos";
import Retiros from "./components/Abonos-Retiros/AbonosyRetiros";
import Liquidaciones from "./components/Liquidaciones/Liquidaciones";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GastosAprobar from "./components/GastosAprobar";

function App() {
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
        <Route
          path="/cuotas/:id/:numeroVenta"
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
      </Routes>
      <ToastContainer
        autoClose={1000}
      />
    </>
  );
}

export default App;
