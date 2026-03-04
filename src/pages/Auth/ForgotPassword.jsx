import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(`${API_BASE_URL}/forgot_password.php`, { email });
            if (response.data.status === 'success') {
                setMessage(response.data.message);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Erreur lors de la demande. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <img src="/assets/logo-supnum.png" alt="SupNum Logo" style={{ height: '80px', width: 'auto' }} />
                </div>

                <h2 className="auth-title">Réinitialisation</h2>
                <p className="auth-subtitle">Saisissez votre email pour recevoir un lien de récupération.</p>

                {message ? (
                    <div className="auth-success-box" style={{ textAlign: 'center', padding: '1rem' }}>
                        <CheckCircle size={48} color="var(--primary-green)" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: '600', color: 'var(--p-text-main)' }}>{message}</p>
                        <button
                            className="btn btn-primary btn-block"
                            style={{ marginTop: '1.5rem' }}
                            onClick={() => navigate('/login')}
                        >
                            Retour à la connexion
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <p className="auth-error">{error}</p>}
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="votre.nom@supnum.mr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>
                    </form>
                )}

                <p className="auth-link" onClick={() => navigate('/login')}>
                    <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Retour à la connexion
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
