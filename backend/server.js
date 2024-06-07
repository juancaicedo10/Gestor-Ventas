const express = require('express');
const connectToDB  = require('./config/connectionDB.js');
const vendedoresRoutes = require('./routes/vendedoresRoutes.js');
const clientesRoutes = require('./routes/clientesRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');
const ventasRoutes = require('./routes/ventasRoutes.js');
const cors = require('cors');
const asyncHandler = require('express-async-handler');
const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());

connectToDB();

app.use(express.json());




app.get('/', (req, res) => {
    res.send('API is running...');
})

app.get


const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

app.get('/db',  asyncHandler(async(req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Usuarios.Vendedores');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error connecting to the database' , error: error.message});
    }
}))

app.use('/login', loginRoutes)
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);