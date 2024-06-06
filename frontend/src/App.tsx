import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./App.css";
import Clientes from "./components/clientes/Clientes";
import Ventas from "./components/Ventas";
import Vendedores from "./components/vendedores/Vendedores";
import ProtectedRoute from "./components/routes/protectedRoutes";
import ClientesAprobar from "./components/clientes/clientesAprobar";
import Perfil from "./components/perfil";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          }
          />
        <Route
          path="/vendedores"
          element={
            <ProtectedRoute>
              <Vendedores />
            </ProtectedRoute>
          }
          />
        <Route
          path="/clientes/aprobar"
          element={
            <ProtectedRoute>
              <ClientesAprobar />
            </ProtectedRoute>
          }
          />
          <Route 
          path="/perfil"
          element={<Perfil/>}/>
          <Route 
          path="/ventas/:id"
          element={<Ventas/>}
          />
      </Routes>
    </>
  );
}

export default App;
