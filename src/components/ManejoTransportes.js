import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import '../css/transportePanel.css'

const ManejoTransportes = () => {
    const [error, setError] = useState('');
    const [transportes, setTransporte] = useState([]);
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
        <div className="transpote-contenedor">
        <header className="app-header">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>NaturalTrekking</h1>
      </header>
          <h2>Gestionar Transporte</h2>
          {error && <p>{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Patente</th>
                <th>Lugar de Partida</th>
                <th>Hora de Partida</th>
                <th>Vehículo</th>
                <th>Nombre Conductor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transportes.map(transporte => (
                <tr key={transporte.patente}>
                  <td>{transporte.patente}</td>
                  <td>{transporte.lugar_partida}</td>
                  <td>{transporte.hora_partida}</td>
                  <td>{transporte.vehiculo}</td>
                  <td>{transporte.nombre_conductor}</td>
                  <td>
                    <button onClick={() => eliminarTransporte(transporte.patente)}class="boton-eliminar">
                    <img src='/img/eliminar.png' alt="Eliminar" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Agregar transporte</h3>
          <div>
            <input type="text" placeholder="Patente" value={nuevoTransporte.patente} onChange={e => setNuevoTransporte({ ...nuevoTransporte, patente: e.target.value })} />
            <input type="text" placeholder="Lugar de partida del tour" value={nuevoTransporte.lugar_partida} onChange={e => setNuevoTransporte({ ...nuevoTransporte, lugar_partida: e.target.value })} />
            <input type="time" placeholder="Hora de partida del tour" value={nuevoTransporte.hora_partida} onChange={e => setNuevoTransporte({ ...nuevoTransporte, hora_partida: e.target.value })} />
            <input type="text" placeholder="Modelo del vehículo" value={nuevoTransporte.vehiculo} onChange={e => setNuevoTransporte({ ...nuevoTransporte, vehiculo: e.target.value })} />
            <input type="text" placeholder="Nombre del conductor" value={nuevoTransporte.nombre_conductor} onChange={e => setNuevoTransporte({ ...nuevoTransporte, nombre_conductor: e.target.value })} />

            <button onClick={crearTransporte}class="boton-agregar">
            <img src='/img/agregar-usuario.png' alt="agregar" /></button>
          </div>
        </div>
      );
      
};

export default ManejoTransportes;
