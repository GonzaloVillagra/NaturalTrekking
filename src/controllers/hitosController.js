const axios = require('axios');
const pool = require('../db/dbConfig');
require ('dotenv').config

const crearHito = async (req, res) => {
  const { nombre, descripcion, ubicacion, imagen_url, nombre_ruta } = req.body;
  try {
    const query = 'INSERT INTO hitos (nombre, descripcion, ubicacion, imagen_url, nombre_ruta) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [nombre, descripcion, ubicacion, imagen_url || null, nombre_ruta]);
    res.status(201).json({ mensaje: 'Hito creado correctamente' });
  } catch (error) {
    console.error('Error al crear el hito:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el hito' });  
  }
};

module.exports = {crearHito}