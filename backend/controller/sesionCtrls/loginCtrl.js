const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sql = require('mssql');

dotenv.config();

    const login = asyncHandler(async (req, res) => {
    // Get the username and password from the request body
    const { correo, contraseña } = req.body;

    const pool = await sql.connect()


    const Administrador = await pool.request()
    .input('correo', sql.VarChar, correo)
    .input('contraseña', sql.VarChar, contraseña)
    .query('SELECT * FROM Usuarios.Administradores WHERE CorreoElectronico = @correo AND Contraseña = @contraseña')

const vendedor = await pool.request()
    .input('correo', sql.VarChar, correo)
    .input('contraseña', sql.VarChar, contraseña)
    .query('SELECT * FROM Usuarios.Vendedores WHERE Correo = @correo AND Contraseña = @contraseña')

    if (Administrador.recordset.length > 0) {
        const token = jwt.sign({ user: Administrador.recordset[0], role: 'Administrador' }, process.env.SECRET_KEY)
        res.json({ token })
    }
    else if (vendedor.recordset.length > 0) {
        const token = jwt.sign({ user: vendedor.recordset[0], role: 'Vendedor'}, process.env.SECRET_KEY)
        res.json({ token })
    }
    console.log(process.env.SECRET_KEY);
    res.status(500).json({ message: 'Usuario no encontrado' })
})

module.exports = { login }