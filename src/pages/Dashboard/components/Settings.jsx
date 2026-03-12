import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, getFileUrl } from '../apiConfig';
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
    const [previewUrl, setPreviewUrl] = useState(user?.profile_pic ? getFileUrl(user.profile_pic) : null);
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
        <div className="settings-container">
            <div className="settings-card glass-card">
                <h2 className="settings-title">Mon Profil</h2>
                <p className="settings-subtitle">Modifiez vos informations personnelles et votre photo</p>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleSubmit} className="settings-form">
                    {/* Profile Picture Upload */}
                    <div className="profile-upload-section">
                        <div className="profile-pic-preview">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" />
                            ) : (
                                <User size={60} className="default-user-icon" />
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="camera-upload-btn"
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

                    <div className="form-group-row">
                        <div className="form-field">
                            <label className="form-label">Prénom</label>
                            <input
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Nom</label>
                            <input
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Nouveau mot de passe (optionnel)</label>
                        <input
                            name="new_password"
                            type="password"
                            placeholder="Laisser vide pour ne pas changer"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="auth-input"
                        />
                    </div>

                    <div className="confirmation-box">
                        <label className="form-label confirmation-label">
                            <Lock size={16} /> Confirmation requise
                        </label>
                        <input
                            name="current_password"
                            type="password"
                            placeholder="Entrez votre mot de passe actuel"
                            value={formData.current_password}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-block submit-btn"
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
