import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: 'sa',
    password: '12345',
    server: 'DESKTOP-3Q2RTTI',
    database: 'VentaDB',
    options: {
        encrypt: true, // If you're connecting to Azure SQL Database, set this to true
        trustServerCertificate: true
    }
};

export async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Connected to the database');
        // You can now execute queries or perform other database operations
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}