const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeout: 2000,
    options: {
        encrypt: true, // If you're connecting to Azure SQL Database, set this to true
        trustServerCertificate: true,
        enableArithAbort: true
    }
};
//changes

module.exports = async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Connected to the database');
        // You can now execute queries or perform other database operations
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}