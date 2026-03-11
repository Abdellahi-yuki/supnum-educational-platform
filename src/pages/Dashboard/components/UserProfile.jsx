import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Calendar, Mail, User, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, FILE_BASE_URL } from '../apiConfig';
import './UserProfile.css';

const UserProfile = ({ userId, onBack, currentUser }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user_profile.php?user_id=${userId}`);
            const data = await response.json();
            if (data && !data.error) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary-blue)" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-empty-state" style={{ margin: '4rem auto', maxWidth: '400px' }}>
                <p className="empty-state-text">Profil non trouvé</p>
                <button onClick={onBack} className="primary-btn" style={{ marginTop: '1rem' }}>
                    Retour
                </button>
            </div>
        );
    }

    const { user, messages } = profile;
    const isMe = currentUser && currentUser.id == user.id;

    return (
        <div className="user-profile-container">
            {/* Header with back button */}
            <button onClick={onBack} className="profile-back-btn">
                <ArrowLeft size={20} />
                <span>Retour</span>
            </button>

            {/* Profile Card */}
            <div className="profile-main-card">
                <div className="profile-card-inner">
                    <div className="profile-header-top">
                        {/* Avatar */}
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-box">
                                {user.profile_path ? (
                                    <img src={`${FILE_BASE_URL}${user.profile_path}`} alt="" className="profile-avatar-img" />
                                ) : (
                                    <span className="profile-avatar-placeholder">
                                        {user.username?.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isMe && (
                            <button
                                onClick={() => navigate('/mail', { state: { composeWithEmail: user.email } })}
                                className="profile-message-btn"
                            >
                                <Send size={20} />
                                Envoyer un message
                            </button>
                        )}
                    </div>

                    <div className="profile-info">
                        <h1 className="profile-username">
                            {user.username}
                        </h1>
                        <div className="profile-meta">
                            <div className="profile-meta-item">
                                <Mail size={18} />
                                <span>{user.email}</span>
                            </div>
                            <div className="profile-meta-item">
                                <Calendar size={18} />
                                <span>
                                    Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="profile-stats-grid">
                        <div className="profile-stat-item messages">
                            <div className="stat-value blue">
                                {user.message_count}
                            </div>
                            <div className="stat-label">
                                Messages Postés
                            </div>
                        </div>
                        <div className="profile-stat-item comments">
                            <div className="stat-value green">
                                {user.comment_count}
                            </div>
                            <div className="stat-label">
                                Commentaires
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Section */}
            <div className="profile-messages-section">
                <h2 className="section-title">
                    <div className="title-icon-box">
                        <MessageSquare size={28} />
                    </div>
                    Messages récents
                </h2>

                {messages.length === 0 ? (
                    <div className="profile-empty-state">
                        <MessageSquare size={48} color="var(--p-text-dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p className="empty-state-text">Aucun message pour le moment</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {messages.map(msg => (
                            <div key={msg.id} className="profile-msg-card">
                                {msg.media_url && (
                                    <div className="msg-media-wrapper">
                                        {msg.type === 'image' ? (
                                            <img
                                                src={`${FILE_BASE_URL}${msg.media_url}`}
                                                alt=""
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '400px',
                                                    width: '100%',
                                                    objectFit: 'contain',
                                                    display: 'block'
                                                }}
                                            />
                                        ) : msg.type === 'video' ? (
                                            <video
                                                controls
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '400px',
                                                    display: 'block'
                                                }}
                                            >
                                                <source src={`${FILE_BASE_URL}${msg.media_url}`} />
                                            </video>
                                        ) : null}
                                    </div>
                                )}
                                <p className="msg-content">
                                    {msg.content}
                                </p>
                                <div className="msg-footer">
                                    <span>{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    <div className="msg-comments-count">
                                        <MessageSquare size={16} />
                                        <span>{msg.comment_count} commentaire{msg.comment_count !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
