import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Mail from './pages/Mail/Mail';
import Community from './pages/Community/Community';
import Archive from './pages/Archive/Archive';
import Header from './components/Header/Header';
import './App.css';

function App() {
  // Mock user for Community app
  const mockUser = {
    id: 1,
    username: 'DemoUser',
    email: 'demo@supnum.mr',
    role: 'user'
  };

  return (
    <>
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/community" element={<Community currentUser={mockUser} />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
