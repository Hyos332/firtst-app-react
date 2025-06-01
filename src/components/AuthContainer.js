import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthContainer = ({ onLogin, onRegister }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleSwitch = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowLogin(!showLogin);
      setIsFlipping(false);
    }, 400);
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isFlipping ? 'flipped' : ''}`}>
        {showLogin ? (
          <Login onLogin={onLogin} onSwitchToRegister={handleSwitch} />
        ) : (
          <Register onRegister={onRegister} onSwitchToLogin={handleSwitch} />
        )}
      </div>
    </div>
  );
};

export default AuthContainer; 