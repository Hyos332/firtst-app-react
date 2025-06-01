import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import TodoList from './components/TodoList';
import AuthContainer from './components/AuthContainer';
import WelcomeMessage from './components/WelcomeMessage';
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <>
          <Navbar onLogout={handleLogout} />
          <WelcomeMessage name={user.name} />
          <TodoList />
        </>
      ) : (
        <AuthContainer onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

export default App;
