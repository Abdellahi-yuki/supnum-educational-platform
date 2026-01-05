import React from 'react';

const WelcomeBanner = ({ user }) => {
    const getFirstName = () => {
        if (user && user.first_name) return user.first_name;
        return 'Etudiant';
    };

    const getFullName = () => {
        if (user && user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
        return 'Etudiant';
    };

    return (
        <section className="welcome-banner" style={{ display: 'flex', zIndex: 1, position: 'relative' }}>
            <div className="welcome-content">
                <h1 className="welcome-title">Bienvenue, {getFirstName()} !</h1>
                <p className="welcome-subtitle">
                    Ravi de vous revoir, {getFullName()}. Prêt pour une nouvelle journée productive ?
                </p>
            </div>
        </section>
    );
};

export default WelcomeBanner;
