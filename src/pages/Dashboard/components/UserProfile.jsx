import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Calendar, Mail, User, Loader2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, FILE_BASE_URL } from '../apiConfig';

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
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <p>Profil non trouvé</p>
                <button onClick={onBack} className="primary-btn" style={{ marginTop: '1rem' }}>
                    Retour
                </button>
            </div>
        );
    }

    const { user, messages } = profile;
    const isMe = currentUser && currentUser.id == user.id;

    return (
        <div className="user-profile-container" style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            minHeight: 'calc(100vh - 120px)',
            animation: 'fadeIn 0.5s ease'
        }}>
            {/* Header with back button */}
            <button
                onClick={onBack}
                className="icon-btn"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '16px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    border: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
                <ArrowLeft size={20} />
                <span>Retour</span>
            </button>

            {/* Profile Card */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                marginBottom: '2.5rem'
            }}>
                <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '30px',
                            background: 'white',
                            padding: '6px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '24px',
                                background: 'var(--primary-blue)',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {user.profile_path ? (
                                    <img src={`${FILE_BASE_URL}${user.profile_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white' }}>
                                        {user.username?.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {!isMe && (
                            <button
                                onClick={() => navigate('/mail', { state: { composeWithEmail: user.email } })}
                                style={{
                                    marginBottom: '1rem',
                                    background: 'var(--primary-green)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(46, 171, 78, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Send size={20} />
                                Envoyer un message
                            </button>
                        )}
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#1a202c', letterSpacing: '-0.02em' }}>
                            {user.username}
                        </h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4a5568', background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                                <Mail size={18} />
                                <span style={{ fontWeight: 600 }}>{user.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4a5568', background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                                <Calendar size={18} />
                                <span style={{ fontWeight: 600 }}>
                                    Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '3rem'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(28, 53, 134, 0.05) 0%, rgba(28, 53, 134, 0.02) 100%)',
                            padding: '2rem',
                            borderRadius: '24px',
                            textAlign: 'center',
                            border: '1px solid rgba(28, 53, 134, 0.1)'
                        }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-blue)', marginBottom: '0.5rem', lineHeight: 1 }}>
                                {user.message_count}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#4a5568', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Messages Postés
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(46, 171, 78, 0.05) 0%, rgba(46, 171, 78, 0.02) 100%)',
                            padding: '2rem',
                            borderRadius: '24px',
                            textAlign: 'center',
                            border: '1px solid rgba(46, 171, 78, 0.1)'
                        }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-green)', marginBottom: '0.5rem', lineHeight: 1 }}>
                                {user.comment_count}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: '#4a5568', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Commentaires
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Section */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(30px)',
                borderRadius: '32px',
                padding: '2.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1a202c' }}>
                    <div style={{ background: '#ebf4ff', padding: '12px', borderRadius: '16px', color: 'var(--primary-blue)' }}>
                        <MessageSquare size={28} />
                    </div>
                    Messages récents
                </h2>

                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <MessageSquare size={48} color="#cbd5e0" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#718096', fontWeight: 600, fontSize: '1.1rem' }}>Aucun message pour le moment</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                                }}
                            >
                                {msg.media_url && (
                                    <div style={{ marginBottom: '1.5rem', borderRadius: '16px', overflow: 'hidden', background: '#f7fafc', border: '1px solid #edf2f7' }}>
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
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1.5rem', color: '#2d3748', fontWeight: 500 }}>
                                    {msg.content}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #edf2f7',
                                    color: '#718096',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}>
                                    <span>{new Date(msg.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)' }}>
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
