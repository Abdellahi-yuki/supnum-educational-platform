import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashwordMessages from './Community.jsx';
import LoginPage from './LoginPage.jsx';

const CommunityEntry = ({ currentUser: propUser }) => {
    const [currentUser, setCurrentUser] = useState(propUser || null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('facechat_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
            } catch (err) {
                console.error('Error parsing stored user:', err);
                localStorage.removeItem('facechat_user');
            }
        } else if (propUser) {
            setCurrentUser(propUser);
        }
        setLoading(false);
    }, [propUser]);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('facechat_user', JSON.stringify(user));
    };

    const handleLogout = () => {
        localStorage.removeItem('facechat_user');
        setCurrentUser(null);
    };

    // Show loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#F0F2F5'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px'
                    }}>💬</div>
                    <div style={{
                        color: '#1877F2',
                        fontSize: '18px',
                        fontWeight: '600'
                    }}>Loading FaceChat...</div>
                </div>
            </div>
        );
    }

    // Show login or main app
    return (
        <div>
            {currentUser ? (
                <DashwordMessages currentUser={currentUser} onLogout={handleLogout} />
            ) : (
                <LoginPage onLogin={handleLogin} />
            )}
        </div>
    );
};

export default CommunityEntry;
