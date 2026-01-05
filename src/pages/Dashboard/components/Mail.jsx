import React from 'react';
import { Mail as MailIcon, Send, Inbox, Star, Trash2 } from 'lucide-react';

const Mail = () => {
    return (
        <div className="content-container">
            <div className="welcome-banner" style={{ minHeight: '180px', padding: '2rem', background: 'linear-gradient(120deg, #2EAB4E, #1C3586)' }}>
                <div className="welcome-content">
                    <h1 className="welcome-title" style={{ fontSize: '2.5rem' }}>Messagerie</h1>
                    <p className="welcome-subtitle">Communiquez avec vos professeurs et l'administration.</p>
                </div>
            </div>

            <div className="settings-card" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(46, 171, 78, 0.1)',
                        color: 'var(--primary-green)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <MailIcon size={40} />
                    </div>
                    <h2 className="settings-title">Messagerie SupNum</h2>
                    <p className="settings-subtitle">Votre espace de communication sécurisé arrive bientôt. Vous pourrez envoyer et recevoir des messages directement sur la plateforme.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Inbox size={20} color="var(--primary-blue)" />
                            <span style={{ fontWeight: 700 }}>Boîte de réception</span>
                        </div>
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Send size={20} color="var(--primary-green)" />
                            <span style={{ fontWeight: 700 }}>Messages envoyés</span>
                        </div>
                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Star size={20} color="var(--warning)" />
                            <span style={{ fontWeight: 700 }}>Favoris</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mail;
