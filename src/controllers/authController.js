const pool = require('../db/dbConfig');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  console.log('Contraseña recibida:', contraseña);
  console.log('Consulta ejecutada con:', correo);

  //comentarios para agregar

  try {
    const query = 'SELECT * FROM usuarios WHERE correo = $1';
    const { rows } = await pool.query(query, [correo.trim()]);
    const user = rows[0];
    console.log('Resultado de la consulta:', rows);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if (user.contraseña !== contraseña) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.correo, tipo: user.tipo }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: { correo: user.correo, tipo: user.tipo, nombre: user.nombre },
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { login };
