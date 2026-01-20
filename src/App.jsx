
import {useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Mail from './pages/Mail/Mail';
import Community from './pages/Community/Community';
import Archive from './pages/Archive/Archive';
import Results from './pages/Results/Results';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Verify from './pages/Auth/Verify';
import Landing from './pages/Landing/Landing';
import RootSettings from './pages/Settings/RootSettings';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Check visibility for Header/Footer
  const authRoutes = ['/login', '/register', '/verify'];
  const isLandingPage = location.pathname === '/';
  const isAuthPage = authRoutes.includes(location.pathname);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  // Root/Admin Route Wrapper
  const StaffRoute = ({ children }) => {
    if (!user || (user.role !== 'Root' && user.role !== 'teacher')) return <Navigate to="/dashboard" replace />;
    return children;
  };

  return (
    <>
      {!isAuthPage && <Header user={user} onLogout={logout} />}
      <div className="app-content">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/mail/*" element={
            <ProtectedRoute>
              <Mail />
            </ProtectedRoute>
          } />
          <Route path="/community/*" element={
            <ProtectedRoute>
              <Community user={user} onLogout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/archive/*" element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          } />
          <Route path="/results/*" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          <Route path="/settings/*" element={
            <StaffRoute>
              <RootSettings />
            </StaffRoute>
          } />

          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
