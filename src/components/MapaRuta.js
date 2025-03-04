import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ActualizarVista = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15); 
    }
  }, [center, map]);
  return null;
};

const MapaRuta = ({ rutaGps, seguirRuta }) => {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [error, setError] = useState('');

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacionActual({
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

  useEffect(() => {
    obtenerUbicacion();
  }, []);

  useEffect(() => {
    if (seguirRuta) {
        console.log("Iniciando seguimiento en el mapa");

      const intervalId = setInterval(() => {
        console.log("Actualizando ubicación en el mapa...");
      }, 1000); 

      return () => {
        clearInterval(intervalId);
        console.log("Deteniendo seguimiento en el mapa");
      };
    }
  }, [seguirRuta, ubicacionActual]);

  const customIcon = new L.Icon({
    iconUrl: '/img/pin.png', 
    iconSize: [40, 40], 
  });

  const coordenadas = Array.isArray(rutaGps)
    ? rutaGps.map(({ lat, lng }) => [lat, lng])
    : [];

    /******************************Visualizaciones************************************/
   return (
    <div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <MapContainer
      center={ubicacionActual || [0, 0]}
      zoom={15}
      style={{ width: '100%', height: '400px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors'
      />
      {ubicacionActual && <ActualizarVista center={ubicacionActual} />}
      {coordenadas.length > 0 && <Polyline positions={coordenadas} color="blue" />}
      {ubicacionActual && (
        <Marker position={[ubicacionActual.lat, ubicacionActual.lng]} icon={customIcon}>
          <Popup>¡Estás aquí!</Popup>
        </Marker>
      )}
    </MapContainer>
  </div>
);
};



export default MapaRuta;