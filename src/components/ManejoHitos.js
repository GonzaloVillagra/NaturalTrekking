import React from 'react';
import axios from '../api/axiosConfig';
import UbicacionActual from './UbicacionActual';
import  {useState} from 'react';

const AgregarHito = ({ nombreRuta }) => {
  const { location, error } = UbicacionActual();
  const [nombreHito, setNombreHito] = useState('');
  const [descripcionHito, setDescripcionHito] = useState('');
  const [imagenUrlHito, setImagenUrlHito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      alert(`Error al obtener la ubicación: ${error}`);
      return;
    }

    try {
      await axios.post('/api/admin/hitos', {
        nombre: nombreHito,
        descripcion: descripcionHito,
        ubicacion: `POINT(${location.lng} ${location.lat})`, 
        imagen_url: imagenUrlHito,
        nombre_ruta: nombreRuta
      });
      alert('Hito agregado correctamente!');
    } catch (error) {
      console.error('Error al agregar el hito:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={nombreHito} onChange={e => setNombreHito(e.target.value)} placeholder="Nombre del hito" required />
      <textarea value={descripcionHito} onChange={e => setDescripcionHito(e.target.value)} placeholder="Descripción del hito" required />
      <input type="text" value={imagenUrlHito} onChange={e => setImagenUrlHito(e.target.value)} placeholder="URL de la imagen" required />
      <button type="submit">Agregar Hito</button>
    </form>
  );
};

export default AgregarHito;
