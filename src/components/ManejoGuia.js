import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, MapPin, Bus, ArrowLeft, Info, X, CheckCircle, UserSquare2, Trash2 } from 'lucide-react';

const ManejoGuias = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null); // 'crear', 'lista', 'ruta', 'transporte'
  const [guias, setGuias] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [transportes, setTransportes] = useState([]);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [nombreRuta, setNombreRuta] = useState('');
  const [patenteTransporte, setPatenteTransporte] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guiaSeleccionado, setGuiaSeleccionado] = useState('');
  const [guiaTransporteSeleccionado, setGuiaTransporteSeleccionado] = useState('');

  useEffect(() => {
    fetchGuias();
    fetchRutas();
    fetchTransportes();
  }, []);

//obtener guias
  const fetchGuias = async () => {
    try {
      const response = await axios.get('/api/admin/guias');
      setGuias(response.data);
    } catch (error) {
      console.error('Error al obtener guías:', error.message);
      setError('Error al obtener guías.');
    }
  };
 //obtener rutas
  const fetchRutas = async () => {
    try {
      const response = await axios.get('/api/admin/rutas');
      setRutas(response.data);
    } catch (error) {
      console.error('Error al obtener rutas:', error.message);
      setError('Error al obtener rutas.');
    }
  };

  //obtener transportes
  const fetchTransportes = async () => {
    try {
      const response = await axios.get('/api/admin/guias/transportes');
      setTransportes(response.data);
    } catch (error) {
      console.error('Error al obtener transportes:', error.message);
      setError('Error al obtener transportes.');
    }
  };

  //crear guia
  const handleCrearGuia = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/guias', { correo, nombre, contraseña });
      setCorreo('');
      setNombre('');
      setContraseña('');
      setMensaje('Guía creado con éxito');
      setActiveModal(null);
      fetchGuias();
    } catch (error) {
      console.error('Error al crear guía:', error.message);
      setError('Error al crear guía.');
    }
  };

  //eliminar guia
  const handleEliminarGuia = async (correo) => {
    try {
      await axios.delete(`/api/admin/guias/${correo}`);
      setMensaje('Guía eliminado con éxito');
      fetchGuias();
    } catch (error) {
      console.error('Error al eliminar guía:', error.message);
      setError('Error al eliminar guía.');
    }
  };

