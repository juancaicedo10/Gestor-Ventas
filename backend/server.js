const express = require('express');
const connectToDB  = require('./config/connectionDB.js');
const vendedoresRoutes = require('./routes/vendedoresRoutes.js');
const clientesRoutes = require('./routes/clientesRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js');
const ventasRoutes = require('./routes/ventasRoutes.js');
const cors = require('cors');

const app = express();
app.use(cors());

connectToDB();

app.use(express.json());




app.get('/', (req, res) => {
    res.send('API is running...');
})

app.get('/test-db', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT 1 AS number');
      res.status(200).send(result.recordset);
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).send('Database connection error');
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/login', loginRoutes)
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);