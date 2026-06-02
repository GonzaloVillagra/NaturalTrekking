const express = require('express');
const { asignarRuta, cambiarRutaGuia ,obtenerGuias, crearGuia, eliminarGuia, obtenerNombresRutas, asignarTransporte } = require('../controllers/guideController');
const { finalizarRuta, obtenerRutas, eliminarRuta, obtenerRutaDesdeAPI, agregarRuta, obtenerDetalleRuta, obtenerComentarios } = require('../controllers/routeController');
const { obtenerTransporte, crearTransporte, eliminarTransporte } = require('../controllers/carController');
const { obtenerTuristas, crearTurista, eliminarTurista } = require('../controllers/turistasController');
const { obtenerTours, crearTour, eliminarTour } = require('../controllers/toursController');
const { crearHito, obtenerHitosPorRuta } = require('../controllers/hitosController');

const router = express.Router(); 

// Rutas para manejar guías
router.get('/guias', obtenerGuias); 
router.get('/guias/transportes', obtenerTransporte); 
router.get('/rutas/:nombres', obtenerNombresRutas);
router.post('/guias/asignartransporte', asignarTransporte);
router.post('/guias/asignarruta', asignarRuta);
router.post('/guias', crearGuia); 
router.put('/guias/ruta', cambiarRutaGuia)
router.delete('/guias/:correo', eliminarGuia); 


//Rutas para manejar Rutas
router.get('/rutas', obtenerRutas); 
router.get('/ruta/:nombre', obtenerDetalleRuta);
router.get('/comentario/:nombre', obtenerComentarios);
router.post('/rutas', agregarRuta); 
router.delete('/rutas/:nombre', eliminarRuta); 
router.post('/rutas/:gps', obtenerRutaDesdeAPI)


//Rutas para manejar Tours Programados
router.get('/tours', obtenerTours); 
router.post('/tours', crearTour);
router.delete('/tours/:id', eliminarTour);

//Rutas para manejar Turistas/Pasajeros
router.get('/turistas', obtenerTuristas); 
router.post('/turistas', crearTurista);
router.delete('/turistas/:id', eliminarTurista);

//Rutas para manejar transporte
router.get('/transportes', obtenerTransporte); 
router.post('/transportes', crearTransporte); 
router.delete('/transportes/:patente', eliminarTransporte); 

// Rutas para manejar hitos
router.post('/hitos', crearHito);
router.get('/hitos/:nombre', obtenerHitosPorRuta);

const pool = require('../db/dbConfig');
const fs = require('fs');
router.post('/seed', async (req, res) => {
  try {
    const sql = fs.readFileSync('seed.sql', 'utf8');
    await pool.query(sql);
    res.json({ message: 'Seed completado con éxito!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
