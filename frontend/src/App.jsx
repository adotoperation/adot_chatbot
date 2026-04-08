import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './index.css';

function App() {
  // Always logged in as a guest
  const user = { username: 'Guest' };

  return (
    <div className="app-container">
      <Chat user={user} />
    </div>
  );
}

export default App;
