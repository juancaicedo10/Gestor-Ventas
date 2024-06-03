import  express  from 'express';
import { connectToDB } from './config/connectionDB.js';
import vendedoresRoutes from './routes/VendedoresRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';
import cors from 'cors';

const app = express();
app.use(cors());

connectToDB();

app.use(express.json());




app.get('/', (req, res) => {
    res.send('API is running...');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/login', loginRoutes)
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);