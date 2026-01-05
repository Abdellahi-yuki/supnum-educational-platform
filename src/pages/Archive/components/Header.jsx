import React, { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';

const Header = ({ onSearch, onAdminAccess }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header>
            <center><img src="/logo-supnum.png" alt="logo-supnum" id="logo" /></center>
            <h1 id="A1">Archives des Supports de Cours</h1>
            <p>Plateforme de gestion et d'archivage des ressources pédagogiques</p>

            <div className="header-actions">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher un cours, TD ou TP..."
                        id="searchInput"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-btn" onClick={handleSearch}><Search size={20} /></button>
                </div>
                <button
                    className="admin-button"
                    onClick={onAdminAccess}
                    title="Administration"
                >
                    ⚙️
                </button>
            </div>
        </header>
    );
};

export default Header;
