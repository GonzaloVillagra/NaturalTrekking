import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManejoGuias from './components/ManejoGuia';
import ManejoRutas from './components/ManejoRutas';
import ManejoCliente from './components/ManejoClientes';
import ManejoTransportes from './components/ManejoTransportes';
import DetalleDeRuta from './components/ManejoDetalleRuta';
import ManejoHitos from './components/ManejoHitos';
import GuiaDashboard from './components/GuiaDashboard';

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
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  const isAdmin = isAuthenticated && userType === 'admin';
  const isGuia = isAuthenticated && userType === 'guia';
  const correoGuia = 'guia1@naturaltrekking.com';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/rutas" element={isAdmin ? <ManejoRutas /> : <Navigate to="/" />} />
        <Route path="/admin/rutas/:nombre" element={isAdmin ? <DetalleDeRuta /> : <Navigate to="/" />} />
        <Route path="/admin/guias" element={isAdmin ? <ManejoGuias /> : <Navigate to="/" />} />
        <Route path="/admin/hitos" element={isAdmin ? <ManejoHitos /> : <Navigate to="/" />} />
        <Route path='/admin/clientes' element={isAdmin ? <ManejoCliente /> : <Navigate to="/" />} />
        <Route path='/admin/transportes' element={isAdmin ? <ManejoTransportes /> : <Navigate to="/" />} />
        <Route path="/guias" element={isGuia ? <GuiaDashboard correo={correoGuia} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;