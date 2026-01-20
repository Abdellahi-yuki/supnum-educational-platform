import React, { useState } from 'react';
import {
    Search,
    GraduationCap,
    Award,
    BookOpen,
    AlertCircle,
    Loader2,
    Filter,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    Target,
    Zap,
    Trophy
} from 'lucide-react';
import { API_BASE_URL } from '../Dashboard/apiConfig';
import './Results.css';

const Results = () => {
    const [matricule, setMatricule] = useState('');
    const [semester, setSemester] = useState('1');
    const [results, setResults] = useState(null);
    const [subjectsMap, setSubjectsMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'validated', 'not_validated'

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!matricule) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const response = await fetch(`${API_BASE_URL}/get_results.php?matricule=${matricule}&semester=${semester}`);
            const data = await response.json();

            if (data.status === 'success') {
                setResults(data.data);
                setSubjectsMap(data.subjects_map || {});
            } else {
                setError(data.message || 'Erreur lors de la récupération des résultats');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    const getSubjects = () => {
        if (!results) return [];
        const subjects = [];
        const seenCodes = new Set();

        Object.keys(results).forEach(key => {
            if (key.startsWith('NCC_')) {
                const code = key.substring(4);
                if (!seenCodes.has(code)) {
                    seenCodes.add(code);
                    subjects.push({
                        code: code,
                        name: subjectsMap[code]?.name || code,
                        credits: subjectsMap[code]?.credits || 0,
                        ncc: results[`NCC_${code}`],
                        nsn: results[`NSN_${code}`],
                        nsr: results[`NSR_${code}`],
                        moy: results[`Moy_${code}`],
                        capit: results[`Capit_${code}`] || results[`Capit_${code.substring(0, 5)}`]
                    });
                }
            }
        });
        return subjects;
    };

    const subjects = getSubjects();
    const isValidated = (sub) => ['C', 'V', 'CI', 'CE'].includes(sub.capit);

    const filteredSubjects = subjects.filter(sub => {
        if (filter === 'validated') return isValidated(sub);
        if (filter === 'not_validated') return !isValidated(sub);
        return true;
    });

    const getDecisionInfo = (decision) => {
        const d = (decision || '').toLowerCase();
        if (d.includes('admis')) return {
            gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            icon: <Trophy size={48} />,
            color: '#059669'
        };
        if (d.includes('compens')) return {
            gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            icon: <Award size={48} />,
            color: '#d97706'
        };
        if (d.includes('ajourn')) return {
            gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
            icon: <XCircle size={48} />,
            color: '#dc2626'
        };
        return {
            gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            icon: <Zap size={48} />,
            color: '#1e3a8a'
        };
    };

    const decisionInfo = getDecisionInfo(results?.Decision);

    return (
        <div className="results-container">
            <div className="results-settings-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 className="results-title">Relevé de Notes</h2>
                        <p className="results-subtitle">Système de consultation académique SupNum</p>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px' }}>
                        <GraduationCap size={40} color="#3b82f6" />
                    </div>
                </div>

                <form onSubmit={handleSearch} className="results-form-row">
                    <div className="results-form-group flex-2">
                        <label className="results-label">Numéro Matricule</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="results-input"
                                placeholder="Entrez votre matricule"
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                            <User size={18} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                        </div>
                    </div>
                    <div className="results-form-group flex-1">
                        <label className="results-label">Période d'Études</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                className="results-select"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                            >
                                <option value="1">Semestre 1</option>
                                <option value="2">Semestre 2</option>
                                <option value="3">Semestre 3</option>
                                <option value="4">Semestre 4</option>
                            </select>
                            <Calendar size={18} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3, pointerEvents: 'none' }} />
                        </div>
                    </div>
                    <button type="submit" className="results-search-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <><Search size={22} /> <span>Consulter</span></>}
                    </button>
                </form>

                {error && (
                    <div className="results-error animate-in">
                        <AlertCircle size={20} />
                        <span style={{ fontWeight: 600 }}>{error}</span>
                    </div>
                )}

                {results && (
                    <div className="results-display animate-in">
                        <div className="results-student-header">
                            <div className="student-info">
                                <h3>{results.Prenom} {results.Nom}</h3>
                                <p>
                                    <span style={{ opacity: 0.7 }}>Matricule:</span> <strong>{results.Matricule}</strong>
                                    <span style={{ color: '#cbd5e1' }}>|</span>
                                    <span style={{ opacity: 0.7 }}>Parcours:</span> <strong>{results.Dept || results.pt}</strong>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Statut Global</p>
                                    <h4 style={{ margin: 0, color: decisionInfo.color, fontWeight: 900 }}>{results.Decision || 'En attente'}</h4>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div className="results-filters">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                >
                                    <BookOpen size={18} />
                                    <span>Tout ({subjects.length})</span>
                                </button>
                                <button
                                    onClick={() => setFilter('validated')}
                                    className={`filter-btn ${filter === 'validated' ? 'active validated' : ''}`}
                                >
                                    <CheckCircle size={18} />
                                    <span>Validés</span>
                                </button>
                                <button
                                    onClick={() => setFilter('not_validated')}
                                    className={`filter-btn ${filter === 'not_validated' ? 'active not-validated' : ''}`}
                                >
                                    <XCircle size={18} />
                                    <span>Non Validés</span>
                                </button>
                            </div>
                        </div>

                        <div className="results-table-container">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Unité d'Enseignement</th>
                                        <th style={{ textAlign: 'center' }}>CC</th>
                                        <th style={{ textAlign: 'center' }}>SN</th>
                                        <th style={{ textAlign: 'center' }}>SR</th>
                                        <th style={{ textAlign: 'center' }}>Moyenne</th>
                                        <th style={{ textAlign: 'right' }}>Validation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubjects.length > 0 ? (
                                        filteredSubjects.map((sub, idx) => (
                                            <tr key={idx} className="results-table-row">
                                                <td>
                                                    <div className="subject-name">{sub.name}</div>
                                                    <div className="subject-code">{sub.code}</div>
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{sub.ncc || '-'}</td>
                                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{sub.nsn || '-'}</td>
                                                <td style={{ textAlign: 'center', fontWeight: 600 }}>{sub.nsr || '-'}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={`grade-val ${(sub.moy >= 10 || isValidated(sub)) ? 'pass' : 'fail'}`}>
                                                        {sub.moy}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="credit-box" style={{ justifyContent: 'flex-end' }}>
                                                        <span className="credit-val">{sub.credits} CR</span>
                                                        {sub.capit && (
                                                            <span className={`capit-badge ${isValidated(sub) ? 'val' : 'inv'}`}>
                                                                {sub.capit}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                                                <Filter size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                                                <p style={{ fontWeight: 600 }}>Aucune donnée disponible pour ce filtre.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="results-summary-grid">
                            <div className="summary-card">
                                <p className="summary-label">Moyenne du Semestre</p>
                                <h4 className="summary-value" style={{ color: '#1e3a8a' }}>{results.Moy_General}</h4>
                                <Target size={24} color="#1e3a8a" style={{ opacity: 0.2, marginTop: '1rem' }} />
                            </div>
                            <div className="summary-card">
                                <p className="summary-label">Crédits Capitalisés</p>
                                <h4 className="summary-value" style={{ color: '#10b981' }}>{results.Credit_total}</h4>
                                <CheckCircle size={24} color="#10b981" style={{ opacity: 0.2, marginTop: '1rem' }} />
                            </div>
                            <div className="summary-card decision" style={{ background: decisionInfo.gradient }}>
                                <p className="summary-label">Résultat Final</p>
                                <h4 className="summary-value" style={{ fontSize: '2.2rem' }}>{results.Decision || 'N/A'}</h4>
                                <div style={{ marginTop: '1rem', opacity: 0.3 }}>
                                    {decisionInfo.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Results;
