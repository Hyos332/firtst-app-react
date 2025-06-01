import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className={`home-bg-animated`}>
      <div className={`home-container ${show ? 'show' : ''}`}>
        <div className="home-header">
          <h1 className="home-title">Open BEER</h1>
        </div>
        <div className="home-content">
          <h2 className="home-welcome">EMPECEMOS</h2>
          <p className="home-desc">Para comenzar a servir debes iniciar sesión o registrarte.</p>
          <button className="home-btn" onClick={() => navigate('/age-check')}>Registrarme</button>
          <button className="home-btn secondary" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Home; 