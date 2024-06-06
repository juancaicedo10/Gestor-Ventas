import sql from 'mssql';
import AsyncHandler from 'express-async-handler';
import { generarNumeroVentas } from '../utils/NumeroVentas.js';


const createSale = AsyncHandler( async (req, res) => {
    const pool = await sql.connect();
    await pool.request()
    .input('IdCliente', sql.Int, req.body.IdCliente)
    .input('IdVendedor', sql.Int, req.body.IdVendedor)
    .input('ValorVenta', sql.Decimal, req.body.ValorVenta)
    .input('FechaInicio', sql.Date, req.body.FechaInicio)
    .input('FechaFin', sql.Date, req.body.FechaFin)
    .input('NumeroCuotas', sql.Int, req.body.NumeroCuotas)
    .input('NumeroVenta', sql.VarChar, await generarNumeroVentas())
    .Input('SaldoMoraTotal', sql.Decimal, req.body.SaldoMoraTotal)
    .query('INSERT INTO Usuarios.Ventas (IdCliente, IdVendedor, ValorVenta, FechaInicio, FechaFin, NumeroCuotas, NumeroVenta, SaldoMoraTotal) VALUES (@IdCliente, @IdVendedor, @ValorVenta, @FechaInicio, @FechaFin, @NumeroCuotas, @NumeroVenta, @SaldoMoraTotal)');
});

const abonoCuota = AsyncHandler( async (req, res) => {
    const pool = await sql.connect();
    await pool.request()
    .input('IdVenta', sql.Int, req.body.IdVenta)
    .input('ValorAbono', sql.Decimal, req.body.ValorAbono)
    .query('INSERT INTO Financiero.Abonos (IdVenta, ValorAbono) VALUES (@IdVenta, @ValorAbono)');
});

const getSaleById = AsyncHandler(async(req, res) => {
    const pool = await sql.connect();
    const Id = req.params.id;
    const result = await pool.request()
    .input('Id', sql.Int, Id)
    .execute('Financiero.ObtenerVentasPorId');
    console.log(result);
    res.json(result.recordset[0]);
});

const getAllSalesByVendedor = AsyncHandler(async(req, res) => {
    const pool = await sql.connect();
    const VendedorId = req.params.id;
    const result = await pool.request()
    .input('VendedorId', sql.Int, VendedorId)
    .execute('Financiero.ObtenerVentasPorVendedor');
    res.json(result.recordset);
})

const getSaleByVendedor = AsyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const VendedorId = req.params.id;
    const result = await pool.request().query(`SELECT * FROM Financiero.Ventas WHERE VendedorId = ${VendedorId} AND Id = ${req.params.id}`);
    res.json(result.recordset);
})

const getAllSales = AsyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const result = await pool.request().query('Financiero.ObtenerVentas');
    res.json(result.recordset);
});

const updateSale = AsyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const Id = req.params.id;
    await pool.request()
    .input('ClienteId', sql.Int, req.body.IdCliente)
    .input('VendedorId', sql.Int, req.body.IdVendedor)
    .input('ValorVenta', sql.Decimal, req.body.ValorVenta)
    .input('FechaInicio', sql.Date, req.body.FechaInicio)
    .input('FechaFin', sql.Date, req.body.FechaFin)
    .input('NumeroCuotas', sql.Int, req.body.NumeroCuotas)
    .input('NumeroVenta', sql.VarChar, req.body.NumeroVenta)
    .Input('SaldoMoraTotal', sql.Decimal, req.body.SaldoMoraTotal)
    .query(`UPDATE Usuarios.Ventas SET ClienteId = @ClienteId, VendedorId = @VendedorId, ValorVenta = @ValorVenta, FechaInicio = @FechaInicio, FechaFin = @FechaFin, NumeroCuotas = @NumeroCuotas, NumeroVenta = @NumeroVenta, SaldoMoraTotal = @SaldoMoraTotal WHERE Id = ${Id}`);
});

const deleteSale = AsyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const Id = req.params.id;
    await pool.request().query(`DELETE FROM Usuarios.Ventas WHERE Id = ${Id}`);
    res.json({ message: 'Venta eliminada correctamente' });
});

// Export your controller functions
export {
    createSale,
    abonoCuota,
    getSaleById,
    getAllSales,
    getAllSalesByVendedor,
    getSaleByVendedor,
    updateSale,
    deleteSale
};