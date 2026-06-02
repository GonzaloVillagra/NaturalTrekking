const axios = require('axios');
const pool = require('../db/dbConfig');
require ('dotenv').config

const crearHito = async (req, res) => {
  const { nombre, descripcion, ubicacion, imagen_url, nombre_ruta } = req.body;
  try {
    const query = 'INSERT INTO hitos (nombre, descripcion, ubicacion, imagen_url, nombre_ruta) VALUES ($1, $2, ST_GeomFromText($3, 4326), $4, $5)';
    await pool.query(query, [nombre, descripcion, ubicacion, imagen_url || null, nombre_ruta]);
    res.status(201).json({ mensaje: 'Hito creado correctamente' });
  } catch (error) {
    console.error('Error al crear el hito:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el hito' });  
  }
};

const obtenerHitosPorRuta = async (req, res) => {
  const { nombre } = req.params;
  try {
    const query = 'SELECT id, nombre, descripcion, imagen_url, ST_X(ubicacion::geometry) AS lng, ST_Y(ubicacion::geometry) AS lat, nombre_ruta FROM hitos WHERE nombre_ruta = $1';
    const { rows } = await pool.query(query, [nombre]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener hitos:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener hitos' });
  }
};

module.exports = { crearHito, obtenerHitosPorRuta };