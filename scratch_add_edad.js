const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('ALTER TABLE turistas ADD COLUMN edad INTEGER').then(() => {
  console.log("Column 'edad' added successfully");
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
