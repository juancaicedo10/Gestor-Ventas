import express from 'express';
import asyncHandler from 'express-async-handler';
import sql from 'mssql';
import { paginate } from '../utils/pagination.js';

const createSeller = asyncHandler(async (req, res) => {
    try {
    const pool = await sql.connect();
    await pool.request()
    .input('NombreCompleto', sql.VarChar, req.body.NombreCompleto)
    .input('NumeroDocumento', sql.VarChar, req.body.NumeroDocumento)
    .input('TipoDocumento', sql.Int, req.body.TipoDocumento)
    .input('Telefono', sql.VarChar, req.body.Telefono)
    .input('Correo', sql.VarChar, req.body.Correo)
    .input('Contraseña', sql.VarChar, req.body.Contraseña)
    .query('INSERT INTO Usuarios.Vendedores (NombreCompleto, NumeroDocumento, TipoDocumento, Telefono, Correo, Contraseña) VALUES (@NombreCompleto, @NumeroDocumento, @TipoDocumento, @Telefono, @Correo)');
    res.json({ message: 'Vendedor creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'no se pudo crear el vendedor' });
    }
    const pool = await sql.connect();
    const result = await pool.request()
    .input('NombreCompleto', sql.VarChar, req.body.NombreCompleto)
    .input('NumeroDocumento', sql.VarChar, req.body.NumeroDocumento)
    .input('TipoDocumento', sql.Int, req.body.TipoDocumento)
    .input('Telefono', sql.VarChar, req.body.Telefono)
    .input('Correo', sql.VarChar, req.body.Correo)
    .query('INSERT INTO Usuarios.Vendedores (NombreCompleto, NumeroDocumento, TipoDocumento, Telefono, Correo) VALUES (@NombreCompleto, @NumeroDocumento, @TipoDocumento, @Telefono, @Correo)');
    res.json(result);
});

const getSeller = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Usuarios.Vendedores');
        var result2 = paginate(result.recordset, req.query.page, req.query.limit);
        res.json(result2);
    } catch (error) {
        res.status(500).json({ message: 'no hay vendedores' });
    }
});

const getSellerById = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const Id = req.params.id;
        const result = await pool.request().query(`SELECT * FROM Usuarios.Vendedores WHERE Id = ${Id}`);
        res.json(result.recordset[0]);
    }catch (error) {
        res.status(500).json({ message: 'no se pudo obtener el vendedor' });
    }
});

const updateSeller = asyncHandler(async (req, res) => {

    const pool = await sql.connect();
    const Id = req.params.id;

    const result = await pool.request()
    .input('NombreCompleto', sql.VarChar, req.body.NombreCompleto)
    .input('NumeroDocumento', sql.VarChar, req.body.NumeroDocumento)
    .input('TipoDocumento', sql.Int, req.body.TipoDocumento)
    .input('Telefono', sql.VarChar, req.body.Telefono)
    .input('Correo', sql.VarChar, req.body.Correo)
    .query(`UPDATE Usuarios.Vendedores SET NombreCompleto = @NombreCompleto, NumeroDocumento = @NumeroDocumento, TipoDocumento = @TipoDocumento, Telefono = @Telefono, Correo = @Correo WHERE Id = ${Id}`);
    res.json({ message: 'Vendedor actualizado correctamente' });

});

const deleteSeller = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const Id = req.params.id;
        await pool.request().query(`DELETE FROM Usuarios.Vendedores WHERE Id = ${Id}`);
        res.json({ message: 'Vendedor eliminado' });
    } catch (error) {
        res.status(500).json( {message: "El vendedor tiene clientes asignados por lo que no lo puedes borrar"})
    }
});


const getSellsBySeller = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const Id = req.params.id;
        const result = await pool.request().query(`SELECT * FROM Usuarios.Ventas WHERE VendedorId = ${Id}`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'No se pueden obtener las ventas' });
    }
});


export { createSeller, getSeller, getSellerById, updateSeller, deleteSeller, getSellsBySeller };