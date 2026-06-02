import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { registerPlugin } from '@capacitor/core';
import axios from '../api/axiosConfig';

const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");

export const RutaContext = createContext();

export const useRuta = () => useContext(RutaContext);

export const RutaProvider = ({ children }) => {
  // States de Grabación
  const [seguimientoActivo, setSeguimientoActivo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rutaGps, setRutaGps] = useState([]);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [tiempoGrabacion, setTiempoGrabacion] = useState(0);
  const [watchId, setWatchId] = useState(null);
  
  // States de Hitos
  const [hitosLocales, setHitosLocales] = useState([]);

  // Cronómetro
  const intervaloRef = useRef(null);
  useEffect(() => {
    if (seguimientoActivo && !isPaused) {
      intervaloRef.current = setInterval(() => {
        setTiempoGrabacion(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervaloRef.current);
    }
    return () => clearInterval(intervaloRef.current);
  }, [seguimientoActivo, isPaused]);

  // Logica de Grabación
  const iniciarRuta = () => {
    
    if (isPaused) {
      setIsPaused(false);
    } else {
      setSeguimientoActivo(true);
      setTiempoGrabacion(0);
      setRutaGps([]);
      setHitosLocales([]);
    }

    BackgroundGeolocation.addWatcher(
      {
        requestPermissions: true,
        stale: false,
        distanceFilter: 5
      },
      (position, error) => {
        if (error) {
          if (error.code === "NOT_AUTHORIZED") {
             if (window.confirm("Esta app necesita permisos de ubicación 'Todo el tiempo' para grabar la ruta con la pantalla apagada. ¿Abrir configuración?")) {
                 BackgroundGeolocation.openSettings();
             }
          }
          console.error('Error de GPS: ' + error.message);
          return;
        }
        
        if (position) {
          const nuevaUbicacion = { lat: position.latitude, lng: position.longitude };
          setRutaGps((prev) => [...prev, nuevaUbicacion]);
          setUbicacionActual(nuevaUbicacion);
        }
      }
    ).then((id) => {
      setWatchId(id);
    });
  };

  const pausarRuta = () => {
    setIsPaused(true);
    if (watchId) {
      BackgroundGeolocation.removeWatcher({ id: watchId });
      setWatchId(null);
    }
  };

  const resetRuta = () => {
    pausarRuta();
    setSeguimientoActivo(false);
    setTiempoGrabacion(0);
    setRutaGps([]);
    setHitosLocales([]);
    setUbicacionActual(null);
  };

  const calcularDistancia = (puntos) => {
    if (!puntos || puntos.length < 2) return 0;
    const R = 6371; 
    const toRad = (value) => (value * Math.PI) / 180;
    let dTotal = 0;
    for (let i = 1; i < puntos.length; i++) {
      const { lat: lat1, lng: lng1 } = puntos[i - 1];
      const { lat: lat2, lng: lng2 } = puntos[i];
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      dTotal += R * c;
    }
    return parseFloat(dTotal.toFixed(2));
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const simularPasoGps = () => {
    setRutaGps((prev) => {
      const ultimoPunto = prev.length > 0 ? prev[prev.length - 1] : { lat: -33.4569, lng: -70.6482 };
      const nuevoPunto = { 
        lat: ultimoPunto.lat + 0.001,
        lng: ultimoPunto.lng + 0.001
      };
      setUbicacionActual(nuevoPunto);
      return [...prev, nuevoPunto];
    });
  };

  const currentDist = calcularDistancia(rutaGps);

  return (
    <RutaContext.Provider value={{
      seguimientoActivo, setSeguimientoActivo,
      isPaused, setIsPaused,
      rutaGps, setRutaGps,
      ubicacionActual, setUbicacionActual,
      tiempoGrabacion, setTiempoGrabacion,
      hitosLocales, setHitosLocales,
      iniciarRuta, pausarRuta, resetRuta,
      calcularDistancia, formatTime, currentDist, simularPasoGps
    }}>
      {children}
    </RutaContext.Provider>
  );
};
