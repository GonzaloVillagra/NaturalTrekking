const axios = require('axios');
const pool = require('../db/dbConfig');
require ('dotenv').config


//obtener todas las rutas guardadas
const obtenerRutas = async (req, res) => {
  try {
    const query = `
        SELECT nombre, descripcion, distancia_km, tiempo_estimado, dificultad, 
        ST_AsGeoJSON(ruta_gps) AS ruta_gps,
        ST_AsGeoJSON(ST_StartPoint(ruta_gps)) AS inicio,
        ST_AsGeoJSON(ST_EndPoint(ruta_gps)) AS fin
        FROM rutas;
    `;
    const { rows } = await pool.query(query);
    console.log('Rutas obtenidas:', rows); 
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las rutas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener las rutas guardadas.' });
  }
};

//obtener Detalles de la ruta
const obtenerDetalleRuta = async (req, res) => {
  const { nombre } = req.params; 
  try {
    const query = `SELECT * FROM rutas WHERE nombre = $1`;  
    const { rows } = await pool.query(query, [nombre]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener detalles de la ruta:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};;

//Iniciar Recorrido
const iniciarRecorrido = async (inicio, fin) => {
  try {
    const response = await axios.post('/api/admin/ruta/gps', { inicio, fin }); 
    console.log('Recorrido iniciado:', response.data);
  } catch (error) {
    console.error('Error al iniciar recorrido:', error);
  }
};

// Eliminar una ruta
const eliminarRuta = async (req, res) => {
  const { nombre } = req.params;

  try {
    const query = 'DELETE FROM rutas WHERE nombre = $1 RETURNING nombre';
    const { rows } = await pool.query(query, [nombre]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    res.status(200).json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar ruta:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar ruta' });
  }
};
// Obtención de ruta desde dos puntos
const obtenerRutaDesdeAPI = async (req, res) => {
  const { inicio, fin } = req.body;
  console.log('Datos recibidos:', { inicio, fin });
  try {
    const response = await axios.get('https://api.openrouteservice.org/v2/directions/foot-hiking', {
      params: {
        api_key: process.env.ORS_API_KEY,
        start: `${inicio.longitude},${inicio.latitude}`,
        end: `${fin.longitude},${fin.latitude}`,
      },
    });

    console.log('Respuesta de OpenRouteService:', response.data); 
    const rutaGps = response.data.routes[0].geometry.coordinates;
    res.status(200).json(rutaGps);
  } catch (error) {
    console.error('Error al obtener ruta desde OpenRouteService:', error.message);
    console.error('Detalles del error:', error.response?.data || 'Sin respuesta del servidor externo');
    res.status(500).json({ mensaje: 'Error al obtener la ruta GPS' });
  }
};

// Agregar Ruta
const agregarRuta = async (req, res) => {
  const { nombre, descripcion, distancia_km, tiempo_estimado, dificultad, correo_usuario, ruta_gps } = req.body;

  try {
    const query = `
      INSERT INTO rutas (nombre, descripcion, distancia_km, tiempo_estimado, dificultad, correo_usuario, ruta_gps)
      VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromGeoJSON($7))
      RETURNING *;
    `;
    const valores = [nombre, descripcion, distancia_km, tiempo_estimado, dificultad, correo_usuario, ruta_gps];
    const { rows } = await pool.query(query, valores);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al guardar la ruta:', error.message);
    res.status(500).json({ mensaje: 'Error al guardar la ruta' });
  }
};

const obtenerComentarios = async (req, res) => {
  try {
    const nombre_ruta = req.params.nombre; 
    const query = `
      SELECT correo_usuario, comentario, fecha_comentario 
      FROM comentarios_ruta 
      WHERE nombre_ruta = $1`; 
    const { rows } = await pool.query(query, [nombre_ruta]); 
    console.log('Comentarios obtenidos:', rows); 
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los comentarios guardados.' });
  }
};




module.exports = { obtenerRutas, eliminarRuta, obtenerRutaDesdeAPI, agregarRuta, iniciarRecorrido, obtenerDetalleRuta, obtenerComentarios};

