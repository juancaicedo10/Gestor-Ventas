import express from 'express';
import asyncHandler from 'express-async-handler';
import sql from 'mssql';

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
        .query('INSERT INTO Usuarios.Clientes (NombreCompleto, NumeroDocumento, TipoDocumento, Telefono, Correo) VALUES (@NombreCompleto, @NumeroDocumento, @TipoDocumento, @Telefono, @Correo)');

        res.json({ message: 'Cliente creado correctamente'})
    } catch (error) {
        res.json({ message: "error al crear el cliente" })
    }
    }
);

const getClients = asyncHandler(async (req, res) => {

    // Your code here
});

const getClientById = asyncHandler(async (req, res) => {

    // Your code here
});

const updateClient = asyncHandler(async (req, res) => {

    // Your code here
});

const deleteClient = asyncHandler(async (req, res) => {

    // Your code here
});