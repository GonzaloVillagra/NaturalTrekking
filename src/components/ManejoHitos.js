import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const ManejoHitos = ({ nombreRuta }) => {
  const [nombreHito, setNombreHito] = useState('');
  const [descripcionHito, setDescripcionHito] = useState('');
  const [imagenUrlHito, setImagenUrlHito] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const handleGetLocation = () => {
    setLoadingLoc(true);
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada');
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLoc(false);
        alert('Ubicación obtenida exitosamente');
      },
      (err) => {
        alert(`Error al obtener la ubicación: ${err.message}`);
        setLoadingLoc(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ubicacion) {
      alert('Primero debes obtener tu ubicación');
      return;
    }

    try {
      await axios.post('/api/admin/hitos', {
        nombre: nombreHito,
        descripcion: descripcionHito,
        ubicacion: `POINT(${ubicacion.lng} ${ubicacion.lat})`, 
        imagen_url: imagenUrlHito,
        nombre_ruta: nombreRuta
      });
      alert('Hito agregado correctamente!');
      setNombreHito('');
      setDescripcionHito('');
      setImagenUrlHito('');
      setUbicacion(null);
    } catch (error) {
      console.error('Error al agregar el hito:', error);
    }
  };

  return (
    <div>
      <header className="app-header">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>NaturalTrekking</h1>
      </header>
      <div className="admin-panel" style={{margin: 'auto', maxWidth: '600px'}}>
        <h2>Gestión de Hitos</h2>
        <button type="button" onClick={handleGetLocation} disabled={loadingLoc} style={{marginBottom: '15px'}}>
          {loadingLoc ? 'Obteniendo ubicación...' : 'Obtener mi ubicación'}
        </button>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <input type="text" value={nombreRuta || ''} placeholder="Nombre de la ruta (opcional)" onChange={() => {}} disabled={!!nombreRuta} />
          <input type="text" value={nombreHito} onChange={e => setNombreHito(e.target.value)} placeholder="Nombre del hito" required />
          <textarea value={descripcionHito} onChange={e => setDescripcionHito(e.target.value)} placeholder="Descripción del hito" required />
          <input type="text" value={imagenUrlHito} onChange={e => setImagenUrlHito(e.target.value)} placeholder="URL de la imagen" required />
          <button type="submit">Agregar Hito</button>
        </form>
      </div>
    </div>
  );
};

export default ManejoHitos;
