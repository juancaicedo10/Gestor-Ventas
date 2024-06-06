import { useEffect } from "react";
import decodeToken from "../utils/tokenDecored"
import axios from "axios";


function VentasByVendedor() {

  interface Venta {
    Id: number;
    ClienteId: number;
    VendedorId: number;
    FechaInicio: string;
    FechaFin: string;
    NumeroCuotas: number;
    NumeroVenta: string;
    SaldoMoraTotal: number;
    DetallesVenta: string;
    TotalVenta: number;
    Vendedor: string;
    PeriodicidadId: number;
  }

    const Vendedor = decodeToken().user;
    const [ventas, setVentas] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/ventas/vendedor/${Vendedor.ID}`)
        .then(res => setVentas(res.data))
        .catch(err => console.log(err))
    }, [])
    return (

    <div>
      
    </div>
  )
}

export default VentasByVendedor
