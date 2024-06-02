import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Sidebar from './components/Sidebar';
import Clientes from './components/clientes/Clientes';
import Ventas from './components/Ventas';
import CrearCliente from './components/clientes/CrearCliente';

function App() {
  return (
    <>
    <Routes>
      <Route path="/home" Component={Home} />
      <Route path='/clientes' Component={Clientes} />
      <Route path='/ventas' Component={Ventas}/>
      <Route path='/crear-cliente' Component={CrearCliente}/>
    </Routes>
    </>
  );
}

export default App;