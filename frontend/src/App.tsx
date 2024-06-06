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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
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
          <Route 
          path="/perfil"
          element={<Perfil/>}/>
          <Route 
          path="/ventas/vendedor/:id"
          element={<VentasByVendedor/>}
          />
      </Routes>
    </>
  );
}

export default App;
