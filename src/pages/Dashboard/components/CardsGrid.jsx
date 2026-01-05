import React from 'react';
import { Archive, Mail, MessageSquare, Layers, Award } from 'lucide-react';

const DashboardCard = ({ icon: Icon, colorClass, title, description, buttonText, buttonClass, onClick }) => (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div className="card-header">
            <div className={`card-icon ${colorClass}`}>
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className="card-content">
                <h2 className="card-title">{title}</h2>
                <p className="card-description">{description}</p>
            </div>
        </div>
        <div className="card-footer">
            <button className={`btn ${buttonClass}`} onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}>{buttonText}</button>
        </div>
    </div>
);

const CardsGrid = ({ onCardClick }) => {
    const cards = [
        {
            id: 'results',
            icon: Award,
            colorClass: 'pink',
            title: 'Mes Résultats',
            description: "Consultez vos notes, évaluations et suivez votre progression académique détaillée.",
            buttonText: 'Voir les résultats',
            buttonClass: 'btn-outline'
        },
        {
            id: 'archive',
            icon: Archive,
            colorClass: 'blue',
            title: 'Cours & Annales',
            description: "Accédez aux supports de cours, TD, TP et aux annales des années précédentes.",
            buttonText: 'Consulter',
            buttonClass: 'btn-outline'
        },
        {
            id: 'mail',
            icon: Mail,
            colorClass: 'green',
            title: 'Messagerie',
            description: "Communiquez avec vos professeurs et l'administration en toute sécurité.",
            buttonText: 'Ouvrir',
            buttonClass: 'btn-outline'
        },
        {
            id: 'community',
            icon: MessageSquare,
            colorClass: 'orange',
            title: 'Communauté',
            description: "Échangez avec les autres étudiants et participez à la vie du campus.",
            buttonText: 'Rejoindre',
            buttonClass: 'btn-outline'
        }
    ];

    return (
        <div className="cards-grid">
            {cards.map((card, index) => (
                <DashboardCard
                    key={index}
                    {...card}
                    onClick={() => onCardClick(card.id)}
                />
            ))}
        </div>
    );
};

export default CardsGrid;
