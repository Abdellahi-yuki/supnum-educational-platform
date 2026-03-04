import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import './Auth.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !email) {
            setStatus('error');
            setMessage('Lien de réinitialisation invalide ou manquant.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/reset_password.php`, {
                email,
                token,
                new_password: password
            });

            if (response.data.status === 'success') {
                setStatus('success');
                setMessage(response.data.message);
            } else {
                setStatus('error');
                setMessage(response.data.message);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Une erreur est survenue lors de la réinitialisation.');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <CheckCircle size={64} color="var(--primary-green)" style={{ marginBottom: '1.5rem' }} />
                        <h2 className="auth-title">Succès !</h2>
                        <p style={{ fontWeight: '600', color: 'var(--p-text-main)', marginBottom: '2rem' }}>{message}</p>
                        <button className="btn btn-primary btn-block" onClick={() => navigate('/login')}>
                            Se connecter maintenant
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <img src="/assets/logo-supnum.png" alt="SupNum Logo" style={{ height: '80px', width: 'auto' }} />
                </div>

                <h2 className="auth-title">Nouveau mot de passe</h2>
                <p className="auth-subtitle">Choisissez un mot de passe sécurisé pour votre compte.</p>

                {status === 'error' ? (
                    <div className="auth-error-box" style={{ textAlign: 'center', padding: '1rem' }}>
                        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: '600', color: 'var(--danger)' }}>{message}</p>
                        <button
                            className="btn btn-secondary btn-block"
                            style={{ marginTop: '1.5rem', background: 'var(--gray-200)', color: 'var(--gray-700)' }}
                            onClick={() => navigate('/forgot-password')}
                        >
                            Demander un nouveau lien
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="password-wrapper" style={{ marginBottom: '1rem' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nouveau mot de passe"
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
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="password-wrapper" style={{ marginBottom: '2rem' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="auth-input"
                                style={{ paddingRight: '3.5rem' }}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Réinitialisation...' : 'Mettre à jour le mot de passe'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
