const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4 // Forzar IPv4, útil si hay problemas con IPv6
});

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos');
});

pool.on('error', (err) => {
  console.error('Error conectando a la base de datos:', err.message);
});

module.exports = pool;