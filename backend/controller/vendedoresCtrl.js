import express from 'express';
import asyncHandler from 'express-async-handler';
import sql from 'mssql';

const createSeller = asyncHandler(async (req, res) => {

    // Your code here
});

const getSeller = asyncHandler(async (req, res) => {
    try {
        const pool = await sql.connect(connectionString);
        const result = await pool.request().query('SELECT * FROM Sellers');

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving sellers' });
    }
});

const getSellerById = asyncHandler(async (req, res) => {

    // Your code here
});

const updateSeller = asyncHandler(async (req, res) => {

    // Your code here
});

const deleteSeller = asyncHandler(async (req, res) => {

    // Your code here
});


export { createSeller, getSeller, getSellerById, updateSeller, deleteSeller };