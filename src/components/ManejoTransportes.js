import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Bus, ArrowLeft, Trash2, PlusCircle, Info, X } from 'lucide-react';
import '../css/transportePanel.css'

const ManejoTransportes = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [transportes, setTransporte] = useState([]);
    const [transporteSeleccionado, setTransporteSeleccionado] = useState(null);
    const [nuevoTransporte, setNuevoTransporte] = useState({
        patente: '', 
        lugar_partida: '', 
        hora_partida: '', 
        vehiculo: '', 
        nombre_conductor: '',
    });

    // Obtener transportes
    useEffect(() => {
        const fetchTransporte = async () => {
            try {
                const response = await axios.get('/api/admin/transportes');
                setTransporte(response.data);
            } catch (error) {
                console.error('Error al cargar transporte:', error.message);
                setError('Error al cargar transporte.');
            }
        };
        fetchTransporte();
    }, []);

    // Crear transporte
    const crearTransporte = async () => {
        try {
            const response = await axios.post('/api/admin/transportes', nuevoTransporte);
            setTransporte([...transportes, response.data]);
            setNuevoTransporte({ patente: '', lugar_partida: '', hora_partida: '', vehiculo: '', nombre_conductor: ''});
        } catch (error) {
            console.error('Error al agregar transporte:', error.message);
        }
    };


    // Eliminar transporte
    const eliminarTransporte = async (patente) => {
        try {
            await axios.delete(`/api/admin/transportes/${patente}`);
            setTransporte(transportes.filter(transporte => transporte.patente !== patente));
        } catch (error) {
            console.error('Error al eliminar transporte:', error.message);
        }
    };
  

    /******************************Visualizaciones************************************/
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
          
          <h2 style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--accent-color)'}}><Bus size={32} /> Gestionar Transporte</h2>
          {error && <p>{error}</p>}
          <ul className='lista-guias' style={{listStyle:'none', padding:0, margin:0}}>
            {transportes.map(transporte => (
              <li key={transporte.patente} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', borderBottom:'1px solid var(--glass-border)', background:'rgba(255,255,255,0.05)', borderRadius:'8px', marginBottom:'10px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                  <div style={{background:'rgba(255,255,255,0.1)', padding:'10px', borderRadius:'50%'}}>
                    <Bus size={24} color="var(--accent-color)" />
                  </div>
                  <div>
                    <h3 style={{margin:0}}>{transporte.nombre_conductor}</h3>
                    <small style={{color:'var(--text-muted)'}}>Conductor Asignado</small>
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px'}}>
                  <button onClick={() => setTransporteSeleccionado(transporte)} className="primary" style={{padding:'8px', borderRadius:'8px'}} title="Ver Detalles">
                    <Info size={18} />
                  </button>
                  <button onClick={() => eliminarTransporte(transporte.patente)} className="danger" style={{padding:'8px', borderRadius:'8px'}} title="Eliminar Transporte">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
            {transportes.length === 0 && (
              <p style={{textAlign:'center', color:'var(--text-muted)'}}>No hay transportes registrados.</p>
            )}
          </ul>

          {/* Modal de Información del Transporte */}
          {transporteSeleccionado && (
            <div className="modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000}}>
              <div className="glass-panel" style={{width:'90%', maxWidth:'400px', position:'relative', padding:'25px'}}>
                <button onClick={() => setTransporteSeleccionado(null)} style={{position:'absolute', top:'15px', right:'15px', background:'transparent', border:'none', color:'var(--text-muted)', cursor:'pointer'}}>
                  <X size={24} />
                </button>
                <h3 style={{marginTop:0, display:'flex', alignItems:'center', gap:'8px', color:'var(--accent-color)'}}><Bus size={24}/> Detalles del Transporte</h3>
                <div style={{marginTop:'20px', lineHeight:'1.8'}}>
                  <p style={{margin:0}}><strong>Conductor:</strong> {transporteSeleccionado.nombre_conductor}</p>
                  <p style={{margin:0}}><strong>Vehículo:</strong> {transporteSeleccionado.vehiculo}</p>
                  <p style={{margin:0}}><strong>Patente:</strong> <span style={{background:'rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:'4px', fontFamily:'monospace'}}>{transporteSeleccionado.patente}</span></p>
                  <hr style={{borderColor:'var(--glass-border)', margin:'15px 0'}} />
                  <p style={{margin:0}}><strong>Lugar de Partida:</strong> {transporteSeleccionado.lugar_partida}</p>
                  <p style={{margin:0}}><strong>Hora de Partida:</strong> {transporteSeleccionado.hora_partida}</p>
                </div>
                <button onClick={() => setTransporteSeleccionado(null)} className="primary" style={{width:'100%', marginTop:'20px'}}>Cerrar</button>
              </div>
            </div>
          )}
          <h3 style={{marginTop:'40px'}}>Agregar transporte</h3>
          <div className="formulario" style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <input type="text" placeholder="Patente" value={nuevoTransporte.patente} onChange={e => setNuevoTransporte({ ...nuevoTransporte, patente: e.target.value })} />
            <input type="text" placeholder="Lugar de partida del tour" value={nuevoTransporte.lugar_partida} onChange={e => setNuevoTransporte({ ...nuevoTransporte, lugar_partida: e.target.value })} />
            <input type="time" placeholder="Hora de partida del tour" value={nuevoTransporte.hora_partida} onChange={e => setNuevoTransporte({ ...nuevoTransporte, hora_partida: e.target.value })} />
            <input type="text" placeholder="Modelo del vehículo" value={nuevoTransporte.vehiculo} onChange={e => setNuevoTransporte({ ...nuevoTransporte, vehiculo: e.target.value })} />
            <input type="text" placeholder="Nombre del conductor" value={nuevoTransporte.nombre_conductor} onChange={e => setNuevoTransporte({ ...nuevoTransporte, nombre_conductor: e.target.value })} />

            <button onClick={crearTransporte} className="boton-agregar primary" style={{marginTop:'10px'}}>
              <PlusCircle size={20} /> Agregar Transporte
            </button>
          </div>
        </div>
        </div>
      );
      
};

export default ManejoTransportes;
