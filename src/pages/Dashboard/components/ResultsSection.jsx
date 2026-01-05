import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';

const ResultsSection = () => {
    const [activeFilter, setActiveFilter] = useState('Tous');

    const filters = ['Tous', 'Ce semestre', 'Ce mois', 'Cette semaine'];

    // Mock data
    const results = [
        { subject: 'Mathématiques', type: 'Examen Final', date: '15 Déc 2025', grade: '18/20', noteColor: 'excellent', coef: 3, status: 'Validé', badge: 'math' },
        { subject: 'Physique', type: 'TP Pratique', date: '12 Déc 2025', grade: '15.5/20', noteColor: 'good', coef: 2, status: 'Validé', badge: 'physics' },
        { subject: 'Informatique', type: 'Projet de Groupe', date: '10 Déc 2025', grade: '19/20', noteColor: 'excellent', coef: 4, status: 'Validé', badge: 'info' },
        { subject: 'Anglais', type: 'Contrôle Continu', date: '08 Déc 2025', grade: '16/20', noteColor: 'good', coef: 2, status: 'Validé', badge: 'english' },
        { subject: 'Mathématiques', type: 'Devoir Surveillé', date: '05 Déc 2025', grade: '14/20', noteColor: 'average', coef: 2, status: 'Validé', badge: 'math' },
        { subject: 'Physique', type: 'Examen Théorique', date: '01 Déc 2025', grade: '16.5/20', noteColor: 'good', coef: 3, status: 'Validé', badge: 'physics' },
    ];

    return (
        <section className="results-section">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="section-icon">
                        <BarChart2 size={18} />
                    </span>
                    Résultats Récents
                </h2>
                <div className="filter-group">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="table-container">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Matière</th>
                            <th>Type d'évaluation</th>
                            <th>Date</th>
                            <th>Note</th>
                            <th>Coefficient</th>
                            <th>Statut</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <span className={`subject-badge ${item.badge}`}>{item.subject}</span>
                                </td>
                                <td>{item.type}</td>
                                <td>{item.date}</td>
                                <td>
                                    <span className={`grade ${item.noteColor}`}>
                                        <span className="grade-indicator"></span>
                                        {item.grade}
                                    </span>
                                </td>
                                <td>{item.coef}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button className="action-btn">Détails</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ResultsSection;
