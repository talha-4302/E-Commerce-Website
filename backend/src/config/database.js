import mysql from 'mysql2/promise';
import 'dotenv/config';

// Create a connection pool to MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ezshop_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        // Test the connection
        const connection = await pool.getConnection();
        console.log('Raw MySQL Connection has been established successfully.');
        connection.release();
    } catch (error) {
        console.error('Unable to connect to the MySQL database:', error);
    }
};

export default pool;
