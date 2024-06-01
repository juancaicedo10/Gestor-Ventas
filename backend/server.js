import  express  from 'express';
import { connectToDB } from './config/connectionDB.js';
import clientesRoutes from './routes/clientesRoutes.js';

const app = express();

connectToDB();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/api/clientes', clientesRoutes);