// asignar ruta  
  const handleAsignarRuta = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/guias/asignarruta', {
        correo_usuario: guiaSeleccionado,
        nombre: nombreRuta
      });
      setMensaje('Ruta asignada con éxito');
      setActiveModal(null);
    } catch (error) {
      console.error('Error al asignar el transporte:', error.message);
    }
  };

  //asignar tranquioirte
  const handleAsignarTransporte = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/guias/asignartransporte', {
        correo_usuario: guiaTransporteSeleccionado,
        patente: patenteTransporte
      });
      setMensaje('Transporte asignado con éxito');
      setActiveModal(null);
    } catch (error) {
      console.error('Error al asignar el transporte:', error.message);
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
  <h1 style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--accent-color)'}}><UserSquare2 size={32} /> Gestión de Guías</h1>

  {error && <p className="error">{error}</p>}
  {mensaje && <p className="success">{mensaje}</p>}

  {/* Menú de Botones Simples */}
  <div style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'30px', maxWidth:'500px', margin:'30px auto 0'}}>
    <button 
      style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s'}}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      onClick={() => setActiveModal('crear')}>
      Crear Guía
    </button>
    <button 
      style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s'}}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      onClick={() => setActiveModal('lista')}>
      Ver Guías
    </button>
    <button 
      style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s'}}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      onClick={() => setActiveModal('ruta')}>
      Asignar Ruta
    </button>
    <button 
      style={{padding:'18px', fontSize:'1.1rem', background:'var(--glass-bg)', color:'#f8fafc', border:'1px solid var(--glass-border)', borderRadius:'8px', cursor:'pointer', transition:'0.3s'}}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
      onClick={() => setActiveModal('transporte')}>
      Asignar Transporte
    </button>
  </div>

  {/* Modal Base */}
  {activeModal && (
    <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000}}>
      <div className="glass-panel" style={{width:'90%', maxWidth:'500px', position:'relative', padding:'25px', maxHeight:'90vh', overflowY:'auto'}}>
        <button onClick={() => setActiveModal(null)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
          <X size={24} />
        </button>

        {activeModal === 'crear' && (
          <>
            <h2 style={{marginTop:0}}><UserPlus size={24}/> Crear Guía</h2>
            <form onSubmit={handleCrearGuia} className='formulario'>
              <label>Correo:
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </label>
              <label>Nombre:
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </label>
              <label>Contraseña:
                <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              </label>
              <button type="submit" className='boton-agregar primary' style={{marginTop:'15px', width:'100%'}}>Crear Guía</button>
            </form>
          </>
        )}

        {activeModal === 'lista' && (
          <>
            <h2 style={{marginTop:0, marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><Users size={24} color="var(--accent-color)"/> Lista de Guías</h2>
            {guias.length === 0 ? (
              <p style={{color:'var(--text-muted)', textAlign:'center', marginTop:'20px'}}>No hay guías registrados.</p>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'15px', maxHeight:'60vh', overflowY:'auto', paddingRight:'5px'}}>
                {guias.map((guia) => (
                  <div key={guia.correo} style={{background:'rgba(255,255,255,0.05)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'15px', display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px'}}>
                      <UserSquare2 size={36} color="var(--accent-color)" />
                      <div>
                        <h4 style={{margin:'0', color:'#f8fafc', fontSize:'1.1rem', wordBreak:'break-word'}}>{guia.nombre}</h4>
                        <p style={{margin:'2px 0 0 0', color:'var(--text-muted)', fontSize:'0.85rem', wordBreak:'break-all'}}>{guia.correo}</p>
                      </div>
                    </div>
                    <button onClick={() => handleEliminarGuia(guia.correo)} className='danger' style={{marginTop:'auto', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', padding:'8px', border:'none', borderRadius:'6px', cursor:'pointer'}}>
                      <Trash2 size={16}/> Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeModal === 'ruta' && (
          <>
            <h2 style={{marginTop:0}}><MapPin size={24}/> Asignar Ruta a Guía</h2>
            <form onSubmit={handleAsignarRuta} className='formulario'>
              <label>Nombre de la Ruta:
                <select value={nombreRuta} onChange={(e) => setNombreRuta(e.target.value)} required>
                  <option value="">Seleccione una ruta</option>
                  {rutas.map((ruta) => <option key={ruta.id} value={ruta.nombre}>{ruta.nombre}</option>)}
                </select>
              </label>
              <label>Guía:
                <select value={guiaSeleccionado} onChange={(e) => setGuiaSeleccionado(e.target.value)} required>
                  <option value="">Seleccione un guía</option>
                  {guias.map((guia) => <option key={guia.correo} value={guia.correo}>{guia.nombre}</option>)}
                </select>
              </label>
              <button type="submit" className='boton-agregar primary' style={{marginTop:'15px', width:'100%'}}>Asignar Ruta</button>
            </form>
          </>
        )}

        {activeModal === 'transporte' && (
          <>
            <h2 style={{marginTop:0}}><Bus size={24}/> Asignar Transporte a Guía</h2>
            <form onSubmit={handleAsignarTransporte} className='formulario'>
              <label>Patente del Transporte:
                <select value={patenteTransporte} onChange={(e) => setPatenteTransporte(e.target.value)} required>
                  <option value="">Seleccione un transporte</option>
                  {transportes.map((transporte) => <option key={transporte.id} value={transporte.patente}>{transporte.patente}</option>)}
                </select>
              </label>
              <label>Guía:
                <select value={guiaTransporteSeleccionado} onChange={(e) => setGuiaTransporteSeleccionado(e.target.value)} required>
                  <option value="">Seleccione un guía</option>
                  {guias.map((guia) => <option key={guia.correo} value={guia.correo}>{guia.nombre}</option>)}
                </select>
              </label>
              <button type="submit" className='boton-agregar primary' style={{marginTop:'15px', width:'100%'}}>Asignar Transporte</button>
            </form>
          </>
        )}
      </div>
    </div>
  )}

  </div>
</div>
);
};

export default ManejoGuias;