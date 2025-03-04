import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/adminPanel.css'


const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <header className='app-header'>
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
        <h1>Natural Trekking</h1>
      </header>
      <div className="admin-panel">
        <h1>Panel de Administración</h1>
        <nav>
          <button onClick={() => navigate('/admin/guias')}>Gestionar Guías</button>
          <button onClick={() => navigate('/admin/rutas')}>Gestionar Rutas</button>
          <button onClick={() => navigate('/admin/clientes')}>Gestionar Clientes</button>
          <button onClick={() => navigate('/admin/transportes')}>Gestionar Transportes</button>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
