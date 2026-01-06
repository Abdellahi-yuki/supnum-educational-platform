import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';

// Configure Axios to send credentials (cookies) in every request
axios.defaults.withCredentials = true;
// Header is now global
import WelcomeBanner from './components/WelcomeBanner';
import CardsGrid from './components/CardsGrid';
import Settings from './components/Settings';
import Results from './components/Results';
import Archive from './components/Archive';
import Mail from './components/Mail';
import Community from './components/Community';

function DashboardLayout({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleChangePage = (page, state = null) => {
    setCurrentPage(page);
    if (page === 'dashboard') navigate('/dashboard', { state });
    if (page === 'settings') navigate('/dashboard/settings', { state });
    if (page === 'results') navigate('/dashboard/results', { state });
    if (page === 'archive') navigate('/dashboard/archive', { state });
    if (page === 'mail') navigate('/dashboard/mail', { state });
    if (page === 'community') navigate('/dashboard/community', { state });
  };

  return (
    <div className="app dashboard-container">
      {/* Global Header is now in App.jsx */}
      <div className="main-container no-sidebar">
        <main className="content-area">
          <Routes>
            <Route index element={
              <>
                <WelcomeBanner user={user} />
                <CardsGrid onCardClick={handleChangePage} />
              </>
            } />
            <Route path="settings" element={<Settings user={user} onUpdateUser={onUpdateUser} />} />
            <Route path="results" element={<Results />} />
            <Route path="archive" element={<Archive />} />
            <Route path="mail" element={<Mail />} />
            <Route path="community" element={<Community user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Dashboard() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  });

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <Routes>
      <Route
        path="/*"
        element={user ? <DashboardLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default Dashboard;
