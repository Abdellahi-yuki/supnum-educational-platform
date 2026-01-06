import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer shadow-soft">
            <div className="footer-container">
                <div className="footer-content">
                    <p className="footer-text">
                        &copy; 2026 Developed by <span className="pixel-craft">PixelCraft</span>
                    </p>
                    <div className="footer-links">
                        <span className="footer-tag">Education</span>
                        <span className="footer-dot">•</span>
                        <span className="footer-tag">Future</span>
                        <span className="footer-dot">•</span>
                        <span className="footer-tag">Innovation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
