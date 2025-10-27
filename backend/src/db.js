import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'userpassword',
    database: process.env.DB_NAME || 'mybooks',
});

export default pool;
