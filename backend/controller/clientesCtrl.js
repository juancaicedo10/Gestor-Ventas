import express from 'express';
import asyncHandler from 'express-async-handler';

const createClient = asyncHandler(async (req, res) => {

    const client = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    };

    const newClient = await Client.create(client);
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