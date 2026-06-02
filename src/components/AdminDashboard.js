import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Map, CalendarDays, UserSquare2, Bus, LogOut } from 'lucide-react';
import '../css/adminPanel.css'

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <header className='app-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" />
          <h1>Natural Trekking</h1>
        </div>
        <button className="danger" onClick={handleLogout} style={{ padding: '8px 16px' }}>
          <LogOut size={18} /> Salir
        </button>
      </header>
      <div className="admin-panel glass-panel" style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--accent-color)' }}>Panel de Administración</h2>
        <div className="card-grid">
          <div className="data-card" onClick={() => navigate('/admin/guias')} style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
            <UserSquare2 size={48} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
            <h3>Gestionar Guías</h3>
            <p style={{ color: 'var(--text-muted)' }}>Administra los guías de la empresa</p>
          </div>
          
          <div className="data-card" onClick={() => navigate('/admin/rutas')} style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
            <Map size={48} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
            <h3>Gestionar Rutas</h3>
            <p style={{ color: 'var(--text-muted)' }}>Crea y edita senderos y mapas</p>
          </div>

          <div className="data-card" onClick={() => navigate('/admin/tours')} style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
            <CalendarDays size={48} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
            <h3>Tours Programados</h3>
            <p style={{ color: 'var(--text-muted)' }}>Organiza las próximas expediciones</p>
          </div>

          <div className="data-card" onClick={() => navigate('/admin/turistas')} style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
            <Users size={48} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
            <h3>Gestionar Pasajeros</h3>
            <p style={{ color: 'var(--text-muted)' }}>Lista de turistas e información médica</p>
          </div>

          <div className="data-card" onClick={() => navigate('/admin/transportes')} style={{ cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
            <Bus size={48} color="var(--accent-color)" style={{ marginBottom: '10px' }} />
            <h3>Gestionar Transportes</h3>
            <p style={{ color: 'var(--text-muted)' }}>Flota vehicular y conductores</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
