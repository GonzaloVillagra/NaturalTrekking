import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Map, CloudFog, CloudUpload, Play, ArrowLeft } from 'lucide-react';
import '../css/rutasPanel.css';

const GestionRutas = () => {
  const navigate = useNavigate();
  const [rutasGuardadas, setRutasGuardadas] = useState([]);
  const [rutasOffline, setRutasOffline] = useState([]);
  const [activeTab, setActiveTab] = useState('explorar'); // explorar, offline
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarRutasCloud();
    cargarRutasOffline();
  }, []);

  const cargarRutasCloud = async () => {
    try {
      const response = await axios.get('/api/admin/rutas');
      setRutasGuardadas(response.data);
    } catch (error) {
      console.error('Error cargar rutas:', error);
      setError('Error al cargar rutas desde la nube.');
    }
  };

  const cargarRutasOffline = () => {
    const pendientes = JSON.parse(localStorage.getItem('rutas_pendientes')) || [];
    setRutasOffline(pendientes);
  };

  const sincronizarOffline = async () => {
    try {
      for (let r of rutasOffline) {
        await axios.post('/api/admin/rutas/', r.ruta);
        for (let hito of r.hitos) {
          const wktPoint = `POINT(${hito.lng} ${hito.lat})`;
          await axios.post('/api/admin/hitos', {
            nombre: hito.nombre, descripcion: hito.descripcion,
            ubicacion: wktPoint, imagen_url: hito.imagen_url,
            nombre_ruta: r.ruta.nombre
          });
        }
      }
      localStorage.removeItem('rutas_pendientes');
      setRutasOffline([]);
      cargarRutasCloud();
      setMensaje('Sincronización completa');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error('Error sinc', err);
      setError('Error al sincronizar. Revisa la conexión.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{minHeight:'100vh', background:'var(--bg-main)'}}>
      <header className='app-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ArrowLeft size={24} onClick={() => navigate('/admin')} style={{cursor: 'pointer'}} />
          <h1>Gestión de Rutas</h1>
        </div>
      </header>

      <div style={{padding:'20px'}}>
        <button 
          className="boton-agregar primary" 
          style={{width:'100%', marginBottom:'20px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontSize:'1.1rem'}}
          onClick={() => navigate('/admin/rutas/grabar')}
        >
          <Play size={20} /> GRABAR NUEVA RUTA
        </button>

        <div className="glass-panel" style={{padding:'20px'}}>
          <div className="mobile-nav" style={{marginBottom:'20px'}}>
            <button className={activeTab === 'explorar' ? 'active' : ''} onClick={()=>setActiveTab('explorar')} style={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}><Map size={16}/> En la Nube</button>
            <button className={activeTab === 'offline' ? 'active' : ''} onClick={()=>setActiveTab('offline')} style={{display:'flex', alignItems:'center', gap:'5px', justifyContent:'center'}}><CloudFog size={16}/> Offline ({rutasOffline.length})</button>
          </div>

          {mensaje && <div className="success">{mensaje}</div>}
          {error && <div className="error-text">{error}</div>}

          {activeTab === 'explorar' && (
            <div>
              {rutasGuardadas.length > 0 ? rutasGuardadas.map(r => (
                <div key={r.nombre} style={{background:'rgba(255,255,255,0.05)', borderRadius:'12px', padding:'15px', marginBottom:'10px', border:'1px solid var(--glass-border)'}}>
                  <h4 style={{margin:0, color:'#f8fafc', fontSize:'1.1rem'}}>{r.nombre}</h4>
                  <p style={{margin:'5px 0', color:'var(--text-muted)'}}>{r.descripcion}</p>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'var(--text-muted)', marginTop:'5px'}}>
                    <span><Map size={14}/> {r.distancia_km} km</span>
                    <span style={{textTransform:'capitalize'}}>{r.dificultad}</span>
                  </div>
                  <button className="primary" style={{width:'100%', marginTop:'10px', padding:'8px'}} onClick={() => navigate(`/admin/rutas/${r.nombre}/`)}>Ver Mapa</button>
                </div>
              )) : <p style={{color:'var(--text-muted)'}}>No hay rutas en la nube.</p>}
            </div>
          )}

          {activeTab === 'offline' && (
            <div>
              <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'15px'}}>Rutas guardadas sin conexión. Presiona Sincronizar para subirlas a la nube.</p>
              <button className="primary" onClick={sincronizarOffline} disabled={rutasOffline.length === 0} style={{width:'100%', marginBottom:'20px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                <CloudUpload size={20} /> Sincronizar a Nube
              </button>
              {rutasOffline.map((r, i) => (
                <div key={i} style={{background:'rgba(255,255,255,0.05)', borderRadius:'12px', padding:'10px', marginBottom:'10px'}}>
                  <h4 style={{margin:0, color:'#f8fafc'}}>{r.ruta.nombre}</h4>
                  <small style={{color:'var(--text-muted)'}}>{r.hitos.length} Hitos Adjuntos</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionRutas;
