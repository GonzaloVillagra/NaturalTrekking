import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import MapaRuta from './MapaRuta';
import { useNavigate } from 'react-router-dom';
import '../css/rutasPanel.css'

const ManejoRutas = () => {
  const navigate = useNavigate();
  const [rutaGps, setRutaGps] = useState([]); 
  const [ubicacionActual, setUbicacionActual] = useState(null); 
  const [seguimientoActivo, setSeguimientoActivo] = useState(false);
  const [rutasGuardadas, setRutasGuardadas] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [datosRuta, setDatosRuta] = useState({ nombre: '', descripcion: '', dificultad: ''});
  const [nombreHito, setNombreHito] = useState('');
  const [descripcionHito, setDescripcionHito] = useState('');
  const [nombreRuta, setNombreRuta] = useState('');
  const [imagenUrlHito, setImagenUrlHito] = useState('');

  const [watchId, setWatchId] = useState(null)



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUbicacionActual({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.error('Error al obtener la ubicación:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.log('Geolocalización no soportada por este navegador.');
    }
    cargarRutasGuardadas();
  }, []);

  //efecto para cargar rutas guardadas
  const cargarRutasGuardadas = async () => {
    try {
      const response = await axios.get('/api/admin/rutas');
      setRutasGuardadas(response.data);
    } catch (error) {
      console.error('Error al cargar las rutas:', error.message);
      setError('Error al cargar las rutas guardadas.');
    }
  };

 
  //cargar Ruta en el mapa
  const cargarRutaEnMapa = (nombre) => {
    navigate(`/admin/rutas/${nombre}/`);
  };
  


  //manejo de botones VARCHAR
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosRuta({ ...datosRuta, [name]: value });
  };

  // Iniciar la ruta
  const iniciarRuta = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      return;
    }
  
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nuevaUbicacion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          alt: position.coords.altitude
        };
        setRutaGps((rutaAnterior) => [...rutaAnterior, nuevaUbicacion]);
        setUbicacionActual(nuevaUbicacion);
      },
      (error) => {
        console.error('Error al obtener la ubicación:', error.message);
        setError('Error al obtener la ubicación.');
      },
      { enableHighAccuracy: true }
    );
  
    setSeguimientoActivo(true);
    setWatchId(watchId); 
  };
  
 
  const detenerRuta = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setSeguimientoActivo(false);
    }
  };

  // Finalizar la ruta
  const finalizarRuta = async () => {
    if (!datosRuta.nombre || !datosRuta.descripcion) {
      setError('Por favor completa todos los campos antes de guardar la ruta.');
      return;
    }
    try {
      const geojsonRuta = {
        type: 'LineString',
        coordinates: rutaGps.map((punto) => [punto.lng, punto.lat]), 
      };
      const response = await axios.post('/api/admin/rutas/', {
        ...datosRuta,
        distancia_km: calcularDistancia(rutaGps),
        tiempo_estimado: '00:30:00', 
        correo_usuario: 'admin@naturaltrekking.com', 
        ruta_gps: JSON.stringify(geojsonRuta),
      });
      setMensaje('Ruta guardada exitosamente.');
      setDatosRuta({ nombre: '', descripcion: '', dificultad: 'baja' }); 
      cargarRutasGuardadas(); 
      console.log('Ruta guardada:', response.data);
    } catch (error) {
      console.error('Error al guardar la ruta:', error.message);
      setError('Error al guardar la ruta.');
    }
  };

  // Calcular distancia total de la ruta
  const calcularDistancia = (puntos) => {
    if (puntos.length < 2) return 0;

    const R = 6371; 
    const toRad = (value) => (value * Math.PI) / 180;

    let distanciaTotal = 0;
    for (let i = 1; i < puntos.length; i++) {
      const { lat: lat1, lng: lng1 } = puntos[i - 1];
      const { lat: lat2, lng: lng2 } = puntos[i];

      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanciaTotal += R * c;
    }

    return distanciaTotal.toFixed(2); // Retorna en km
  };

  //Eliminacion Rutas
  const eliminarRuta = async (nombre) => {
    try {
      const response = await axios.delete(`/api/admin/rutas/${nombre}`);
      console.log(response.data.mensaje);
      setDatosRuta(rutaGps.filter(rutas => rutas.nombre !== nombre)); 
    } catch (error) {
      console.error('Error al eliminar ruta:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenUrlHito(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //Agregar Hitos
  const agregarHito = async () => {
    if (!ubicacionActual) {
      setError('Ubicación no disponible.');
      return;
    }

    const hito = {
      nombre: nombreHito,
      descripcion: descripcionHito,
      ubicacion: `POINT(${ubicacionActual.lng} ${ubicacionActual.lat})`, 
      imagen_url: imagenUrlHito || null, 
      nombre_ruta: nombreRuta 
    };

    try {
      await axios.post('/api/admin/hitos', hito);
      setMensaje('Hito agregado con éxito');
      setNombreHito('');
      setDescripcionHito('');
      setImagenUrlHito('');
      setNombreRuta('');
    } catch (error) {
      console.error('Error al agregar el hito:', error);
      setError('No se pudo agregar el hito');
    }
  };
//-------------------------Visualizaciones-----------------------//
return (
  <div>
      <header className="app-header">
      <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
      <h1>NaturalTrekking</h1>
    </header>
  <div className="contenedor-rutas">
    <h2>Gestionar Rutas</h2>
    <div>
      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={datosRuta.nombre}
        onChange={handleInputChange}
        required
      />

      <label>Descripción:</label>
      <input
        type="text"
        name="descripcion"
        value={datosRuta.descripcion}
        onChange={handleInputChange}
        required
      />

      <label>Dificultad:</label>
      <select
        name="dificultad"
        value={datosRuta.dificultad}
        onChange={handleInputChange}
      >
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
    </div>
    <div className="botones">
  <button onClick={iniciarRuta} disabled={seguimientoActivo}className="boton-iniciar">
  <img src='/img/play.png' alt="inicio"/>Iniciar Ruta</button>
  <button onClick={detenerRuta} disabled={!seguimientoActivo}className="boton-detener">
  <img src='/img/pausa.png' alt="pausa"/>Detener Ruta</button>
  <button onClick={finalizarRuta} disabled={!rutaGps.length}className="boton-finalizar">
  <img src='/img/final.png' alt="final"/>fanalizar</button>  
</div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

    <MapaRuta rutaGps={rutaGps} ubicacionActual={ubicacionActual} />
    <h3>Agregar Un hito</h3>
    <div>
    <form onSubmit={(e) => { e.preventDefault(); agregarHito(); }}>
            <label>
              Nombre de la Ruta:
              <input type="text" value={nombreRuta} onChange={(e) => setNombreRuta(e.target.value)} required />
            </label>
          <label>
            Nombre del Hito:
            <input type="text" value={nombreHito} onChange={(e) => setNombreHito(e.target.value)} required />
          </label>
          <label>
            Descripción del Hito:
            <textarea value={descripcionHito} onChange={(e) => setDescripcionHito(e.target.value)} required />
          </label>
          <label>
            Imagen del Hito:
            <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} />
          </label>
          <button onClick={agregarHito}className="boton-hito">
      <img src='/img/hito.png' alt="senderismo"/>Agregar Hito
      </button>
        </form>

    </div>
    
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
    <div className="routes-container">
    <h3>Rutas Guardadas</h3>
    {rutasGuardadas.length > 0 ? (
      <ul>
        {rutasGuardadas.map((rutas) => (
          <li key={rutas.nombre} className="lista-rutas">
            <div className="route-detail">
              <strong>Nombre:</strong> {rutas.nombre}
            </div>
            <div className="route-detail">
              <strong>Descripción:</strong> {rutas.descripcion}
            </div>
            <div className="route-detail">
              <strong>Distancia:</strong> {rutas.distancia_km} km
            </div>
            <div class="botones">
              <button onClick={() => cargarRutaEnMapa(rutas.nombre)}className="boton-detalle">
              <img src='/img/info.png' alt="localizacion"/>Detalles Sobre la ruta</button>
              <button onClick={() => eliminarRuta(rutas.nombre)}className="boton-eliminar">
              <img src="/img/eliminar.png" alt="eliminar ruta"/>Eliminar ruta</button>              
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No hay rutas guardadas.</p>
    )}
  </div>
  </div>
  </div>
);


};

export default ManejoRutas;


/* Carcar la ruta en el mapa
  const generarRutaGps = async () => {
    const inicio = { longitude: -33.555770, latitude: -70.561515 }; // Ejemplo: Santiago, Chile
    const fin = { longitude: -33.579576, latitude: -70.558842 }; // Ejemplo: Destino
    try {
      const response = await axios.post('/api/admin/rutas/gps', { inicio, fin });
      setRutaGps(response.data); 
    } catch (error) {
      console.error('Error al generar la ruta GPS:', error.message);
    }
  };
  <button onClick={() => generarRutaGps(rutas)}className="boton-iniciar">
              <img src='/img/play.png' alt="play"/>Cargar Ruta en Mapa</button>*/

