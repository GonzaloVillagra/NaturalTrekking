import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import '../css/gestionGuiasPanel.css'

const ManejoGuias = () => {
  const [guias, setGuias] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nombreRuta, setNombreRuta] = useState('');
  const [patenteTransporte, setPatenteTransporte] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guiaSeleccionado, setGuiaSeleccionado] = useState('');
  const [guiaTransporteSeleccionado, setGuiaTransporteSeleccionado] = useState('');

  useEffect(() => {
    fetchGuias();
    fetchRutas();
    fetchTransportes();
  }, []);

//obtener guias
  const fetchGuias = async () => {
    try {
      const response = await axios.get('/api/admin/guias');
      setGuias(response.data);
    } catch (error) {
      console.error('Error al obtener guías:', error.message);
      setError('Error al obtener guías.');
    }
  };
 //obtener rutas
  const fetchRutas = async () => {
    try {
      const response = await axios.get('/api/admin/rutas');
      setRutas(response.data);
    } catch (error) {
      console.error('Error al obtener rutas:', error.message);
      setError('Error al obtener rutas.');
    }
  };

  //obtener transportes
  const fetchTransportes = async () => {
    try {
      const response = await axios.get('/api/admin/guias/transportes');
      setTransportes(response.data);
    } catch (error) {
      console.error('Error al obtener transportes:', error.message);
      setError('Error al obtener transportes.');
    }
  };

  //crear guia
  const handleCrearGuia = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/guias', { correo, nombre, contraseña });
      setCorreo('');
      setNombre('');
      setContraseña('');
      setMensaje('Guía creado con éxito');
      fetchGuias();
    } catch (error) {
      console.error('Error al crear guía:', error.message);
      setError('Error al crear guía.');
    }
  };

  //eliminar guia
  const handleEliminarGuia = async (correo) => {
    try {
      await axios.delete(`/api/admin/guias/${correo}`);
      setMensaje('Guía eliminado con éxito');
      fetchGuias();
    } catch (error) {
      console.error('Error al eliminar guía:', error.message);
      setError('Error al eliminar guía.');
    }
  };

// asignar ruta  
  const handleAsignarRuta = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/guias/asignarruta', {
        correo_usuario: guiaSeleccionado,
        nombre: nombreRuta
      });
      console.log('Transporte asignado:', response.data);
    } catch (error) {
      console.error('Error al asignar el transporte:', error.message);
    }
  };

//asignar tranquioirte
  const handleAsignarTransporte = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/guias/asignartransporte', {
        correo_usuario: guiaSeleccionado,
        patente: patenteTransporte
      });
      console.log('Transporte asignado:', response.data);
    } catch (error) {
      console.error('Error al asignar el transporte:', error.message);
    }
  };

 return (
  
  <div>
     <header className="app-header">
      <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
      <h1>NaturalTrekking</h1>
    </header>
  <h1>Gestión de Guías</h1>

  {error && <p className="error">{error}</p>}
  {mensaje && <p className="success">{mensaje}</p>}

  <h2>Crear Guía</h2>
  <form onSubmit={handleCrearGuia}>
    <label>
      Correo:
      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
    </label>
    <label>
      Nombre:
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
    </label>
    <label>
      Contraseña:
      <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
    </label>
    <button type="submit" className='boton-agregar'>
      <img src='/img/agregar-usuario.png' alt="Crear Guía"/>Crear Guía
    </button>
  </form>

  <h2>Lista de Guías</h2>
  <table>
    <thead>
      <tr>
        <th>Correo</th>
        <th>Nombre</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {guias.map((guia) => (
        <tr key={guia.correo}>
          <td>{guia.correo}</td>
          <td>{guia.nombre}</td>
          <td>
            <button onClick={() => handleEliminarGuia(guia.correo)} className='boton-eliminar'>
              <img src='/img/eliminar.png' alt="Eliminar"/>Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <h2>Asignar Ruta</h2>
  {error && <p className="error">{error}</p>}
  {mensaje && <p className="success">{mensaje}</p>}
  <form onSubmit={handleAsignarRuta} className='formulario'>
    <label>
      Nombre de la Ruta:
      <select value={nombreRuta} onChange={(e) => setNombreRuta(e.target.value)} required>
        <option value="">Seleccione una ruta</option>
        {rutas.map((ruta) => (
          <option key={ruta.id} value={ruta.nombre}>{ruta.nombre}</option>
        ))}
      </select>
    </label>
    <label>
      Guía:
      <select value={guiaSeleccionado} onChange={(e) => setGuiaSeleccionado(e.target.value)} required>
        <option value="">Seleccione un guía</option>
        {guias.map((guia) => (
          <option key={guia.correo} value={guia.correo}>{guia.nombre} ({guia.correo})</option>
        ))}
      </select>
    </label>
    <button type="submit" className='boton-agregar'>
      <img src='/img/agregar.png' alt="Asignar Ruta"/>Asignar Ruta
    </button>
  </form>

  <h2>Asignar Transporte</h2>
  {error && <p className="error">{error}</p>}
  {mensaje && <p className="success">{mensaje}</p>}
  <form onSubmit={handleAsignarTransporte} className='formulario' >
    <label>
      Patente del Transporte:
      <select value={patenteTransporte} onChange={(e) => setPatenteTransporte(e.target.value)} required>
        <option value="">Seleccione un transporte</option>
        {transportes.map((transporte) => (
          <option key={transporte.id} value={transporte.patente}>{transporte.patente}</option>
        ))}
      </select>
    </label>
    <label>
      Guía:
      <select value={guiaTransporteSeleccionado} onChange={(e) => setGuiaTransporteSeleccionado(e.target.value)} required>
        <option value="">Seleccione un guía</option>
        {guias.map((guia) => (
          <option key={guia.correo} value={guia.correo}>{guia.nombre} ({guia.correo})</option>
        ))}
      </select>
    </label>
    <button type="submit" className='boton-agregar'>
      <img src='/img/agregar.png' alt="Asignar Transporte"/>Asignar Transporte
    </button>
  </form>

  <h2>Lista de Guías</h2>
  <ul className='lista-guias'>
    {guias.map((guia) => (
      <li key={guia.correo}>
        {guia.nombre} ({guia.correo})
        <button onClick={() => handleEliminarGuia(guia.correo)} className='boton-eliminar'>
          <img src='/img/eliminar.png' alt="Eliminar"/>Eliminar</button>
      </li>
    ))}
  </ul>
</div>

);
};

export default ManejoGuias;