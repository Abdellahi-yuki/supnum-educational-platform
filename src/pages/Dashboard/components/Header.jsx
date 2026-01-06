import React, { useState, useEffect } from 'react';
import { Settings, LogOut, Menu, X, User, Bell } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const Header = ({ user, onLogout, onChangePage }) => {
    const [activeLink, setActiveLink] = useState('Tableau de bord');
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
            onChangePage('community', { scrollToMessage: n.message_id });
        } else {
            onChangePage('community');
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
        { name: 'Tableau de bord', id: 'dashboard' },
        { name: 'Cours/Annales', id: 'archive' },
        { name: 'Notes', id: 'results' },
        { name: 'Messagerie', id: 'mail' },
        { name: 'Communauté', id: 'community' },
    ];

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-section" onClick={() => onChangePage('dashboard')} style={{ cursor: 'pointer' }}>
                    <img src="/assets/logo-supnum.png" alt="SupNum Logo" className="logo-img" />
                    <span className="logo-text">SupNum</span>
                </div>

                <nav className="nav-menu">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`nav-link ${activeLink === link.name ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveLink(link.name);
                                onChangePage(link.id);
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                <div className="header-actions">
                    <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="notification-container" style={{ position: 'relative', marginRight: '1rem' }}>
                        <button
                            className="icon-btn"
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{
                                position: 'relative',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '0.6rem',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    border: '2px solid white'
                                }}>{unreadCount}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notification-dropdown" style={{
                                position: 'absolute',
                                top: '120%',
                                right: '-50px',
                                width: '320px',
                                zIndex: 1000,
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Notifications</h3>
                                    {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600 }}>{unreadCount} non lues</span>}
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <p style={{ fontSize: '0.85rem', textAlign: 'center', color: 'var(--gray-500)', padding: '1rem 0' }}>Aucune notification</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '12px',
                                                    background: n.is_read ? 'transparent' : 'rgba(249, 115, 22, 0.05)',
                                                    cursor: 'pointer',
                                                    marginBottom: '0.5rem',
                                                    transition: 'background 0.2s',
                                                    border: n.is_read ? '1px solid transparent' : '1px solid rgba(249, 115, 22, 0.1)'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = n.is_read ? 'var(--gray-50)' : 'rgba(249, 115, 22, 0.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(249, 115, 22, 0.05)'}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.actor_name}</span>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>
                                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', margin: 0, lineHeight: '1.4' }}>
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
                                    onChangePage('settings');
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
                            href={link.href}
                            className={`mobile-nav-link ${activeLink === link.name ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveLink(link.name);
                                onChangePage(link.id);
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
