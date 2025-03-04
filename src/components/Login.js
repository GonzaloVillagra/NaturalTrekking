import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(`Campo "${name}" actualizado: ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando datos de login:', formData);

    if (!formData.correo || !formData.contraseña) {
      const msg = 'Por favor completa todos los campos';
      setMessage(msg);
      console.log(msg);
      return;
    }

    try {
      const response = await axios.post('/api/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Respuesta del servidor:', response.data);

      if (response.data.token) {
        localStorage.setItem('userType', response.data.user.tipo);
        localStorage.setItem('token', response.data.token);
        console.log('Login exitoso. Token y tipo de usuario almacenados.');

        if (response.data.user.tipo === 'admin') {
          console.log('Usuario admin. Redireccionando a /admin');
          navigate('/admin');
        } else if (response.data.user.tipo === 'guia') {
          console.log('Usuario guía. Redireccionando a /guias');
          navigate('/guias');
        } else {
          const unknownMsg = 'Tipo de usuario desconocido';
          setMessage(unknownMsg);
          console.log(unknownMsg, response.data.user.tipo);
        }
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : 'Error de red o servidor';
      setMessage(errorMsg);
      console.error('Error al iniciar sesión:', errorMsg);
    }
  };

  return (
    <div>
      <header className="app-header">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>NaturalTrekking</h1>
      </header>
      <h2>Inicio de Sesión</h2>
      
      <form onSubmit={handleSubmit}>
        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <label>Contraseña:</label>
        <input
          type="password"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default Login;
