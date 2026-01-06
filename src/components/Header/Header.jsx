import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Menu, X, User, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../apiConfig';
import './Header.css';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_BASE_URL}/community_notifications.php?user_id=${user.id}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setNotifications(data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const markNotificationRead = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/community_notifications.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking notification read:', error);
        }
    };

    const handleNotificationClick = (n) => {
        markNotificationRead(n.id);
        setShowNotifications(false);
        if (n.message_id) {
            navigate('/community', { state: { scrollToMessage: n.message_id } });
        } else {
            navigate('/community');
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getInitials = () => {
        if (user && user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return 'M';
    };

    const getUserName = () => {
        if (user && user.first_name) return user.first_name;
        return 'Etudiant';
    };

    const navLinks = [
        { name: 'Tableau de bord', path: '/dashboard' },
        { name: 'Cours/Annales', path: '/archive' },
        { name: 'Notes', path: '/dashboard/results' },
        { name: 'Messagerie', path: '/mail' },
        { name: 'Communauté', path: '/community' },
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-section" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/assets/logo-supnum.png" alt="SupNum Logo" className="logo-img" />
                    <span className="logo-text">SupNum</span>
                </div>

                <nav className="nav-menu">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(link.path);
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="header-actions">
                    <div className="notification-container" style={{ position: 'relative' }}>
                        <button
                            className="icon-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown">
                                <div className="notification-dropdown-header">
                                    <h3>Notifications</h3>
                                    {unreadCount > 0 && <span>{unreadCount} non lues</span>}
                                </div>
                                <div className="notification-list">
                                    {notifications.length === 0 ? (
                                        <p className="no-notifications">Aucune notification</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                className={`notification-item ${n.is_read ? 'read' : 'unread'}`}
                                                onClick={() => handleNotificationClick(n)}
                                            >
                                                <div className="notification-item-top">
                                                    <span className="actor-name">{n.actor_name}</span>
                                                    <span className="notification-time">
                                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="notification-text">
                                                    {n.type === 'reply' ? 'a répondu à votre message' : 'a commenté votre publication'}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-container" style={{ position: 'relative' }}>
                        <div
                            className="user-profile"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="user-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {user?.profile_pic ? (
                                    <img
                                        src={`${API_BASE_URL}/${user.profile_pic}`}
                                        alt="Avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    getInitials()
                                )}
                                <span className="status-dot"></span>
                            </div>
                            <span className="user-name">{getUserName()}</span>
                        </div>

                        {showDropdown && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => {
                                    navigate('/dashboard/settings');
                                    setShowDropdown(false);
                                }}>
                                    <Settings size={16} /> Mon Profil
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item danger" onClick={onLogout}>
                                    <LogOut size={16} /> Déconnexion
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(link.path);
                                setIsMenuOpen(false);
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="mobile-menu-divider"></div>
                    <button className="mobile-nav-link danger" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }} onClick={onLogout}>
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
