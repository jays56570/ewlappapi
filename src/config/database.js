const mysql = require('mysql2/promise');
require('dotenv').config(); 
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ewl',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
});

async function getConnection() {
  return pool;
}

module.exports = { getConnection };

