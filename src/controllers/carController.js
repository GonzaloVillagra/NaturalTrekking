const pool = require('../db/dbConfig');


// Obtener transportes
const obtenerTransporte = async (req, res) => {
    try {
      const query = 'SELECT * FROM transportes'; 
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener transporte:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener transporte' });
    }
  };  

// Crear una nueva guía
const crearTransporte = async (req, res) => {
  const { patente, lugar_partida, hora_partida, vehiculo, nombre_conductor } = req.body;

  try {
      const query = `
          INSERT INTO transportes (patente, lugar_partida, hora_partida, vehiculo, nombre_conductor)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;
      const valores = [patente, lugar_partida, hora_partida, vehiculo, nombre_conductor];
      const result = await pool.query(query, valores);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error al crear transporte:', error.message);
      res.status(500).json({ mensaje: 'Error al crear transporte' });
  }
};  

// Eliminar una guía
const eliminarTransporte = async (req, res) => {
  const { patente } = req.params;

  try {
    const query = 'DELETE FROM transportes WHERE patente = $1 RETURNING *';
    const { rows } = await pool.query(query, [patente]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: 'Transporte no encontrado' });
    }

    res.status(200).json({ mensaje: 'Transporte eliminado correctamente', transporteEliminado: rows[0] });
  } catch (error) {
    console.error('Error al eliminar transporte:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar transporte' });
  }
};

module.exports = { obtenerTransporte, crearTransporte, eliminarTransporte };
