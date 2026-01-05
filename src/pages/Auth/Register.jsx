import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'user' // Default to user (student), no UI to change it
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { first_name, last_name, email, password, role } = formData;

        if (!email.endsWith('@supnum.mr')) {
            setError('L\'email doit finir par @supnum.mr');
            return;
        }
        try {
            // AuthController expects { email, password } for signup, but we might want to send username too if we update backend
            // For now, let's send what AuthController expects.
            // Wait, AuthController.php uses email to generate username: $username = explode('@', $email)[0];
            // It ignores first_name and last_name.
            // We should update AuthController to accept username if we want to use first/last name, 
            // OR just proceed with email/password as per current backend implementation.
            // Current backend: $input['email'], $input['password'].

            const response = await axios.post(`${API_BASE_URL}/register.php`, { first_name, last_name, email, password, role });
            if (response.data.status === 'success') {
                // Redirect directly without alert
                navigate('/verify', { state: { email } });
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(`Erreur serveur: ${err.response.data.message}`);
            } else {
                setError('Erreur de connexion');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Diamond Logo Center */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <img src="/assets/logo-supnum.jpg" alt="SupNum Logo" style={{ height: '80px', width: 'auto' }} />
                </div>

                <h2 className="auth-title">Créer un compte</h2>
                <p className="auth-subtitle">Rejoignez SupNum Dashboard</p>
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group-row">
                        <input
                            name="first_name"
                            type="text"
                            placeholder="Prénom"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                        <input
                            name="last_name"
                            type="text"
                            placeholder="Nom"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    </div>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email (@supnum.mr)"
                        value={formData.email}
                        onChange={handleChange}
                        className="auth-input"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        className="auth-input"
                        required
                    />

                    {/* Role Selection REMOVED as per request */}

                    <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
                </form>
                <p className="auth-link" onClick={() => navigate('/login')}>Déjà un compte ? Se connecter</p>
            </div>
        </div>
    );
};

export default Register;
