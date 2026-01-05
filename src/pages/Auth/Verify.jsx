import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import './Auth.css';

const Verify = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await axios.post(`${API_BASE_URL}/verify.php`, { email, code });
            if (response.data.status === 'success') {
                alert('Compte vérifié ! Connectez-vous.');
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        }
    };

    const handleResend = async () => {
        if (timeLeft > 0) return;
        setError('');
        setMessage('');
        try {
            const response = await axios.post(`${API_BASE_URL}/resend_code.php`, { email });
            if (response.data.status === 'success') {
                setMessage('Nouveau code envoyé !');
                setTimeLeft(180); // Reset timer to 3 minutes
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        }
    };

    if (!email) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p style={{ marginBottom: '1rem' }}>Email manquant.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/register')}>Retour à l'inscription</button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Vérification</h2>
                <p className="auth-subtitle">Un code a été envoyé à {email}</p>

                <div style={{
                    textAlign: 'center',
                    margin: '1.5rem 0',
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Le code expire dans :</p>
                    <p style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: timeLeft > 30 ? '#ffffff' : '#ef4444',
                        fontFamily: 'monospace'
                    }}>
                        {formatTime(timeLeft)}
                    </p>
                </div>

                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-success" style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Code de vérification"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="auth-input"
                        required
                        disabled={timeLeft <= 0}
                    />
                    <button type="submit" className="btn btn-primary btn-block" disabled={timeLeft <= 0}>
                        Vérifier
                    </button>
                </form>

                {timeLeft <= 0 && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Le code a expiré.</p>
                        <button
                            onClick={handleResend}
                            className="btn-text"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#ffffff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.9rem'
                            }}
                        >
                            Renvoyer un nouveau code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Verify;
