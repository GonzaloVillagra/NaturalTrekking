import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManejoGuias from './components/ManejoGuia';
import ManejoRutas from './components/ManejoRutas';
import GestionRutas from './components/GestionRutas';
import ManejoTuristas from './components/ManejoTuristas';
import ManejoTransportes from './components/ManejoTransportes';
import DetalleDeRuta from './components/ManejoDetalleRuta';
import ManejoHitos from './components/ManejoHitos';
import ManejoTours from './components/ManejoTours';
import ManejoTourUrbano from './components/ManejoTourUrbano';
import GuiaDashboard from './components/GuiaDashboard';
import { RutaProvider } from './context/RutaContext';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const listener = CapApp.addListener('backButton', ({ canGoBack }) => {
      const rootPaths = ['/', '/admin', '/guias'];
      if (rootPaths.includes(location.pathname)) {
        CapApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      listener.then(handle => handle.remove());
    };
  }, [navigate, location]);

  return null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    if (token && userType) {
      setIsAuthenticated(true);
      setUserType(userType);
    }
    setLoading(false);
  }, []); // Asegúrate de que el array de dependencias esté vacío

  if (loading) {
    return <div>Loading...</div>; 
  }

  const isAdmin = isAuthenticated && userType === 'admin';
  const isGuia = isAuthenticated && userType === 'guia';

  return (
    <RutaProvider>
      <Router>
        <BackButtonHandler />
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/rutas" element={isAdmin ? <GestionRutas /> : <Navigate to="/" />} />
          <Route path="/admin/rutas/grabar" element={isAdmin ? <ManejoRutas /> : <Navigate to="/" />} />
          <Route path="/admin/rutas/:nombre" element={isAdmin ? <DetalleDeRuta /> : <Navigate to="/" />} />
          <Route path="/admin/guias" element={isAdmin ? <ManejoGuias /> : <Navigate to="/" />} />
          <Route path="/admin/hitos" element={isAdmin ? <ManejoHitos /> : <Navigate to="/" />} />
          <Route path='/admin/tours' element={isAdmin ? <ManejoTours /> : <Navigate to="/" />} />
          <Route path='/admin/tours/urbano' element={isAdmin ? <ManejoTourUrbano /> : <Navigate to="/" />} />
          <Route path='/admin/turistas' element={isAdmin ? <ManejoTuristas /> : <Navigate to="/" />} />
          <Route path='/admin/transportes' element={isAdmin ? <ManejoTransportes /> : <Navigate to="/" />} />
          <Route path="/guias" element={isGuia ? <GuiaDashboard /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </RutaProvider>
  );
};

export default App;