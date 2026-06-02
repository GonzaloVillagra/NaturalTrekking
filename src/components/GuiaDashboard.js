import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import MapaRuta from './MapaRuta';
import { MapPin, Map, Bus, Users, LogOut, MessageSquare, Send, Mountain } from 'lucide-react';
import '../css/guiaPanel.css';

const GuiaDashboard = ({ correo }) => {
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [tours, setTours] = useState([]);
  const [pasajerosPorTour, setPasajerosPorTour] = useState({});
  const [hitosPorTour, setHitosPorTour] = useState({});
  const [rutaActivaId, setRutaActivaId] = useState(null);
  
  // States for comments
  const [comentario, setComentario] = useState('');
  const [nombreRuta, setNombreRuta] = useState('');

  useEffect(() => {
    if (!correo) {
      setError('Correo no proporcionado.');
      return;
    }

    const fetchDatos = async () => {
      try {
        // 1. Obtener datos básicos del guía
        const resGuia = await axios.get(`/api/guias/guia/${correo}`);
        if (resGuia.data.length > 0) {
          setNombre(resGuia.data[0].nombre);
        } else {
          setError('No se encontró el guía.');
          return;
        }

        // 2. Obtener tours asignados al guía
        const resTours = await axios.get(`/api/guias/tours/${correo}`);
        const toursData = resTours.data;
        setTours(toursData);

        // 3. Por cada tour, obtener sus pasajeros y sus hitos
        const pasajerosDict = {};
        const hitosDict = {};
        for (const tour of toursData) {
          const resPasajeros = await axios.get(`/api/guias/tours/${tour.id}/pasajeros`);
          pasajerosDict[tour.id] = resPasajeros.data;

          try {
            const resHitos = await axios.get(`/api/admin/hitos/${encodeURIComponent(tour.nombre_ruta)}`);
            hitosDict[tour.id] = resHitos.data;
          } catch (e) {
            console.error('Error cargando hitos para ' + tour.nombre_ruta, e);
          }
        }
        setPasajerosPorTour(pasajerosDict);
        setHitosPorTour(hitosDict);

      } catch (err) {
        console.error('Error al obtener datos del guía:', err);
        setError('Error al cargar la información del servidor.');
      }
    };

    fetchDatos();
  }, [correo]);

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/guias/comentarios', {
        nombre_ruta: nombreRuta,
        correo_usuario: correo,
        comentario,
      });
      setComentario('');
      setNombreRuta('');
      alert('Comentario enviado con éxito');
    } catch (error) {
      console.error('Error al enviar comentario:', error.message);
      setError('Error al enviar comentario.');
    }
  };

  return (
    <div>
      <header className='app-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
          <h1>Natural Trekking</h1>
        </div>
        <button 
          className="danger"
          onClick={() => { localStorage.clear(); window.location.href='/'; }} 
          style={{ padding: '8px 16px' }}
        >
          <LogOut size={18} /> Salir
        </button>
      </header>
      
      <div className="admin-container">
        <div className="glass-panel" style={{marginBottom: '30px', textAlign: 'center'}}>
          <h1 style={{marginBottom: '10px'}}>Panel de Guía</h1>
          <h2 style={{color: 'var(--accent-color)'}}>Bienvenido, {nombre}</h2>
          {error && <div className="error-text">{error}</div>}
        </div>
        
        {tours.length === 0 ? (
          <div className="glass-panel" style={{textAlign: 'center'}}>
            <p>No tienes tours programados actualmente.</p>
          </div>
        ) : (
          tours.map(tour => (
            <div key={tour.id} className="glass-panel" style={{marginBottom:'30px'}}>
              
              {/* Header del Tour */}
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--glass-border)', paddingBottom:'15px', marginBottom:'15px'}}>
                <div>
                  <h2 style={{margin:0, color:'var(--text-heading)'}}>Tour: {tour.nombre_ruta}</h2>
                  <p style={{margin:'5px 0 0 0', color:'var(--text-muted)'}}>Fecha: <strong style={{color:'var(--text-main)'}}>{new Date(tour.fecha_viaje).toLocaleDateString()}</strong> | Estado: <span style={{color:'var(--accent-color)'}}>{tour.estado}</span></p>
                </div>
                <button 
                  onClick={() => setRutaActivaId(rutaActivaId === tour.id ? null : tour.id)}
                  className={rutaActivaId === tour.id ? "danger" : "primary"}
                >
                  <MapPin size={20} />
                  {rutaActivaId === tour.id ? 'Ocultar Mapa' : 'Seguir Ruta (GPS)'}
                </button>
              </div>

              {/* Detalles de Ruta y Transporte */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'20px', marginBottom:'20px'}}>
                <div style={{background:'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'var(--border-radius)', border:'1px solid var(--glass-border)'}}>
                  <h3 style={{marginTop:0, color:'var(--accent-color)', display:'flex', alignItems:'center', gap:'8px'}}><Mountain size={20}/> Detalles de Ruta</h3>
                  <p><strong>Dificultad:</strong> {tour.dificultad || 'No especificada'}</p>
                </div>
                <div style={{background:'rgba(0,0,0,0.2)', padding:'15px', borderRadius:'var(--border-radius)', border:'1px solid var(--glass-border)'}}>
                  <h3 style={{marginTop:0, color:'var(--accent-color)', display:'flex', alignItems:'center', gap:'8px'}}><Bus size={20}/> Transporte Asignado</h3>
                  {tour.vehiculo ? (
                    <>
                      <p style={{margin:'0 0 5px 0'}}><strong>Vehículo:</strong> {tour.vehiculo} ({tour.capacidad} pax)</p>
                      <p style={{margin:'0 0 5px 0'}}><strong>Conductor:</strong> {tour.nombre_conductor}</p>
                      <p style={{margin:'0 0 5px 0'}}><strong>Salida:</strong> {tour.hora_partida} desde {tour.lugar_partida}</p>
                    </>
                  ) : (
                    <p>Sin transporte asignado.</p>
                  )}
                </div>
              </div>

              {/* Mapa de Ruta */}
              {rutaActivaId === tour.id && tour.coordenadas && (
                <div style={{marginBottom:'20px', borderRadius:'var(--border-radius)', overflow:'hidden', border:'1px solid var(--glass-border)'}}>
                  <MapaRuta rutaGps={tour.coordenadas} ubicacionActual={tour.coordenadas[0]} hitos={hitosPorTour[tour.id]} />
                </div>
              )}

              {/* Lista de Pasajeros */}
              <h3 style={{marginBottom:'10px', display:'flex', alignItems:'center', gap:'8px'}}><Users size={20}/> Lista de Pasajeros ({pasajerosPorTour[tour.id]?.length || 0})</h3>
              <div style={{overflowX: 'auto'}}>
                <table>
                  <thead>
                    <tr>
                      <th>Nombre Completo</th>
                      <th>Teléfono</th>
                      <th>Contacto Emergencia</th>
                      <th>Condición Médica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pasajerosPorTour[tour.id]?.map(p => (
                      <tr key={p.id}>
                        <td style={{fontWeight:'bold'}}>{p.nombre_completo}</td>
                        <td>{p.telefono_contacto || '-'}</td>
                        <td>{p.contacto_emergencia || '-'}</td>
                        <td style={{color: p.condicion_medica ? 'var(--danger-hover)' : 'inherit', fontWeight: p.condicion_medica ? 'bold' : 'normal'}}>
                          {p.condicion_medica || 'Ninguna'}
                        </td>
                      </tr>
                    ))}
                    {(!pasajerosPorTour[tour.id] || pasajerosPorTour[tour.id].length === 0) && (
                      <tr>
                        <td colSpan="4" style={{textAlign:'center'}}>No hay pasajeros registrados para este tour.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        {/* Sección de Comentarios */}
        <div className="glass-panel" style={{marginTop:'40px'}}>
          <h2 style={{marginTop:0, display:'flex', alignItems:'center', gap:'8px'}}><MessageSquare size={24}/> Enviar Reporte / Comentario</h2>
          <form onSubmit={handleComentarioSubmit}>
            <label>Ruta (Referencia):
              <select value={nombreRuta} onChange={(e) => setNombreRuta(e.target.value)} required>
                <option value="">-- Seleccionar Tour/Ruta --</option>
                {tours.map(t => (
                  <option key={t.id} value={t.nombre_ruta}>{t.nombre_ruta} ({new Date(t.fecha_viaje).toLocaleDateString()})</option>
                ))}
              </select>
            </label>
            <label>
              Comentario:
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
                style={{minHeight:'100px'}}
              />
            </label>
            <button type="submit" className="primary" style={{marginTop: '15px'}}>
              <Send size={18}/> Enviar Comentario
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default GuiaDashboard;