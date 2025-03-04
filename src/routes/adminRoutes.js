const express = require('express');
const { asignarRuta, cambiarRutaGuia ,obtenerGuias, crearGuia, eliminarGuia, obtenerNombresRutas, asignarTransporte } = require('../controllers/guideController');
const { obtenerRutas, eliminarRuta, obtenerRutaDesdeAPI, agregarRuta, obtenerDetalleRuta, obtenerComentarios } = require('../controllers/routeController');
const { obtenerTransporte, crearTransporte, eliminarTransporte } = require('../controllers/carController');
const { obtenerCliente, crearCliente,eliminarCliente} = require('../controllers/clientController')
const { crearHito } = require('../controllers/hitosController')

const router = express.Router(); 

// Rutas para manejar guías
router.get('/guias', obtenerGuias); 
router.get('/guias/transportes', obtenerTransporte); 
router.get('/rutas/:nombres', obtenerNombresRutas);
router.post('/guias/asignartransporte', asignarTransporte);
router.post('/guias/:asignarruta', asignarRuta);
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


//Rutas para manejar clientes
router.get('/clientes', obtenerCliente); 
router.post('/clientes', crearCliente);
router.delete('/clientes/:rut', eliminarCliente);

//Rutas para manejar transporte
router.get('/transportes', obtenerTransporte); 
router.post('/transportes', crearTransporte); 
router.delete('/transportes/:patente', eliminarTransporte); 

// Rutas para manejar hitos
router.post('/hitos', crearHito)




module.exports = router;
