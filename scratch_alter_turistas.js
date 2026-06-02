const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sql = `
  ALTER TABLE turistas DROP COLUMN IF EXISTS edad;
  ALTER TABLE turistas ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE;
  ALTER TABLE turistas ADD COLUMN IF NOT EXISTS tipo_documento TEXT DEFAULT 'RUT' CHECK (tipo_documento IN ('RUT', 'Pasaporte'));
`;

pool.query(sql).then(() => {
  console.log("Database altered successfully");
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
