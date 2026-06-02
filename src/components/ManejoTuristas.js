import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, ArrowLeft, Trash2 } from 'lucide-react';
import '../css/gestionGuiasPanel.css';

const ManejoTuristas = () => {
  const navigate = useNavigate();
  const [turistas, setTuristas] = useState([]);
  const [tours, setTours] = useState([]);
  
  // States for new tourist form
  const [tipoDocumento, setTipoDocumento] = useState('RUT');
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emergencia, setEmergencia] = useState('');
  const [medica, setMedica] = useState('');
  const [tourId, setTourId] = useState('');
  
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetchTuristas();
    fetchTours();
  }, []);

  const fetchTuristas = async () => {
    try {
      const response = await axios.get('/api/admin/turistas');
      setTuristas(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al obtener turistas');
    }
  };

  const fetchTours = async () => {
    try {
      const response = await axios.get('/api/admin/tours');
      setTours(response.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al obtener tours programados');
    }
  };

  const validarRUT = (rut) => {
    if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
    const [cuerpo, dv] = rut.split('-');
    let suma = 0;
    let multiplo = 2;
    for (let i = 1; i <= cuerpo.length; i++) {
      let index = multiplo * rut.charAt(cuerpo.length - i);
      suma = suma + index;
      if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv.toUpperCase() === dvCalculado;
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return 'N/A';
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edadCalc = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edadCalc--;
    }
    return edadCalc;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tipoDocumento === 'RUT' && !validarRUT(rut)) {
      setError('RUT Inválido. Asegúrese de usar formato 12345678-9');
      return;
    }
    setError('');
    try {
      await axios.post('/api/admin/turistas', {
        tipo_documento: tipoDocumento,
        rut_pasaporte: rut,
        nombre_completo: nombre,
        fecha_nacimiento: fechaNacimiento,
        telefono_contacto: telefono,
        contacto_emergencia: emergencia,
        condicion_medica: medica,
        tour_id: tourId || null
      });
      setMensaje('Pasajero registrado exitosamente');
      setTipoDocumento('RUT'); setRut(''); setNombre(''); setFechaNacimiento(''); setTelefono(''); setEmergencia(''); setMedica(''); setTourId('');
      fetchTuristas();
    } catch (err) {
      console.error('Error:', err);
      setError('Error al registrar pasajero');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`/api/admin/turistas/${id}`);
      setMensaje('Pasajero eliminado exitosamente');
      fetchTuristas();
    } catch (err) {
      console.error('Error:', err);
      setError('Error al eliminar pasajero');
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

        <h1 style={{display:'flex', alignItems:'center', gap:'10px', color:'var(--accent-color)'}}><Users size={32} /> Gestión de Turistas y Pasajeros</h1>
        {error && <p className="error-text">{error}</p>}
        {mensaje && <p className="success">{mensaje}</p>}

        <h2>Registrar Nuevo Pasajero</h2>
        <form onSubmit={handleSubmit} className="formulario">
          <div className="radio-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', marginRight: '20px', fontWeight: 'normal' }}>
              <input type="radio" value="RUT" checked={tipoDocumento === 'RUT'} onChange={(e) => setTipoDocumento(e.target.value)} style={{ width: 'auto', marginRight: '5px' }} />
              RUT Chileno
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'normal' }}>
              <input type="radio" value="Pasaporte" checked={tipoDocumento === 'Pasaporte'} onChange={(e) => setTipoDocumento(e.target.value)} style={{ width: 'auto', marginRight: '5px' }} />
              Pasaporte
            </label>
          </div>
          <label>{tipoDocumento === 'RUT' ? 'RUT (Ej: 12345678-9):' : 'Número de Pasaporte:'}
            <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required placeholder={tipoDocumento === 'RUT' ? "12345678-9" : "A1234567"} />
          </label>
          <label>Nombre Completo:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label>Fecha de Nacimiento:
            <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
          </label>
          <label>Teléfono de Contacto:
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </label>
          <label>Contacto de Emergencia:
            <input type="text" value={emergencia} onChange={(e) => setEmergencia(e.target.value)} />
          </label>
          <label>Restricciones / Condiciones Médicas:
            <textarea value={medica} onChange={(e) => setMedica(e.target.value)} placeholder="Ej. Alergia a picaduras, asma..." />
          </label>
          <label>Asignar a Tour Programado:
            <select value={tourId} onChange={(e) => setTourId(e.target.value)}>
              <option value="">-- Sin Asignar --</option>
              {tours.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre_ruta} ({new Date(t.fecha_viaje).toLocaleDateString()}) - Guía: {t.correo_guia || 'Sin asignar'}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="boton-agregar primary" style={{marginTop:'15px', width:'100%'}}>
            <UserPlus size={20} /> Registrar Pasajero
          </button>
        </form>

        <h2 style={{marginTop:'40px', borderBottom:'1px solid var(--glass-border)', paddingBottom:'10px'}}>Lista de Pasajeros</h2>
        <div style={{overflowX: 'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Número</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Tour Asignado</th>
                <th>Fecha Tour</th>
                <th>Emergencia</th>
                <th>Médico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turistas.map(t => (
                <tr key={t.id}>
                  <td>{t.tipo_documento || 'RUT'}</td>
                  <td>{t.rut_pasaporte}</td>
                  <td>{t.nombre_completo}</td>
                  <td>{calcularEdad(t.fecha_nacimiento)}</td>
                  <td>{t.nombre_ruta || 'N/A'}</td>
                  <td>{t.fecha_viaje ? new Date(t.fecha_viaje).toLocaleDateString() : 'N/A'}</td>
                  <td>{t.contacto_emergencia}</td>
                  <td>{t.condicion_medica}</td>
                  <td>
                    <button className="boton-eliminar danger" onClick={() => handleEliminar(t.id)} title="Eliminar Pasajero" style={{padding:'8px'}}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {turistas.length === 0 && (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>No hay pasajeros registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManejoTuristas;
