import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>SupNum Educational Platform</h1>
            <div className="modules-grid">
                <Link to="/mail" className="module-card mail">
                    <div className="icon"><i className="fas fa-envelope"></i></div>
                    <h2>Mail</h2>
                    <p>Check your emails and messages.</p>
                </Link>
                <Link to="/community" className="module-card community">
                    <div className="icon"><i className="fas fa-users"></i></div>
                    <h2>Community</h2>
                    <p>Chat with your groups and friends.</p>
                </Link>
                <Link to="/archive" className="module-card archive">
                    <div className="icon"><i className="fas fa-archive"></i></div>
                    <h2>Archive</h2>
                    <p>Access educational resources and archives.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
