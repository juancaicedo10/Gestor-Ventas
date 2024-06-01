import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Sidebar from './components/Sidebar';
import Clientes from './components/Clientes';

function App() {
  return (
    <>
    <Routes>
      <Route path="/home" Component={Home} />
      <Route path='/clientes' Component={Clientes} />
    </Routes>
    </>
  );
}

export default App;