const pool = require('../db/dbConfig');
const axios = require('axios');

// Obtener todos los guías
const obtenerGuias = async (req, res) => {
  try {
    const query = 'SELECT correo, nombre FROM usuarios WHERE tipo = $1';
    const { rows } = await pool.query(query, ['guia']);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener guías:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener guías' });
  }
};

// Crear una nueva guía
const crearGuia = async (req, res) => {
  const { correo, nombre, contraseña } = req.body;

  try {
    const query = `
      INSERT INTO usuarios (correo, nombre, contraseña, tipo)
      VALUES ($1, $2, $3, 'guia')
      RETURNING correo, nombre, tipo;
    `;
    const valores = [correo, nombre, contraseña];
    const { rows } = await pool.query(query, valores);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear guía:', error.message);
    res.status(500).json({ mensaje: 'Error al crear guía' });
  }
};

// Eliminar una guía
const eliminarGuia = async (req, res) => {
  const { correo } = req.params;

  try {
    const query = 'DELETE FROM usuarios WHERE correo = $1 AND tipo = $2 RETURNING correo';
    const { rows } = await pool.query(query, [correo, 'guia']);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Guía no encontrada' });
    }

    res.status(200).json({ mensaje: 'Guía eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar guía:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar guía' });
  }
};

//Asignar Transporte
const asignarTransporte = async (req, res) => {
  const { correo_usuario, patente } = req.body;
  try {
    const usuarioQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const usuarioResult = await pool.query(usuarioQuery, [correo_usuario]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = 'UPDATE transportes SET correo_usuario = $1 WHERE patente = $2';
    await pool.query(query, [correo_usuario, patente]);
    res.status(200).json({ mensaje: 'Transporte asignado correctamente.' });
  } catch (error) {
    console.error('Error al asignar transporte:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

//Asignar Ruta
const asignarRuta = async (req, res) => {
  const { correo_usuario, nombre } = req.body;
  try {
    const usuarioQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const usuarioResult = await pool.query(usuarioQuery, [correo_usuario]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const query = 'UPDATE rutas SET correo_usuario = $1 WHERE nombre = $2';
    await pool.query(query, [correo_usuario, nombre]);
    res.status(200).json({ mensaje: 'Transporte asignado correctamente.' });
  } catch (error) {
    console.error('Error al asignar transporte:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Obtener los nombres de las rutas
const obtenerNombresRutas = async (req, res) => {
  try {
      const query = 'SELECT nombre FROM rutas'; 
      const { rows } = await pool.query(query);
      res.status(200).json(rows.map(row => row.nombre));
  } catch (error) {
      console.error('Error al obtener los nombres de las rutas:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener los nombres de las rutas' });
  }
};

// Cambiar la ruta de un guía
const cambiarRutaGuia = async (req, res) => {
  const { correo_usuario, nombre } = req.body; 

  try {
    const query = `
      UPDATE rutas
      SET correo_usuario = $1
      WHERE nombre = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [correo_usuario, nombre]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada o guía no existe' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al reasignar el guía de la ruta:', error.message);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { obtenerGuias, crearGuia, eliminarGuia, asignarTransporte, asignarRuta, obtenerNombresRutas, cambiarRutaGuia};
