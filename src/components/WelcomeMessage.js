import React, { useEffect, useState } from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = ({ userName }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`welcome-container ${show ? 'show' : ''}`}>
      <h1 className="welcome-title">
        Bienvenido, <span className="user-name">{userName}</span>
      </h1>
    </div>
  );
};

export default WelcomeMessage; 