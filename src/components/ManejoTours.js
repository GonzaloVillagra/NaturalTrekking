import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { ArrowLeft, CalendarPlus, Trash2, CalendarDays, Map, X, Info } from 'lucide-react';
import '../css/adminPanel.css';
import '../css/gestionGuiasPanel.css';

const ManejoTours = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'crear', 'lista'
  const [tours, setTours] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [guias, setGuias] = useState([]);
  const [transportes, setTransportes] = useState([]);

  // Form states
  const [nombreRuta, setNombreRuta] = useState('');
  const [fechaViaje, setFechaViaje] = useState('');
  const [correoGuia, setCorreoGuia] = useState('');
  const [patenteTransporte, setPatenteTransporte] = useState('');

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resTours, resRutas, resGuias, resTrans] = await Promise.all([
        axios.get('/api/admin/tours').catch(() => ({ data: [] })),
        axios.get('/api/admin/rutas').catch(() => ({ data: [] })),
        axios.get('/api/admin/guias').catch(() => ({ data: [] })),
        axios.get('/api/admin/transportes').catch(() => ({ data: [] }))
      ]);
      setTours(resTours.data);
      setRutas(resRutas.data);
      setGuias(resGuias.data);
      setTransportes(resTrans.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar datos del servidor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreRuta || !fechaViaje) {
      setError('Ruta y Fecha son obligatorios.');
      return;
    }
    setError('');
    
    try {
      await axios.post('/api/admin/tours', {
        nombre_ruta: nombreRuta,
        fecha_viaje: fechaViaje,
        correo_guia: correoGuia || null,
        patente_transporte: patenteTransporte || null,
        estado: 'Programado'
      });
      setMensaje('Tour programado exitosamente');
      setNombreRuta(''); setFechaViaje(''); setCorreoGuia(''); setPatenteTransporte('');
      setActiveModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Error al programar el tour');
    }
  };

  const handleEliminar = async (id) => {
    if(!window.confirm('¿Seguro que deseas eliminar este tour? Los pasajeros asignados quedarán sin tour.')) return;
    try {
      await axios.delete(`/api/admin/tours/${id}`);
      setMensaje('Tour eliminado exitosamente');
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar tour');
    }
  };

  return (
    <div>
      <header className='app-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
          <h1>Natural Trekking</h1>
        </div>
      </header>

      <div className="admin-panel glass-panel" style={{margin: '40px auto', maxWidth: '1000px'}}>
        <button 
          onClick={() => navigate('/admin')} 
          style={{marginBottom:'20px', padding:'8px 16px', backgroundColor:'transparent', color:'var(--text-muted)', border:'1px solid var(--glass-border)', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}
        >
          <ArrowLeft size={18} /> Volver al Panel
        </button>
        
        <h1 style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--accent-color)'}}><CalendarDays size={32} /> Gestión de Tours</h1>

        {error && <p className="error-text">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        {/* Menú de Botones Simples */}
        <div style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'30px', maxWidth:'500px', margin:'30px auto 0'}}>
          <button 
            style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            onClick={() => setActiveModal('crear')}>
            <CalendarPlus size={20} /> Programar Tour
          </button>
          
          <button 
            style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            onClick={() => setActiveModal('lista')}>
            <Info size={20} /> Ver Tours Programados
          </button>
          
          <button 
            style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid #3b82f6', borderRadius:'8px', cursor:'pointer', transition:'0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginTop:'20px'}}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--glass-bg)'}
            onClick={() => navigate('/admin/tours/urbano')}>
            <Map size={20} color="#3b82f6" /> Crear Nuevo Tour Urbano
          </button>
        </div>

        {/* Modal Base */}
        {activeModal && (
          <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000}}>
            <div className="glass-panel" style={{width:'90%', maxWidth:'800px', position:'relative', padding:'25px', maxHeight:'90vh', overflowY:'auto'}}>
              <button onClick={() => setActiveModal(null)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
                <X size={24} />
              </button>

              {activeModal === 'crear' && (
                <>
                  <h2 style={{marginTop:0}}><CalendarPlus size={24}/> Programar Nuevo Tour</h2>
                  <form onSubmit={handleSubmit} className="formulario">
                    <label>Ruta a realizar:*
                      <select value={nombreRuta} onChange={(e) => setNombreRuta(e.target.value)} required>
                        <option value="">-- Seleccionar Ruta --</option>
                        {rutas.map(r => (
                          <option key={r.nombre} value={r.nombre}>{r.nombre} ({r.dificultad})</option>
                        ))}
                      </select>
                    </label>
                    <label>Fecha de Viaje:*
                      <input type="date" value={fechaViaje} onChange={(e) => setFechaViaje(e.target.value)} required />
                    </label>
                    <label>Guía a Cargo:
                      <select value={correoGuia} onChange={(e) => setCorreoGuia(e.target.value)}>
                        <option value="">-- Sin asignar --</option>
                        {guias.map(g => (
                          <option key={g.correo} value={g.correo}>{g.nombre} ({g.correo})</option>
                        ))}
                      </select>
                    </label>
                    <label>Transporte (Patente):
                      <select value={patenteTransporte} onChange={(e) => setPatenteTransporte(e.target.value)}>
                        <option value="">-- Sin asignar --</option>
                        {transportes.map(t => (
                          <option key={t.patente} value={t.patente}>{t.patente} (Capacidad: {t.capacidad})</option>
                        ))}
                      </select>
                    </label>
                    <button type="submit" className="boton-agregar primary" style={{marginTop:'15px', width:'100%'}}>
                      Crear Tour
                    </button>
                  </form>
                </>
              )}

              {activeModal === 'lista' && (
                <>
                  <h2 style={{marginTop:0, marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><CalendarDays size={24} color="var(--accent-color)"/> Tours Programados</h2>
                  {tours.length === 0 ? (
                    <p style={{color:'var(--text-muted)', textAlign:'center', marginTop:'20px'}}>No hay tours programados.</p>
                  ) : (
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'15px', maxHeight:'60vh', overflowY:'auto', paddingRight:'5px'}}>
                      {tours.map(t => (
                        <div key={t.id} style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'15px', display:'flex', flexDirection:'column'}}>
                          <div style={{marginBottom:'10px'}}>
                            <h4 style={{margin:'0', color:'#f8fafc', fontSize:'1.1rem'}}>{t.nombre_ruta}</h4>
                            <p style={{margin:'5px 0 0 0', color:'var(--accent-color)', fontWeight:'bold'}}>{new Date(t.fecha_viaje).toLocaleDateString()}</p>
                            <p style={{margin:'5px 0 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>Guía: {t.correo_guia || 'N/A'}</p>
                            <p style={{margin:'2px 0 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>Transporte: {t.patente_transporte || 'N/A'}</p>
                            <p style={{margin:'2px 0 0 0', color:'var(--text-muted)', fontSize:'0.85rem'}}>Estado: {t.estado}</p>
                          </div>
                          <button onClick={() => handleEliminar(t.id)} className='danger' style={{marginTop:'auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', padding:'8px', border:'none', borderRadius:'6px', cursor:'pointer'}}>
                            <Trash2 size={16}/> Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManejoTours;
