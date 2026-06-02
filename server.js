require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes/routes'); 
const pool = require('./src/db/dbConfig');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 5000;

// Orígenes permitidos para CORS
const allowedOrigins = [
  'https://naturaltrekking.onrender.com',
  'http://localhost:3000'
];

// Configuración de CORS
app.use(cors({
  origin: '*', // Permitir todo temporalmente para que la app móvil no sea bloqueada
  credentials: false
}));

// Middleware de CORS manejado por la libreria cors

// Middleware para parsear JSON
app.use(express.json());

// Verificar conexión con la base de datos
pool.query('SELECT NOW()')
  .then(res => console.log('Conexión exitosa a la base de datos:', res.rows[0]))
  .catch(err => console.error('Error conectando a la base de datos:', err.message));

// Integrar rutas de la API
app.use('/api', routes);

// Servir archivos estáticos de React SOLO si existe el build
const clientPath = path.join(__dirname, 'build');

if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));

  // Manejar todas las rutas y devolver index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  console.warn('⚠️ No se encontró el frontend de React en "build". Verifica el build.');
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});