import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Mi Todo App</h1>
      </div>
      <div className="navbar-right">
        <span className="user-welcome">Bienvenido, {user?.name}</span>
        <button onClick={onLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 