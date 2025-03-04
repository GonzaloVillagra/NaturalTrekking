const pool = require('../db/dbConfig');
const axios = require('axios');

// Obtener clientes
const obtenerCliente = async (req, res) => {
    try {
      const query = 'SELECT * FROM clientes'; 
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error al obtener clientes:', error.message);
      res.status(500).json({ mensaje: 'Error al obtener clientes' });
    }
  }; 
  

// Crear una nueva guía
const crearCliente = async (req, res) => {
    const { rut, nombre, edad, telefono, correo_usuario } = req.body;  
    try {
      const query = `
        INSERT INTO clientes (rut, nombre, edad, telefono, correo_usuario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const valores = [rut, nombre, edad, telefono, correo_usuario];
      const result = await pool.query(query, valores);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear cliente:', error.message);
      res.status(500).json({ mensaje: 'Error al crear cliente' });
    }
  };
  
// Eliminar una guía
const eliminarCliente = async (req, res) => {
    const { rut } = req.params;
  
    try {
      const query = 'DELETE FROM clientes WHERE rut = $1 RETURNING *';
      const { rows } = await pool.query(query, [rut]);
  
      if (rows.length === 0) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      }
  
      res.status(200).json({ mensaje: 'Cliente eliminado correctamente', clienteEliminado: rows[0] });
    } catch (error) {
      console.error('Error al eliminar cliente:', error.message);
      res.status(500).json({ mensaje: 'Error al eliminar cliente' });
    }
  };

module.exports = { obtenerCliente, crearCliente, eliminarCliente };
