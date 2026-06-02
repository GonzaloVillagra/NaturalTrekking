import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import '../css/loginPanel.css';

const Login = ({ setIsAuthenticated, setUserType }) => {
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, correo: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando datos de login:', formData);

    if (!formData.correo || !formData.contraseña) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.token) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.correo);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        localStorage.setItem('userType', response.data.user.tipo);
        localStorage.setItem('token', response.data.token);
        
        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setUserType) setUserType(response.data.user.tipo);
        
        console.log('Login exitoso. Token y tipo de usuario almacenados.', response.data);

        setTimeout(() => {
          console.log("Redirigiendo a:", response.data.user.tipo);
          if (response.data.user.tipo === 'admin') {
            navigate('/admin');
          } else if (response.data.user.tipo === 'guia') {
            navigate('/guias');
          } else {
            setMessage('Tipo de usuario desconocido');
          }
        }, 100);
      } else {
        setMessage('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : 'Error de red o servidor';
      setMessage(errorMsg);
      console.error('Error al iniciar sesión:', errorMsg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src="/img/LogoNT.png" alt="Logo de NaturalTrekking" className="login-logo logo-animado" />
        <h2>Inicio de Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                style={{ paddingLeft: '45px' }}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                style={{ paddingLeft: '45px' }}
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 'auto', marginBottom: '0' }}
            />
            <label htmlFor="rememberMe" style={{ marginBottom: '0' }}>Recordar usuario</label>
          </div>
          <button type="submit" className="btn-login primary">
            <LogIn size={20} />
            Iniciar Sesión
          </button>
        </form>
        {message && <div className="error-text" style={{ marginTop: '20px' }}>{message}</div>}
      </div>
    </div>
  );
};

export default Login;
