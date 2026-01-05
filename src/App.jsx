import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Mail from './pages/Mail/Mail';
import Community from './pages/Community/Community';
import Archive from './pages/Archive/Archive';
import Header from './components/Header/Header';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Verify from './pages/Auth/Verify';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Check if current path is an auth page
  const isAuthPage = ['/login', '/register', '/verify'].includes(window.location.pathname);

  return (
    <>
      {!isAuthPage && <Header user={user} onLogout={handleLogout} />}
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/*" element={<Dashboard />} />
          <Route path="/mail/*" element={<Mail />} />
          <Route path="/community/*" element={<Community currentUser={user} onLogout={handleLogout} />} />
          <Route path="/archive/*" element={<Archive />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
