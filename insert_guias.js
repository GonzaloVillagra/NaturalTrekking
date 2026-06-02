require('dotenv').config();
const pool = require('./src/db/dbConfig');

async function insert() {
  try {
    const query = `
      INSERT INTO usuarios (correo, nombre, tipo, "contraseña") VALUES 
      ('guia1@naturaltrekking.cl', 'Carlos Mendoza', 'guia', 'password123'),
      ('guia2@naturaltrekking.cl', 'Ana Soto', 'guia', 'password123'),
      ('guia3@naturaltrekking.cl', 'Pedro Pascal', 'guia', 'password123'),
      ('guia4@naturaltrekking.cl', 'Sofia Vergara', 'guia', 'password123')
      ON CONFLICT (correo) DO NOTHING;
    `;
    await pool.query(query);
    console.log('Guias insertados');
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
insert();
