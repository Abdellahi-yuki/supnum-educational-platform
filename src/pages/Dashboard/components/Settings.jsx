import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import { Camera, Lock, User, Mail } from 'lucide-react';

const Settings = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        current_password: '',
        new_password: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profile_pic ? `${API_BASE_URL}/${user.profile_pic}` : null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        const data = new FormData();
        data.append('current_email', user.email);
        data.append('first_name', formData.first_name);
        data.append('last_name', formData.last_name);
        data.append('email', formData.email);
        data.append('current_password', formData.current_password);
        data.append('new_password', formData.new_password);

        if (profilePic) {
            data.append('profile_pic', profilePic);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/update_profile.php`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                setMessage('Profil mis à jour avec succès !');
                onUpdateUser(response.data.user);
                setFormData(prev => ({ ...prev, current_password: '', new_password: '' }));
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="settings-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="settings-card glass-card" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(40px)' }}>
                <h2 className="settings-title" style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1C3586' }}>Mon Profil</h2>
                <p className="settings-subtitle" style={{ color: '#475569', marginBottom: '2rem' }}>Modifiez vos informations personnelles et votre photo</p>

                {message && <p className="success-message" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>{message}</p>}
                {error && <p className="auth-error" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} className="settings-form">
                    {/* Profile Picture Upload */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', display: 'inline-block', left: '50%', transform: 'translateX(-50%)' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '4px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 8px 32px rgba(28, 53, 134, 0.15)',
                            background: 'rgba(255, 255, 255, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={60} color="#64748b" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            <Camera size={18} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div className="form-group-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>Prénom</label>
                            <input
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="auth-input"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)', color: '#0f172a' }}
                                required
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>Nom</label>
                            <input
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="auth-input"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)', color: '#0f172a' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="auth-input"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)', color: '#0f172a' }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>Nouveau mot de passe (optionnel)</label>
                        <input
                            name="new_password"
                            type="password"
                            placeholder="Laisser vide pour ne pas changer"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="auth-input"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.05)', color: '#0f172a' }}
                        />
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        background: 'rgba(28, 53, 134, 0.05)',
                        border: '1px solid rgba(28, 53, 134, 0.1)'
                    }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', fontSize: '0.9rem', color: '#1C3586', fontWeight: '700' }}>
                            <Lock size={16} /> Confirmation requise
                        </label>
                        <input
                            name="current_password"
                            type="password"
                            placeholder="Entrez votre mot de passe actuel"
                            value={formData.current_password}
                            onChange={handleChange}
                            className="auth-input"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(28, 53, 134, 0.2)', color: '#0f172a' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-block"
                        style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            borderRadius: '16px'
                        }}
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
