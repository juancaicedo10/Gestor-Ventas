import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // If you're connecting to Azure SQL Database, set this to true
        trustServerCertificate: true
    }
};
//changes

export async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Connected to the database');
        // You can now execute queries or perform other database operations
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}