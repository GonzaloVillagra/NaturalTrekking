
const pool = require('../db/dbConfig');
const axios = require('axios');



// Obtener todos los guías
const obtenerGuia = async (req, res) => {
  const { correo } = req.params;
  try {
    const query = 'SELECT correo, nombre FROM usuarios WHERE tipo = $1 AND correo = $2';
    const { rows } = await pool.query(query, ['guia', correo]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener guías:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener guías' });
  }
};

// obtener rutas por correo
const obtenerRutasPorCorreo = async (req, res) => {
  const { correo } = req.params; 
  try {
    const query = 'SELECT * FROM rutas WHERE correo_usuario = $1';
    const { rows } = await pool.query(query, [correo]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ mensaje: 'No se encontraron rutas para este correo.' });
    }
  } catch (error) {
    console.error('Error al obtener rutas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener rutas' });
  }
};

// obtener transportes por correo
const obtenerTransportesPorCorreo = async (req, res) => {
  const { correo } = req.params;
  try {
    const query = 'SELECT * FROM transportes WHERE correo_usuario = $1';
    const { rows } = await pool.query(query, [correo]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ mensaje: 'No se encontraron transportes para este correo.' });
    }
  } catch (error) {
    console.error('Error al obtener transportes:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener transportes' });
  }
};

// hacer comentario sobre la ruta
const crearComentario = async (req, res) => {
  const { nombre_ruta, correo_usuario, comentario } = req.body;
  try {
    const query = 'INSERT INTO comentarios_ruta (nombre_ruta, correo_usuario, comentario) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await pool.query(query, [nombre_ruta, correo_usuario, comentario]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear comentario:', error.message);
    res.status(500).json({ mensaje: 'Error al crear comentario' });
  }
};

// obtener tours programados del guia
const obtenerToursDelGuia = async (req, res) => {
  const { correo } = req.params;
  try {
    const query = `
      SELECT t.*, r.coordenadas, r.dificultad, tr.vehiculo, tr.capacidad, tr.nombre_conductor, tr.lugar_partida, tr.hora_partida
      FROM tours_programados t
      LEFT JOIN rutas r ON t.nombre_ruta = r.nombre
      LEFT JOIN transportes tr ON t.patente_transporte = tr.patente
      WHERE t.correo_guia = $1
      ORDER BY t.fecha_viaje ASC
    `;
    const { rows } = await pool.query(query, [correo]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener tours:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener tours' });
  }
};

// obtener pasajeros de un tour
const obtenerPasajerosPorTour = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM turistas WHERE tour_id = $1 ORDER BY nombre_completo ASC';
    const { rows } = await pool.query(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener pasajeros:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener pasajeros' });
  }
};

module.exports = {obtenerGuia, obtenerRutasPorCorreo, obtenerTransportesPorCorreo, crearComentario, obtenerToursDelGuia, obtenerPasajerosPorTour};
