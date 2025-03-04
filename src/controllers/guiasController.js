
const pool = require('../db/dbConfig');
const axios = require('axios');



// Obtener todos los guías
const obtenerGuia = async (req, res) => {
  try {
    const query = 'SELECT correo, nombre FROM usuarios WHERE tipo = $1';
    const { rows } = await pool.query(query, ['guia']);
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

module.exports = {obtenerGuia, obtenerRutasPorCorreo, obtenerTransportesPorCorreo, crearComentario};
