const pool = require('../db/dbConfig');
const axios = require('axios');


// obtener comentario sobre la ruta
const obtenerComentario = async (req, res) => {
  try {
    const query = 'SELECT comentarios_ruta, nombre_ruta FROM rutas WHERE tipo = $1';
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener comentario:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener comentario' });
  }
};

// hacer comentario sobre la ruta
const hacerComentario = async (req, res) => {
  const { id_comentario, nombre_ruta, correo_usuario, comentario, fecha_comentario } = req.body;

  try {
    const query = `
      INSERT INTO comentarios_ruta (id_comentario, nombre_ruta, correo_usuario, comentario, fecha_comentario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING nombre_ruta, correo_usuario, comentario, fecha_comentario;
    `;
    const valores = [id_comentario, nombre_ruta, correo_usuario, comentario, fecha_comentario];
    const { rows } = await pool.query(query, valores);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear comentario:', error.message);
    res.status(500).json({ mensaje: 'Error al crear comentario' });
  }
};

// Eliminar una guía
const eliminarComentario = async (req, res) => {
  const { correo } = req.params;
  try {
    const query = 'DELETE FROM comentarios_ruta WHERE id_comentario = $1 AND tipo = $2 RETURNING id_comentario';
    const { rows } = await pool.query(query, [comentarios_ruta, 'id_comentario']);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'comentario no encontrado' });
    }

    res.status(200).json({ mensaje: 'comentario eliminado' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar comentario' });
  }
};

module.exports = { obtenerComentario, hacerComentario, eliminarComentario };
