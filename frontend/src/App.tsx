import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Clientes from './components/clientes/Clientes';
import Ventas from './components/Ventas';
import Vendedores from './components/vendedores/Vendedores';
import clientesAprobar from './components/clientes/clientesAprobar';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" Component={Home} />
      <Route path='/clientes' Component={Clientes} />
      <Route path='/clientes/aprobar' Component={clientesAprobar}/>
      <Route path='/vendedores' Component={Vendedores}/>
      <Route path='/ventas' Component={Ventas}/>
    </Routes>
    </>
  );
}

export default App;