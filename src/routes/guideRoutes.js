const express = require('express');
const { obtenerGuia, obtenerRutasPorCorreo, obtenerTransportesPorCorreo, crearComentario  } = require('../controllers/guiasController');

const router = express.Router();

// Ruta para obtener las rutas del guía
router.get('/guia/:correo', obtenerGuia);

// Ruta para obtener las rutas por correo
router.get('/ruta/:correo', obtenerRutasPorCorreo);

// Ruta para obtener los transportes por correo
router.get('/transportes/:correo', obtenerTransportesPorCorreo);

// Ruta para crear un comentario
router.post('/comentarios', crearComentario);


module.exports = router;