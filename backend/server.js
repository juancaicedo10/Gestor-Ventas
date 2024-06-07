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


const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use('/login', loginRoutes)
app.use('/api/vendedores', vendedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);