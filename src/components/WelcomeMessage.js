import React, { useEffect, useState } from 'react';
import './WelcomeMessage.css';

const WelcomeMessage = ({ name }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`welcome-container ${show ? 'show' : ''}`}>
      <h1 className="welcome-title">
        Bienvenido, <span className="user-name">{name}</span>
      </h1>
    </div>
  );
};

export default WelcomeMessage; 