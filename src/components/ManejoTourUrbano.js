import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Save, MapPin, Search, Loader, X } from 'lucide-react';

// Corrección para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Componente para capturar clics en el mapa
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ManejoTourUrbano = () => {
  const navigate = useNavigate();
  const [hitos, setHitos] = useState([]);
  const [ubicacionActual, setUbicacionActual] = useState({ lat: -33.4489, lng: -70.6693 }); // Santiago por defecto
  
  // Estado para el modal del nuevo punto
  const [nuevoPunto, setNuevoPunto] = useState(null); // { lat, lng }
  const [nombreHito, setNombreHito] = useState('');
  const [descripcionHito, setDescripcionHito] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Estado del modal de guardar tour final
  const [isGuardarModalOpen, setIsGuardarModalOpen] = useState(false);
  const [nombreTour, setNombreTour] = useState('');
  const [descripcionTour, setDescripcionTour] = useState('');
  const [isSavingTour, setIsSavingTour] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const correoGuia = localStorage.getItem('correo');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUbicacionActual({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn('Ubicación no permitida, usando por defecto')
      );
    }
  }, []);

  const handleMapClick = (latlng) => {
    setNuevoPunto(latlng);
    setNombreHito('');
    setDescripcionHito('');
    setError('');
  };

  const buscarEnWikipedia = async () => {
    if (!nombreHito) {
      setError('Escribe un nombre antes de buscar.');
      return;
    }
    setIsSearching(true);
    setError('');
    try {
      // Buscar el término en la API de Wikipedia (en español)
      const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nombreHito)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.extract) {
          setDescripcionHito(data.extract);
        } else {
          setError('No se encontró una descripción detallada en Wikipedia.');
        }
      } else {
        setError('Lugar no encontrado en Wikipedia. Intenta con un nombre más genérico.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con Wikipedia.');
    } finally {
      setIsSearching(false);
    }
  };

  const agregarHito = () => {
    if (!nombreHito) {
      setError('El nombre del punto es obligatorio.');
      return;
    }
    setHitos(prev => [...prev, {
      id: Date.now(),
      lat: nuevoPunto.lat,
      lng: nuevoPunto.lng,
      nombre: nombreHito,
      descripcion: descripcionHito
    }]);
    setNuevoPunto(null);
  };

  const guardarTourUrbano = async () => {
    if (!nombreTour || !descripcionTour) {
      setError('Ingresa el nombre y descripción del tour.');
      return;
    }
    if (hitos.length === 0) {
      setError('Debes agregar al menos un punto de interés en el mapa.');
      return;
    }

    setIsSavingTour(true);
    setError('');

    try {
      // Guardar la Ruta de Tipo Urbano
      const resRuta = await axios.post('/api/admin/rutas/', {
        nombre: nombreTour,
        descripcion: descripcionTour,
        distancia_km: 0,
        tiempo_estimado: 'N/A',
        dificultad: 'baja',
        correo_usuario: correoGuia,
        tipo_ruta: 'urbano'
      });

      // Guardar los hitos asociados
      for (let hito of hitos) {
        const wktPoint = `POINT(${hito.lng} ${hito.lat})`;
        await axios.post('/api/admin/hitos', {
          nombre: hito.nombre, 
          descripcion: hito.descripcion,
          ubicacion: wktPoint, 
          imagen_url: '', // Sin imagen por ahora en tour urbano admin
          nombre_ruta: nombreTour
        });
      }

      setMensaje('¡Tour Urbano creado exitosamente!');
      setTimeout(() => navigate('/admin/tours'), 2000);
    } catch (err) {
      console.error('Error al guardar tour urbano:', err);
      setError('Error al guardar el Tour Urbano. Inténtalo de nuevo.');
    } finally {
      setIsSavingTour(false);
    }
  };

  return (
    <div style={{height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative'}}>
      
      {/* Botón Volver */}
      <button 
        style={{position: 'absolute', top: '15px', left: '15px', zIndex: 9999, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(5px)'}}
        onClick={() => navigate('/admin/tours')}
      >
        <ArrowLeft size={24} />
      </button>

      {/* HUD Info */}
      <div style={{position: 'absolute', top: '15px', right: '15px', zIndex: 9999, background: 'rgba(0,0,0,0.6)', color:'white', padding:'10px 20px', borderRadius:'20px', backdropFilter:'blur(5px)', display:'flex', alignItems:'center', gap:'10px'}}>
        <MapPin size={18} color="var(--accent-color)" /> {hitos.length} Puntos Marcados
      </div>

      {/* Mensajes */}
      {error && <div style={{position:'absolute', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--danger-color)', color:'white', padding:'10px 20px', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.3)'}}>{error}</div>}
      {mensaje && <div style={{position:'absolute', top:'80px', left:'50%', transform:'translateX(-50%)', zIndex:9999, background:'var(--accent-color)', color:'white', padding:'10px 20px', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.3)'}}>{mensaje}</div>}

      {/* Mapa */}
      <div style={{height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        <MapContainer center={[ubicacionActual.lat, ubicacionActual.lng]} zoom={14} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Marcadores Creados */}
          {hitos.map(h => (
            <Marker key={h.id} position={[h.lat, h.lng]}>
              <Popup>
                <div style={{textAlign:'center'}}>
                  <h3 style={{margin:'0 0 5px', color:'var(--accent-color)'}}>{h.nombre}</h3>
                  <p style={{margin:0, fontSize:'0.9rem'}}>{h.descripcion.substring(0,100)}...</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marcador Temporal */}
          {nuevoPunto && (
            <Marker position={[nuevoPunto.lat, nuevoPunto.lng]} opacity={0.5}></Marker>
          )}
        </MapContainer>
      </div>

      {/* Botón Finalizar */}
      {hitos.length > 0 && !nuevoPunto && !isGuardarModalOpen && (
        <div style={{position: 'absolute', bottom: '30px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999}}>
          <button 
            onClick={() => setIsGuardarModalOpen(true)}
            style={{background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '50px', padding: '15px 40px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 15px rgba(34, 197, 94, 0.4)', cursor: 'pointer', transition: 'all 0.3s ease'}}
          >
            <Save size={24} /> GUARDAR TOUR URBANO
          </button>
        </div>
      )}

      {/* Instrucción inicial */}
      {hitos.length === 0 && !nuevoPunto && (
        <div style={{position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '15px 30px', borderRadius: '30px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'10px'}}>
          <MapPin /> Toca el mapa para agregar un punto de interés
        </div>
      )}

      {/* Modal Nuevo Punto */}
      {nuevoPunto && (
        <div className="modal-overlay" style={{zIndex: 10000}}>
          <div className="modal-content glass-panel" style={{width: '90%', maxWidth: '400px', position:'relative'}}>
            <button onClick={() => setNuevoPunto(null)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
              <X size={24} />
            </button>
            <h3 style={{marginTop: 0, color: 'var(--accent-color)', display:'flex', alignItems:'center', gap:'10px'}}>
              <MapPin /> Nuevo Punto de Interés
            </h3>
            
            <label>Nombre del Lugar:
              <input type="text" value={nombreHito} onChange={(e)=>setNombreHito(e.target.value)} placeholder="Ej: Palacio de La Moneda" style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ccc'}} />
            </label>
            
            <button 
              onClick={buscarEnWikipedia} 
              disabled={isSearching}
              style={{width:'100%', padding:'10px', marginTop:'10px', background:'#3b82f6', color:'white', border:'none', borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer'}}
            >
              {isSearching ? <Loader className="spin" size={18} /> : <Search size={18} />} 
              Autocompletar con Wikipedia
            </button>

            <label style={{marginTop:'15px', display:'block'}}>Descripción:
              <textarea value={descripcionHito} onChange={(e)=>setDescripcionHito(e.target.value)} placeholder="Resumen histórico o descripción..." rows="4" style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ccc', resize:'none'}} />
            </label>

            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button className="primary" onClick={agregarHito} style={{flex:1, padding:'12px', fontSize:'1.1rem', borderRadius:'8px', border:'none', background:'var(--accent-color)', color:'white', cursor:'pointer'}}>
                Fijar Punto en el Mapa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Guardar Tour */}
      {isGuardarModalOpen && (
        <div className="modal-overlay" style={{zIndex: 10000}}>
          <div className="modal-content glass-panel" style={{width: '90%', maxWidth: '400px', position:'relative'}}>
            <button onClick={() => setIsGuardarModalOpen(false)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
              <X size={24} />
            </button>
            <h3 style={{marginTop: 0, color: 'var(--accent-color)'}}>Guardar Tour Urbano</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom:'20px'}}>Has marcado {hitos.length} puntos de interés.</p>
            
            <label>Nombre del Tour Urbano:
              <input type="text" value={nombreTour} onChange={(e) => setNombreTour(e.target.value)} placeholder="Ej: Recorrido Histórico Santiago" required style={{width:'100%', padding:'10px', marginTop:'5px', marginBottom:'15px', borderRadius:'5px', border:'1px solid #ccc'}} />
            </label>
            
            <label>Descripción General:
              <textarea value={descripcionTour} onChange={(e) => setDescripcionTour(e.target.value)} placeholder="¿De qué trata este tour?..." rows="3" required style={{width:'100%', padding:'10px', marginTop:'5px', borderRadius:'5px', border:'1px solid #ccc', resize:'none'}} />
            </label>

            <div style={{display:'flex', marginTop:'20px'}}>
              <button 
                className="primary" 
                onClick={guardarTourUrbano} 
                disabled={isSavingTour}
                style={{flex:1, padding:'15px', fontSize:'1.1rem', borderRadius:'8px', border:'none', background:'var(--accent-color)', color:'white', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px'}}
              >
                {isSavingTour ? <Loader className="spin" size={20} /> : <Save size={20} />} 
                Confirmar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS animaciones rapidas */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ManejoTourUrbano;
