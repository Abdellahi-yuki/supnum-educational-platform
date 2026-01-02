import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="global-header">
            <div className="header-logo">
                <img src="https://via.placeholder.com/40" alt="SupNum Logo" />
                <h1>SupNum Platform</h1>
            </div>

            <div className="header-actions">
                <button className="header-btn" title="Settings">
                    <i className="fas fa-gear"></i>
                </button>
                <button className="header-btn logout" title="Logout">
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
