import sql from 'mssql';

const generarNumeroVentas = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT COUNT(*) FROM Usuarios.Ventas');
    return result.recordset[0][''].toString().padStart(6, '0');
}

export default generarNumeroVentas;