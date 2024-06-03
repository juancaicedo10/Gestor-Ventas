import express from 'express';
import sql from 'mssql';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

router.post('/', asyncHandler(async (req, res) => {
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

    console.log(vendedor, "vendedor")

    console.log(vendedor.recordset)

    if (Administrador.recordset.length > 0) {
        const token = jwt.sign({ user: Administrador[0], role: 'Administrador' }, 'your-secret-key')
        res.json({ token })
    }
    else if (vendedor.recordset.length > 0) {
        const token = jwt.sign({ user: vendedor[0], role: 'Vendedor'}, 'your-secret-key')
        res.json({ token })
    }

    res.status(500).json({ message: 'Usuario no encontrado' })

}))

export default router;