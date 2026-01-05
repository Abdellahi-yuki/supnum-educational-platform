import React from 'react';
import { Archive as ArchiveIcon, BookOpen, Download, Search } from 'lucide-react';

const Archive = () => {
    return (
        <div className="content-container">
            <div className="welcome-banner" style={{ minHeight: '180px', padding: '2rem' }}>
                <div className="welcome-content">
                    <h1 className="welcome-title" style={{ fontSize: '2.5rem' }}>Cours & Annales</h1>
                    <p className="welcome-subtitle">Accédez à toutes les ressources pédagogiques de SupNum.</p>
                </div>
            </div>

            <div className="settings-card" style={{ maxWidth: '1000px', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--primary-blue)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <ArchiveIcon size={40} />
                    </div>
                    <h2 className="settings-title">Bibliothèque Numérique</h2>
                    <p className="settings-subtitle">Cette section est en cours de développement. Vous y retrouverez bientôt tous vos supports de cours, TD et examens.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '22px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <BookOpen size={24} color="var(--primary-blue)" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Supports de cours</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>PDF, slides et documents officiels.</p>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '22px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <Search size={24} color="var(--primary-green)" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Annales</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Sujets d'examens des années précédentes.</p>
                        </div>
                        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '22px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                            <Download size={24} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                            <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Téléchargement</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Accès hors-ligne à tous vos fichiers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Archive;
