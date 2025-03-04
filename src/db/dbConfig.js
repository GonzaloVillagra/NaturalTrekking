const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos');
});

pool.on('error', (err) => {
  console.error('Error conectando a la base de datos:', err.message);
});

module.exports = pool;