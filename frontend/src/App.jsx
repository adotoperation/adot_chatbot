import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('adot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.remember) {
      localStorage.setItem('adot_user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('adot_user');
  };

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
