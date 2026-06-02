const pool = require('../db/dbConfig');

const obtenerTuristas = async (req, res) => {
  try {
    const query = `
      SELECT t.*, tp.nombre_ruta, tp.fecha_viaje
      FROM turistas t
      LEFT JOIN tours_programados tp ON t.tour_id = tp.id
      ORDER BY tp.fecha_viaje ASC, t.nombre_completo ASC
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener turistas:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener turistas' });
  }
};

const crearTurista = async (req, res) => {
  const { tipo_documento, rut_pasaporte, nombre_completo, fecha_nacimiento, telefono_contacto, contacto_emergencia, condicion_medica, tour_id } = req.body;
  try {
    const query = `
      INSERT INTO turistas (tipo_documento, rut_pasaporte, nombre_completo, fecha_nacimiento, telefono_contacto, contacto_emergencia, condicion_medica, tour_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [tipo_documento || 'RUT', rut_pasaporte, nombre_completo, fecha_nacimiento || null, telefono_contacto, contacto_emergencia, condicion_medica, tour_id || null]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear turista:', error.message);
    res.status(500).json({ mensaje: 'Error al crear turista' });
  }
};

const eliminarTurista = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM turistas WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Turista no encontrado' });
    }
    res.status(200).json({ mensaje: 'Turista eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar turista:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar turista' });
  }
};

module.exports = { obtenerTuristas, crearTurista, eliminarTurista };
