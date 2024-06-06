const express = require('express');
const asyncHandler = require('express-async-handler');
const sql = require('mssql');

const createClient = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        await pool.request()
        .input('NombreCompleto', sql.VarChar, req.body.NombreCompleto)
        .input('NumeroDocumento', sql.VarChar, req.body.NumeroDocumento)
        .input('TipoDocumento', sql.Int, req.body.TipoDocumento)
        .input('Telefono', sql.VarChar, req.body.Telefono)
        .input('Correo', sql.VarChar, req.body.Correo)
        .input('Contraseña', sql.VarChar, req.body.Contraseña)
        .query('INSERT INTO Usuarios.Clientes (NombreCompleto, NumeroDocumento, TipoDocumento, Telefono, Correo, Contraseña) VALUES (@NombreCompleto, @NumeroDocumento, @TipoDocumento, @Telefono, @Correo, @Contraseña)');

        res.json({ message: 'Cliente creado correctamente'})
    } catch (error) {
        res.json({ message: "error al crear el cliente" })
    }
    }
);

const getClients = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Usuarios.Clientes WHERE Aprobado = 1');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'no hay clientes' });
    }
});

const getClientById = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect();
        const Id = req.params.id;
        const result = await pool.request().query(`SELECT * FROM Usuarios.Clientes WHERE Id = ${Id}`);
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: 'no se pudo obtener el cliente' });
    }   
});

const getClientsBySeller = asyncHandler(async (req, res) => {
    try{
        const pool = await sql.connect();
        const vendedorId = req.params.id;
        const result = await pool.request().query(`SELECT * FROM Usuarios.Clientes WHERE VendedorId = ${vendedorId} AND Aprobado = 1`);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'error al obtener los clientes' });
    }
});

const getClientsToApprove = asyncHandler(async (req, res) => {
    try{
        const pool = await sql.connect();
        const result = await pool.request().query('SELECT * FROM Usuarios.Clientes WHERE Aprobado = 0');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'no hay clientes por aprobar' });
    }
});

const handleApproveClient = asyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const Id = req.params.id;
    const approved = req.body.aprobado ? 1 : 0;

    if (approved) {
        await pool.request()
            .input('Id', sql.Int, Id)
            .query('UPDATE Usuarios.Clientes SET Aprobado = 1 WHERE Id = @Id');
        res.json({ message: 'Cliente aprobado correctamente' });
    } else {
        await pool.request()
            .input('Id', sql.Int, Id)
            .query('DELETE FROM Usuarios.Clientes WHERE Id = @Id');
        res.json({ message: 'Cliente desaprobado correctamente' });
    }
});

const updateClient = asyncHandler(async (req, res) => {
    const pool = await sql.connect();
    const Id = req.params.id;

     await pool.request()
    .input('NombreCompleto', sql.VarChar, req.body.NombreCompleto)
    .input('NumeroDocumento', sql.VarChar, req.body.NumeroDocumento)
    .input('TipoDocumento', sql.Int, req.body.TipoDocumento)
    .input('Telefono', sql.VarChar, req.body.Telefono)
    .input('Correo', sql.VarChar, req.body.Correo)
    .input('Contraseña', sql.VarChar, req.body.Contraseña)
    .query(`UPDATE Usuarios.Clientes SET NombreCompleto = @NombreCompleto, NumeroDocumento = @NumeroDocumento, TipoDocumento = @TipoDocumento, Telefono = @Telefono, Correo = @Correo WHERE Id = ${Id}`);

    res.json({ message: 'Cliente actualizado correctamente' });
});

const deleteClient = asyncHandler(async (req, res) => {

    const pool = await sql.connect();
    const Id = req.params.id;

    const result = await pool.request()
    .query(`DELETE FROM Usuarios.Clientes WHERE Id = ${Id}`);

    res.json({ message: 'Cliente eliminado correctamente' });
});

module.exports = { createClient, getClients, getClientsBySeller, getClientById, updateClient, deleteClient, getClientsToApprove, handleApproveClient };