import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple password check - in production, use proper authentication
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

        if (password === adminPassword) {
            sessionStorage.setItem('admin-authenticated', 'true');
            onLogin();
        } else {
            setError('Mot de passe incorrect');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <h2>🔐 Administration</h2>
                    <p>Connexion requise</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Entrez le mot de passe admin"
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary">
                        Se connecter
                    </button>
                </form>

                <div className="admin-login-footer">
                    <small>💡 Mot de passe par défaut: admin123</small>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
