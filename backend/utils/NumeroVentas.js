const sql = require('mssql');

module.exports = async function generarNumeroVentas() {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT COUNT(*) FROM Financiero.Ventas');
    return result.recordset[0][''].toString().padStart(6, '0');
}