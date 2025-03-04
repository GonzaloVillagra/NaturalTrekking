import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import MapaRuta from './MapaRuta';
import '../css/guiaPanel.css';

const GuiaDashboard = ({ correo }) => {
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [rutas, setRutas] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [rutaGps, setRutaGps] = useState([]);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [comentario, setComentario] = useState('');
  const [nombreRuta, setNombreRuta] = useState('');

  useEffect(() => {
    if (!correo) {
      setError('Correo no proporcionado.');
      return;
    }
 //obtener guia
    const fetchGuia = async () => {
      try {
        const responseGuias = await axios.get(`/api/guias/guia/${correo}`);
        if (responseGuias.data.length > 0) {
          setNombre(responseGuias.data[0].nombre);
        } else {
          setError('No se encontró el guía.');
        }
      } catch (error) {
        console.error('Error al obtener guías:', error.message);
        setError('Error al obtener guías.');
      }
    };

    //obtener rutas
    const fetchRutas = async () => {
      try {
        const responseRutas = await axios.get(`/api/guias/ruta/${correo}`);
        if (responseRutas.data.length > 0) {
          setRutas(responseRutas.data);

          setRutaGps(responseRutas.data[0].coordenadas);
        } else {
          setError('No se encontraron rutas para este correo.');
        }
      } catch (error) {
        console.error('Error al obtener rutas:', error.message);
        setError('Error al obtener rutas.');
      }
    };

    //obtener transportes
    const fetchTransportes = async () => {
      try {
        const responseTransportes = await axios.get(`/api/guias/transportes/${correo}`);
        if (responseTransportes.data.length > 0) {
          setTransportes(responseTransportes.data);
        } else {
          setError('No se encontraron transportes para este correo.');
        }
      } catch (error) {
        console.error('Error al obtener transportes:', error.message);
        setError('Error al obtener transportes.');
      }
    };

    fetchGuia();
    fetchRutas();
    fetchTransportes();
  }, [correo]);

  //seguir ruta
  const handleSeguirRuta = () => {
    if (rutaGps.length > 0) {
      setUbicacionActual(rutaGps[0]); 
    }
  };

  //agrergar comentario
  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/guias/comentarios', {
        nombre_ruta: nombreRuta,
        correo_usuario: correo,
        comentario,
      });
      setComentario('');
      setNombreRuta('');
      alert('Comentario enviado con éxito');
    } catch (error) {
      console.error('Error al enviar comentario:', error.message);
      setError('Error al enviar comentario.');
    }
  };

  /******************************Visualizaciones************************************/
  return (
    <div>
       <header className='app-header'>
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>Natural Trekking</h1>
      </header>
      
      <h1>Panel de guías</h1>
      <h2>Bienvenido {nombre}</h2>
      {error && <p>{error}</p>}
      <h2>Rutas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Distancia (km)</th>
            <th>Tiempo Estimado</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta, index) => (
            <tr key={index}>
              <td>{ruta.nombre}</td>
              <td>{ruta.descripcion}</td>
              <td>{ruta.distancia_km}</td>
              <td>{ruta.tiempo_estimado}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Transportes</h2>
      <table>
        <thead>
        </thead>
        <tbody>
          {transportes.map((transporte, index) => (
            <tr key={index}>
              <td>{transporte.patente}</td>
              <td>{transporte.vehiculo}</td>
              <td>{transporte.nombre_conductor}</td>             
              <td>{transporte.lugar_partida}</td>
              <td>{transporte.hora_partida}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Mapa de la Ruta</h2>
      <MapaRuta rutaGps={rutaGps} ubicacionActual={ubicacionActual} />
      <button onClick={handleSeguirRuta} className='boton-play'><img src='/img/play.png' alt="seguir ruta"/>Seguir Ruta</button>
      <h2>Comentarios</h2>
      <form onSubmit={handleComentarioSubmit}>
        <label>
          Nombre de la Ruta:
          <input
            type="text"
            value={nombreRuta}
            onChange={(e) => setNombreRuta(e.target.value)}
            required
          />
        </label>
        <label>
          Comentario:
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
          />
        </label>
        <button type="submit"className='boton-comentario'>Enviar Comentario</button>
      </form>
    </div>
  );
};


export default GuiaDashboard;