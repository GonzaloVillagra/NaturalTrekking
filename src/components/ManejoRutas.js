import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { registerPlugin } from '@capacitor/core';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import MapaRuta from './MapaRuta';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Camera, Square, Footprints } from 'lucide-react';
import '../css/rutasPanel.css';
import { useRuta } from '../context/RutaContext';

const ManejoRutas = () => {
  const navigate = useNavigate();
  
  // States from Context
  const {
    seguimientoActivo, setSeguimientoActivo,
    isPaused, setIsPaused,
    rutaGps, setRutaGps,
    ubicacionActual,
    tiempoGrabacion,
    hitosLocales, setHitosLocales,
    iniciarRuta, pausarRuta, resetRuta,
    formatTime, currentDist, simularPasoGps
  } = useRuta();
  

  
  // States de Hitos y Ruta Final

  const [datosRuta, setDatosRuta] = useState({ nombre: '', dificultad: 'baja', descripcion: '' });
  const [nombreHito, setNombreHito] = useState('');
  const [descripcionHito, setDescripcionHito] = useState('');
  const [fotoHitoUrl, setFotoHitoUrl] = useState(null);
  
  // Modales y Mensajes
  const [isHitoModalOpen, setIsHitoModalOpen] = useState(false);
  const [isRutaModalOpen, setIsRutaModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const correoGuia = localStorage.getItem('correo');



  // BOTON STOP
  const prepararFinalizarRuta = () => {
    pausarRuta();
    if (rutaGps.length < 2) {
      setError('No hay suficientes puntos GPS grabados para guardar la ruta.');
      setSeguimientoActivo(false);
      return;
    }
    // Abrir modal de datos de ruta
    setIsRutaModalOpen(true);
  };

  const guardarRutaFinal = async () => {
    if (!datosRuta.nombre || !datosRuta.descripcion) {
      setError('Por favor, ingresa el nombre y la descripción de la ruta.');
      return;
    }

    const geojsonRuta = { type: 'LineString', coordinates: rutaGps.map(p => [p.lng, p.lat]) };
    
    const payloadRuta = {
      ...datosRuta,
      distancia_km: currentDist,
      tiempo_estimado: formatTime(tiempoGrabacion), 
      correo_usuario: correoGuia, 
      ruta_gps: JSON.stringify(geojsonRuta),
    };

    try {
      await axios.post('/api/admin/rutas/', payloadRuta);
      for (let hito of hitosLocales) {
        const wktPoint = `POINT(${hito.lng} ${hito.lat})`;
        await axios.post('/api/admin/hitos', {
          nombre: hito.nombre, descripcion: hito.descripcion,
          ubicacion: wktPoint, imagen_url: hito.imagen_url,
          nombre_ruta: datosRuta.nombre
        });
      }
      setMensaje('¡Ruta guardada en la nube con éxito!');
      setTimeout(() => navigate('/admin/rutas'), 2000);
    } catch (error) {
      console.error('Offline save', error);
      const pendientes = JSON.parse(localStorage.getItem('rutas_pendientes')) || [];
      pendientes.push({ ruta: payloadRuta, hitos: hitosLocales });
      localStorage.setItem('rutas_pendientes', JSON.stringify(pendientes));
      setMensaje('Offline: Ruta guardada en tu celular.');
      setTimeout(() => navigate('/admin/rutas'), 2000);
    }
    
    resetRuta();
    setIsRutaModalOpen(false);
  };

  // CAPTURA DE HITOS
  const abrirCamaraHito = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: 'REAR' // Camara trasera por defecto
      });
      setFotoHitoUrl(image.dataUrl);
      setNombreHito('');
      setDescripcionHito('');
      setIsHitoModalOpen(true);
    } catch (e) {
      console.error("Error al abrir la cámara", e);
      setError("No se pudo abrir la cámara.");
    }
  };

  const guardarHitoModal = () => {
    if(!nombreHito || !descripcionHito) {
      setError("Completa nombre y nota del hito");
      return;
    }
    const ubicacionHito = ubicacionActual || { lat: -33.4569, lng: -70.6482 }; // fallback
    setHitosLocales(prev => [...prev, { ...ubicacionHito, nombre: nombreHito, descripcion: descripcionHito, imagen_url: fotoHitoUrl }]);
    setIsHitoModalOpen(false);
    setFotoHitoUrl(null);
    setError('');
  };



  return (
    <div style={{height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', background: '#000'}}>
      
      {/* Botón Volver Flotante y Transparente (NO PAUSA LA RUTA) */}
      <button 
        style={{position: 'absolute', top: '15px', right: '15px', zIndex: 9999, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(5px)'}}
        onClick={() => navigate('/admin/rutas')}
      >
        <ArrowLeft size={24} />
      </button>

      {/* Mapa a Pantalla Completa */}
      <div style={{height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        <MapaRuta rutaGps={rutaGps} ubicacionActual={ubicacionActual} hitos={hitosLocales} height="100%" />
      </div>

      {/* HUD (Heads Up Display) */}
      {seguimientoActivo && (
        <div className="hud-top" style={{position: 'absolute', zIndex: 9999, top: '15px'}}>
          <div className="hud-stat">
            <span>Tiempo</span>
            <strong>{formatTime(tiempoGrabacion)}</strong>
          </div>
          <div className="hud-stat" style={{borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)'}}>
            <span>Distancia</span>
            <strong>{currentDist} km</strong>
          </div>
          <div className="hud-stat">
            <span>Hitos</span>
            <strong>{hitosLocales.length}</strong>
          </div>
        </div>
      )}

      {/* Mensajes de feedback flotantes */}
      {mensaje && <div style={{position:'absolute', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--accent-color)', color:'white', padding:'10px 20px', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.3)'}}>{mensaje}</div>}
      {error && <div style={{position:'absolute', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--danger-color)', color:'white', padding:'10px 20px', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.3)'}}>{error}</div>}

      {/* Controles Flotantes Inferiores */}
      <div style={{position: 'absolute', bottom: '30px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', zIndex: 9999}}>
        
        {!seguimientoActivo ? (
          // Botón INICIAR GIGANTE
          <button 
            onClick={iniciarRuta}
            style={{background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '50px', padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 15px rgba(34, 197, 94, 0.4)', cursor: 'pointer', transition: 'all 0.3s ease'}}
          >
            <Play size={24} /> EMPEZAR RUTA
          </button>
        ) : (
          // Controles de grabación
          <>
            {/* PAUSA / REANUDAR */}
            {isPaused ? (
              <button onClick={iniciarRuta} style={{background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
                <Play size={32} style={{marginLeft: '4px'}} />
              </button>
            ) : (
              <button onClick={pausarRuta} style={{background: '#f59e0b', color: 'white', border: 'none', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
                <Pause size={32} />
              </button>
            )}

            {/* STOP / TERMINAR */}
            <button onClick={prepararFinalizarRuta} style={{background: 'var(--danger-color)', color: 'white', border: 'none', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'}}>
              <Square size={28} />
            </button>

            {/* CAMARA (HITO) */}
            <button onClick={abrirCamaraHito} disabled={isPaused} style={{background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', opacity: isPaused ? 0.5 : 1}}>
              <Camera size={32} />
            </button>
          </>
        )}
      </div>

      {/* Modal Datos de Hito */}
      {isHitoModalOpen && (
        <div className="modal-overlay" style={{zIndex: 10000}}>
          <div className="modal-content glass-panel" style={{width: '90%', maxWidth: '400px'}}>
            <h3 style={{marginTop: 0, color: 'var(--accent-color)'}}>Detalles del Hito</h3>
            {fotoHitoUrl && (
              <div style={{width: '100%', height: '150px', borderRadius: '8px', backgroundImage: `url(${fotoHitoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '15px'}} />
            )}
            <label>Nombre del Hito:
              <input type="text" value={nombreHito} onChange={(e)=>setNombreHito(e.target.value)} placeholder="Ej: Mirador Cóndor" />
            </label>
            <label>Descripción / Nota:
              <textarea value={descripcionHito} onChange={(e)=>setDescripcionHito(e.target.value)} placeholder="Ej: Vista despejada al valle..." rows="3" />
            </label>
            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button className="danger" onClick={() => { setIsHitoModalOpen(false); setFotoHitoUrl(null); }}>Cancelar</button>
              <button className="primary" onClick={guardarHitoModal} style={{flex:1}}>Guardar Hito</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Datos de Ruta Final */}
      {isRutaModalOpen && (
        <div className="modal-overlay" style={{zIndex: 10000}}>
          <div className="modal-content glass-panel" style={{width: '90%', maxWidth: '400px'}}>
            <h3 style={{marginTop: 0, color: 'var(--accent-color)'}}>¡Ruta Terminada!</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Recorriste {currentDist} km en {formatTime(tiempoGrabacion)}. Ingresa los datos finales para guardarla.</p>
            
            <label>Nombre de Ruta:
              <input type="text" value={datosRuta.nombre} onChange={(e) => setDatosRuta({...datosRuta, nombre: e.target.value})} placeholder="Ej: Sendero Los Peumos" required />
            </label>
            <label>Dificultad:
              <select value={datosRuta.dificultad} onChange={(e) => setDatosRuta({...datosRuta, dificultad: e.target.value})}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
            <label>Descripción:
              <textarea value={datosRuta.descripcion} onChange={(e) => setDatosRuta({...datosRuta, descripcion: e.target.value})} placeholder="Detalles de la ruta..." rows="3" required />
            </label>
            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button className="danger" onClick={() => setIsRutaModalOpen(false)}>Cancelar</button>
              <button className="primary" onClick={guardarRutaFinal} style={{flex:1}}>Subir Ruta</button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default ManejoRutas;
