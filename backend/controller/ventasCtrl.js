import sql from 'mssql';
import AsyncHandler from 'express-async-handler';
import generarNumeroVentas from '../utils/NumeroVentas';


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

const getSaleById = (req, res) => {
    // Logic to retrieve a sale by its ID
};

const getAllSales = (req, res) => {
    // Logic to retrieve all sales
};

const updateSale = (req, res) => {
    // Logic to update a sale
};

const deleteSale = (req, res) => {
    // Logic to delete a sale
};

// Export your controller functions
module.exports = {
    createSale,
    getSaleById,
    getAllSales,
    updateSale,
    deleteSale
};