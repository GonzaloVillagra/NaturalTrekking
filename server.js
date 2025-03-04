require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes/routes'); 
const pool = require('./src/db/dbConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Orígenes permitidos para CORS
const allowedOrigins = [
  'http://localhost:3000', 
  'https://naturaltrekking.onrender.com'
];

// Configuración de CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como las de herramientas o servidores)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true 
}));

// Middleware para establecer encabezados CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Verificar conexión con la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos:', res.rows[0]);
  }
});

// Integrar rutas de la API
app.use('/api', routes);

// Servir archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, 'client/build')));

// Manejar todas las rutas y devolver el archivo index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
