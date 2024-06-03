import sql from 'mssql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../' });
import dot from '../../'
export default async function loginCtrl(req, res) {
    const { correo, contraseña } = req.body;

    try {
        const pool = await sql.connect()
        await pool.request()
        .query(`SELECT * FROM Usuarios.Administradores WHERE CorreoElectronico = '${correo}' AND Contraseña = '${contraseña}'`);

        if (Administrador.recordset.length > 0) {
            const token = jwt.sign({ user: resultAdmin.recordset[0], role: 'Administrador' }, process.env.SECRET_KEY);
            res.json({ token });
        } else if (Vendedor.recordset.length > 0) {
            const token = jwt.sign({ user: resultVendedor.recordset[0], role: 'Vendedor' }, process.env.SECRET_KEY);
            res.json({ token });
        } else {
            res.status(500).json({ message: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al conectar con la base de datos' });
    }
}
