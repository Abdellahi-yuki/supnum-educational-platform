import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import './Auth.css';

import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login.php`, { email, password });

            if (response.data.status === 'success') {
                login(response.data.user);
                // Redirect based on role
                if (response.data.user.role === 'Root') {
                    navigate('/settings');
                } else {
                    navigate('/dashboard');
                }
            } else if (response.data.status === 'unverified') {
                // Seamless redirect to verify page
                navigate('/verify', { state: { email: response.data.email } });
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Erreur de connexion');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Diamond Logo Center */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <img src="/assets/logo-supnum.png" alt="SupNum Logo" style={{ height: '80px', width: 'auto' }} />
                </div>

                <h2 className="auth-title">Connexion</h2>
                <p className="auth-subtitle">Accédez à votre espace SupNum</p>
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        required
                    />
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="auth-input"
                            style={{ paddingRight: '3.5rem' }}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
                </form>
                <p className="auth-link" onClick={() => navigate('/register')}>Pas encore de compte ? S'inscrire</p>
            </div>
        </div>
    );
};

export default Login;
