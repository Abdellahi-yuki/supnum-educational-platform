import React, { useState } from 'react';
import { Search, GraduationCap, Award, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const Results = () => {
    const [matricule, setMatricule] = useState('');
    const [semester, setSemester] = useState('1');
    const [results, setResults] = useState(null);
    const [subjectsMap, setSubjectsMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    // Helper to extract subjects from the flat data
    // Subject keys start with NCC_, NSN_, NSR_, Moy_, Capit_
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

    return (
        <div className="settings-container results-container">
            <div className="settings-card glass-panel" style={{ maxWidth: '1100px', width: '100%', animation: 'fadeInUp 0.6s ease-out' }}>
                <h2 className="settings-title">Consultation des Résultats</h2>
                <p className="settings-subtitle">Entrez votre matricule et choisissez le semestre pour voir vos notes.</p>

                <form onSubmit={handleSearch} className="form-group-row" style={{ marginBottom: '2.5rem' }}>
                    <div style={{ flex: 2 }}>
                        <label className="form-label">Matricule</label>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Ex: 23145"
                            value={matricule}
                            onChange={(e) => setMatricule(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label className="form-label">Semestre</label>
                        <select
                            className="auth-input"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="1">Semestre 1</option>
                            <option value="2">Semestre 2</option>
                            <option value="3">Semestre 3</option>
                            <option value="4">Semestre 4</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '56px', padding: '0 1.5rem' }}>
                        {loading ? <Loader2 className="animate-spin" /> : <><Search size={20} /> <span style={{ marginLeft: '8px' }}>Chercher</span></>}
                    </button>
                </form>

                {error && (
                    <div className="error-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {results && (
                    <div className="results-display animate-in">
                        <div className="student-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(28, 53, 134, 0.05)', borderRadius: '20px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{results.Prenom} {results.Nom}</h3>
                                <p style={{ color: 'var(--gray-500)' }}>Matricule: {results.Matricule} | Département: {results.Dept || results.pt}</p>
                            </div>
                            <GraduationCap size={40} color="var(--primary-blue)" style={{ opacity: 0.5 }} />
                        </div>

                        <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ color: 'var(--gray-500)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem' }}>Matière</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>NCC</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>NSN</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>NSR</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>Moyenne</th>
                                        <th style={{ textAlign: 'center', padding: '1rem' }}>Crédit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((sub, idx) => (
                                        <tr key={idx} className="table-row-hover" style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
                                            <td style={{ padding: '1.25rem', fontWeight: 700, borderRadius: '18px 0 0 18px', borderLeft: '1px solid rgba(255, 255, 255, 0.4)' }} data-label="Matière">
                                                <div style={{ fontSize: '1rem', color: 'var(--primary-blue)' }}>{sub.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>{sub.code}</div>
                                            </td>
                                            <td style={{ textAlign: 'center', padding: '1.25rem' }} data-label="NCC">{sub.ncc || '-'}</td>
                                            <td style={{ textAlign: 'center', padding: '1.25rem' }} data-label="NSN">{sub.nsn || '-'}</td>
                                            <td style={{ textAlign: 'center', padding: '1.25rem' }} data-label="NSR">{sub.nsr || '-'}</td>
                                            <td style={{ textAlign: 'center', padding: '1.25rem', fontWeight: 800, color: (sub.moy >= 10 || ['C', 'CI', 'CE'].includes(sub.capit)) ? 'var(--primary-green)' : 'var(--danger)' }} data-label="Moyenne">{sub.moy}</td>
                                            <td style={{ textAlign: 'center', padding: '1.25rem', borderRadius: '0 18px 18px 0', borderRight: '1px solid rgba(255, 255, 255, 0.4)' }} data-label="Crédit">
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{sub.credits}</span>
                                                    {sub.capit && (
                                                        <span style={{
                                                            padding: '4px 10px',
                                                            background: ['C', 'V', 'CI', 'CE'].includes(sub.capit) ? 'rgba(46, 171, 78, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                            color: ['C', 'V', 'CI', 'CE'].includes(sub.capit) ? 'var(--primary-green)' : 'var(--danger)',
                                                            borderRadius: '12px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {sub.capit}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                            <div className="summary-card glass-panel" style={{ padding: '2rem', textAlign: 'center', animation: 'scaleIn 0.5s ease-out' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '1px' }}>MOYENNE GÉNÉRALE</p>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-blue)', margin: 0 }}>{results.Moy_General}</h4>
                            </div>
                            <div className="summary-card glass-panel" style={{ padding: '2rem', textAlign: 'center', animation: 'scaleIn 0.5s ease-out 0.1s backwards' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '1px' }}>CRÉDITS ACQUIS</p>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-green)', margin: 0 }}>{results.Credit_total}</h4>
                            </div>
                            <div className="summary-card" style={{
                                background: results.Decision === 'Admis' ? 'linear-gradient(135deg, var(--primary-green), #248a3f)' : 'linear-gradient(135deg, var(--primary-blue), #182d73)',
                                padding: '2rem',
                                borderRadius: 'var(--radius-lg)',
                                textAlign: 'center',
                                color: 'white',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                animation: 'scaleIn 0.5s ease-out 0.2s backwards'
                            }}>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '1px' }}>DÉCISION</p>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>{results.Decision}</h4>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
