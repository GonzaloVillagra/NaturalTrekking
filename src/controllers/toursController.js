const pool = require('../db/dbConfig');

const obtenerTours = async (req, res) => {
  try {
    const query = `
      SELECT tp.*, r.dificultad
      FROM tours_programados tp
      JOIN rutas r ON tp.nombre_ruta = r.nombre
      ORDER BY tp.fecha_viaje ASC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener tours:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener tours programados' });
  }
};

const crearTour = async (req, res) => {
  const { nombre_ruta, fecha_viaje, correo_guia, patente_transporte, estado } = req.body;
  try {
    const query = `
      INSERT INTO tours_programados (nombre_ruta, fecha_viaje, correo_guia, patente_transporte, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre_ruta, fecha_viaje, correo_guia || null, patente_transporte || null, estado || 'Programado']);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear tour:', error.message);
    res.status(500).json({ mensaje: 'Error al crear tour programado' });
  }
};

const eliminarTour = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM tours_programados WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Tour no encontrado' });
    }
    res.status(200).json({ mensaje: 'Tour eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar tour:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar tour' });
  }
};

module.exports = { obtenerTours, crearTour, eliminarTour };
