import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import '../css/clientesPanel.css'


const ManejoCliente = () => {
    const [error, setError] = useState('');
    const [clientes, setCliente] = useState([])
    const [nuevoCliente, setNuevoCliente] = useState({rut: '', nombre: '', edad: '' , telefono: '', correo_usuario: 'admin@naturaltrekking.com'})  


    useEffect(() => {
      //obtener clientes
        const fetchClientes = async () => {
            try {
                const response = await axios.get('/api/admin/clientes');
                setCliente(response.data);
            } catch (error) {
                console.error('Error al cargar clientes:', error.message);
                setError('Error al cargar clientes.');
            }
        };
        fetchClientes();
    }, []);

    //Agregar cliente
    const agregarClientes = async () => {
        try {
            const response = await axios.post('/api/admin/clientes', nuevoCliente);
            setCliente([...clientes, response.data]);
            setNuevoCliente({ rut: '', nombre: '', edad: '', telefono: '', correo_usuario: {} });
        } catch (error) {
            console.error('Error al agregar cliente:', error.message);
        }
    };

    //Eliminar Cliente
    const eliminarCliente = async (rut) => {
        try {
            await axios.delete(`/api/admin/clientes/${rut}`);
            setCliente(clientes.filter(cliente => cliente.rut !== rut));
        } catch (error) {
            console.error('Error al eliminar cliente:', error.message);
        }
    };

    //------------------------------------------visualizaciones-------------------------------------------//
    return (
        <div className="contenedor-cliente">
        <header className="app-header">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>NaturalTrekking</h1>
      </header>
          <h2>Gestionar Clientes</h2>
          <table>
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.rut}>
                  <td>{cliente.rut}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.edad}</td>
                  <td>{cliente.telefono}</td>
                  <td>
                  <button onClick={() => eliminarCliente(cliente.rut)} class="boton-eliminar">
                  <img src='/img/eliminar.png' alt="Eliminar" />
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Agregar cliente</h3>
          <div>
            <input  type="text" placeholder="RUT" value={nuevoCliente.rut} onChange={e => setNuevoCliente({ ...nuevoCliente, rut: e.target.value })} />
            <input type="text" placeholder="Nombre" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} />
            <input type="number" placeholder="Edad" value={nuevoCliente.edad} onChange={e => setNuevoCliente({ ...nuevoCliente, edad: e.target.value })} />
            <input type="text" placeholder="Teléfono" value={nuevoCliente.telefono} onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} />
            <button onClick={agregarClientes} class="boton-agregar">
            <img src='/img/agregar.png' alt="agregar" />
            </button>
          </div>
          {error && <p>{error}</p>}
        </div>
      );
      
};

export default ManejoCliente;