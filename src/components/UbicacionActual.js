import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


//Ubicacion Actual del gps
const UbicacionActual = () => {
  const [ubicacion, setUbicacion] = useState(null); 
  const [error, setError] = useState(''); 
  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError('');
      },
      (error) => {
        setError('Error al obtener la ubicación: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div>
      <h2>Ubicación Actual</h2>
      <button onClick={obtenerUbicacion}>Mostrar Mi Ubicación</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {ubicacion ? (
        <MapContainer
          center={[ubicacion.lat, ubicacion.lng]}
          zoom={15}
          style={{ width: '100%', height: '400px', marginTop: '20px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[ubicacion.lat, ubicacion.lng]}>
            <Popup>¡Estás aquí!</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>No se ha obtenido la ubicación aún.</p>
      )}
    </div>
  );
};

export default UbicacionActual;
