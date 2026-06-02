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

const MapaRuta = ({ rutaGps, seguirRuta, hitos, height = '400px' }) => {
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
  }, [rutaGps]);

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

  const hitoIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  const coordenadas = Array.isArray(rutaGps)
    ? rutaGps.map(({ lat, lng }) => [lat, lng])
    : [];

  const compartirHito = async (hito) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${hito.lat},${hito.lng}`;
    const text = `Punto de Interés: ${hito.nombre}\n\nUbicación: ${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: hito.nombre,
          text: text,
          url: url
        });
      } catch (e) {
        console.error('Error compartiendo', e);
      }
    } else {
      window.open(url, '_blank');
    }
  };

  // Determinar centro del mapa
  const centroMapa = ubicacionActual || 
                     (coordenadas.length > 0 ? coordenadas[0] : null) || 
                     (hitos && hitos.length > 0 ? [hitos[0].lat, hitos[0].lng] : [0, 0]);

    /******************************Visualizaciones************************************/
   return (
    <div style={{width: '100%', height: '100%'}}>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <MapContainer
      center={centroMapa}
      zoom={15}
      style={{ width: '100%', height: height, zIndex: 1 }}
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
      
      {/* Renderizar Hitos */}
      {hitos && hitos.length > 0 && hitos.map(hito => (
        <Marker key={hito.id} position={[hito.lat, hito.lng]} icon={hitoIcon}>
          <Popup>
            <div style={{textAlign: 'center', minWidth: '150px'}}>
              <h3 style={{margin: '0 0 5px 0', color: '#10b981'}}>{hito.nombre}</h3>
              <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#333', maxHeight: '100px', overflowY: 'auto'}}>{hito.descripcion}</p>
              {hito.imagen_url && (
                <img src={hito.imagen_url} alt={hito.nombre} style={{width: '100%', borderRadius: '8px', maxHeight: '100px', objectFit: 'cover'}} />
              )}
              <button 
                onClick={() => compartirHito(hito)}
                style={{marginTop:'10px', background:'#3b82f6', color:'white', border:'none', padding:'8px', width:'100%', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}
              >
                Compartir Ubicación
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);
};



export default MapaRuta;