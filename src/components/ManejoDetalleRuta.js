import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axiosConfig';
import { useParams } from 'react-router-dom';
import MapaRuta from './MapaRuta';
import '../css/detalleRutaPanel.css';

const DetalleDeRuta = () => {
  const [detalle, setDetalle] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [error, setError] = useState('');
  const { nombre } = useParams();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener detalles de la ruta
  const fetchDetalle = useCallback(async () => {
    setError('');
    try {
      const response = await axios.get(`/api/admin/ruta/${nombre}`);
      setDetalle(response.data);
    } catch (error) {
      setError(`Error al cargar detalles de la ruta: ${error.message}`);
      console.error('Error al cargar detalles de la ruta:', error);
    }
  }, [nombre]);

  const fetchComentarios = useCallback(async () => {
    try {
      const response = await axios.get(`/api/admin/comentario/${nombre}`);
      setComentarios(response.data);
    } catch (error) {
      setError(`Error al cargar comentarios de la ruta: ${error.message}`);
      console.error('Error al cargar comentarios de la ruta:', error);
    }
  }, [nombre]);

  useEffect(() => {
    fetchDetalle();
    fetchComentarios();
  }, [fetchDetalle, fetchComentarios]);

  return (
    <div>
      <header className="app-header">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>NaturalTrekking</h1>
      </header>
      {error && <p className="error">{error}</p>}
      {detalle ? (
        <>
          <h1>{detalle.nombre}</h1>
          <p>{detalle.descripcion}</p>
          <p className="dificultad">Dificultad: {detalle.dificultad}</p>
          <p className="distancia">Distancia: {detalle.distancia_km} km</p>
          <p className="tiempo de ruta">Distancia: {detalle.tiempo_estimado}</p>
          {detalle.ruta_gps && <MapaRuta rutaGps={detalle.ruta_gps} />}
          <div>
          <h2>Comentarios</h2>
      {comentarios.map((comentario, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <p>{comentario.comentario}</p>
          <p style={{ fontSize: '0.8em', color: 'gray' }}>
            {formatDate(comentario.fecha_comentario)} 
          </p>
        </div>
      ))}
    </div>
      </>
    ) : <p>Cargando detalles de la ruta...</p>}
  </div>
  );
};

export default DetalleDeRuta;
