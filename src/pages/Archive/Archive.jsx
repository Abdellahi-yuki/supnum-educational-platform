import React, { useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import {
    ChevronRight, FolderOpen, BookMarked, ArrowLeft,
    BookOpenText, ScrollText, Laptop, ClipboardCheck,
    FileSpreadsheet, Microscope, RotateCcw, Download,
    X, File, Search,
    Edit2, Trash2,
    Plus, ShieldCheck, LogOut, Loader2
} from 'lucide-react';

// ==========================================
// DATA MANAGER UTILS
// ==========================================
import { database as initialDatabase } from './data/database';
import axios from 'axios';
import { API_BASE_URL } from '../../apiConfig';
import './Archive.css';

const loadDataFromAPI = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/archive.php`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du chargement des données API:', error);
        return { semestres: [], matieres: [], supports: [] };
    }
};

const STORAGE_KEY = 'archive-supnum-data';

const generateId = (items) => {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
};

// CRUD Operations
const addSemester = (data, newSemester) => {
    const id = generateId(data.semestres);
    const updatedData = { ...data, semestres: [...data.semestres, { id, ...newSemester }] };
    saveData(updatedData);
    return updatedData;
};

const updateSemester = (data, id, updates) => {
    const updatedData = { ...data, semestres: data.semestres.map(s => s.id === id ? { ...s, ...updates } : s) };
    saveData(updatedData);
    return updatedData;
};

const deleteSemester = (data, id) => {
    const updatedData = {
        ...data,
        semestres: data.semestres.filter(s => s.id !== id),
        matieres: data.matieres.filter(m => m.id_semestre !== id),
        supports: data.supports.filter(sup => {
            const matiere = data.matieres.find(m => m.id === sup.id_matiere);
            return matiere && matiere.id_semestre !== id;
        })
    };
    saveData(updatedData);
    return updatedData;
};

const addMatiere = (data, newMatiere) => {
    const id = generateId(data.matieres);
    const updatedData = { ...data, matieres: [...data.matieres, { id, ...newMatiere }] };
    saveData(updatedData);
    return updatedData;
};

const updateMatiere = (data, id, updates) => {
    const updatedData = { ...data, matieres: data.matieres.map(m => m.id === id ? { ...m, ...updates } : m) };
    saveData(updatedData);
    return updatedData;
};

const deleteMatiere = (data, id) => {
    const updatedData = {
        ...data,
        matieres: data.matieres.filter(m => m.id !== id),
        supports: data.supports.filter(s => s.id_matiere !== id)
    };
    saveData(updatedData);
    return updatedData;
};

const addSupport = (data, newSupport) => {
    const id = generateId(data.supports);
    const updatedData = { ...data, supports: [...data.supports, { id, ...newSupport }] };
    saveData(updatedData);
    return updatedData;
};

const updateSupport = (data, id, updates) => {
    const updatedData = { ...data, supports: data.supports.map(s => s.id === id ? { ...s, ...updates } : s) };
    saveData(updatedData);
    return updatedData;
};

const deleteSupport = (data, id) => {
    const updatedData = { ...data, supports: data.supports.filter(s => s.id !== id) };
    saveData(updatedData);
    return updatedData;
};

const exportData = (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `archive-supnum-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

const importData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                saveData(data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

const resetToDefault = () => {
    const data = { ...initialDatabase };
    saveData(data);
    return data;
};

// ==========================================
// THEME
// ==========================================
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#667eea', light: '#858fef', dark: '#4c5fd6', contrastText: '#fff' },
        secondary: { main: '#764ba2', light: '#9168b8', dark: '#5a3a7a', contrastText: '#fff' },
        background: { default: '#f9fafb', paper: '#ffffff' },
    },
    typography: {
        fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
    },
    shape: { borderRadius: 8 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600 },
            },
        },
    },
});

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Breadcrumb = ({ items, onNavigate }) => (
    <div className="breadcrumb" id="breadcrumb">
        {items.map((item, index) => (
            <span key={index}>
                {index === items.length - 1 ? (
                    <span>{item.name}</span>
                ) : (
                    <>
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(item); }}>{item.name}</a>
                        <ChevronRight size={14} />
                    </>
                )}
            </span>
        ))}
    </div>
);

const SemesterList = ({ semesters, subjects, onSelectSemester }) => (
    <div id="semestersView" className="fade-in">
        <h2>Sélectionnez un semestre</h2>
        <div className="grid" id="semestersGrid">
            {semesters.map(semester => {
                const subjectCount = subjects.filter(m => m.id_semestre === semester.id).length;
                return (
                    <div key={semester.id} className="card" onClick={() => onSelectSemester(semester.id)}>
                        <div className="card-icon"><FolderOpen size={40} /></div>
                        <h3>{semester.nom}</h3>
                        <p>{subjectCount} matière{subjectCount > 1 ? 's' : ''} disponible{subjectCount > 1 ? 's' : ''}</p>
                    </div>
                );
            })}
        </div>
    </div>
);

const SubjectList = ({ subjects, supports, onSelectSubject, onBack, semesterName }) => (
    <div id="subjectsView">
        <button className="back-button" onClick={onBack}><ArrowLeft size={20} /> Retour aux semestres</button>
        <h2 id="subjectsTitle">Matières - {semesterName}</h2>
        <div className="grid" id="subjectsGrid">
            {subjects.map(subject => {
                const docCount = supports.filter(s => s.id_matiere === subject.id).length;
                return (
                    <div key={subject.id} className="card" onClick={() => onSelectSubject(subject.id)}>
                        <div className="card-icon"><BookMarked size={40} /></div>
                        <h3>{subject.nom}</h3>
                        <p>{docCount} document{docCount > 1 ? 's' : ''} disponible{docCount > 1 ? 's' : ''}</p>
                    </div>
                );
            })}
        </div>
    </div>
);

const DocumentList = ({ documents, onSelectDocument, onBack, subjectName }) => {
    const groupedDocs = {
        cours: documents.filter(d => d.type === 'cours'),
        td: documents.filter(d => d.type === 'td'),
        tp: documents.filter(d => d.type === 'tp'),
        devoir: documents.filter(d => d.type === 'devoir'),
        examen: documents.filter(d => d.type === 'examen'),
        examen_pratique: documents.filter(d => d.type === 'examen_pratique'),
        rattrapage: documents.filter(d => d.type === 'rattrapage')
    };

    const typeNames = {
        cours: 'Cours', td: 'Travaux Dirigés', tp: 'Travaux Pratiques',
        devoir: 'Devoirs', examen: 'Examens', examen_pratique: 'Examens Pratiques',
        rattrapage: 'Rattrapages'
    };

    const typeIcons = {
        cours: <BookOpenText size={20} />, td: <ScrollText size={20} />, tp: <Laptop size={20} />,
        devoir: <ClipboardCheck size={20} />, examen: <FileSpreadsheet size={20} />,
        examen_pratique: <Microscope size={20} />, rattrapage: <RotateCcw size={20} />
    };

    const hasDocuments = Object.values(groupedDocs).some(arr => arr.length > 0);

    return (
        <div id="documentsView">
            <button className="back-button" onClick={onBack}><ArrowLeft size={20} /> Retour</button>
            <h2 id="documentsTitle">{subjectName}</h2>
            <div id="documentsGrid">
                {!hasDocuments && (
                    <p style={{ textAlign: 'center', color: 'var(--p-text-dim)', margin: '40px 0' }}>
                        Aucun document disponible pour cette matière.
                    </p>
                )}
                {Object.keys(groupedDocs).map(type => {
                    if (groupedDocs[type].length === 0) return null;
                    return (
                        <div key={type}>
                            <h3 style={{ marginTop: '20px', color: 'var(--p-text-dim)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {typeIcons[type]} {typeNames[type]}
                            </h3>
                            {groupedDocs[type].map(doc => (
                                <div key={doc.id} className="file-item" onClick={() => onSelectDocument(doc)}>
                                    <span className="file-icon">{typeIcons[type]}</span>
                                    <span>{doc.nom}</span>
                                    <span className="file-type">{type.toUpperCase().replace('_', ' ')}</span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FileViewer = ({ file, onClose }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Construct full URL if it's a relative path from the backend
    const filepath = file.chemin_fichier.startsWith('http')
        ? file.chemin_fichier
        : `${API_BASE_URL}/..${file.chemin_fichier}`;

    const filename = file.nom;
    const extension = filepath.split('.').pop().toLowerCase();

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                if (filepath.includes('drive.google.com')) {
                    window.open(filepath, "_blank");
                    onClose();
                    return;
                }
                if (['pdf'].includes(extension)) {
                    let embedUrl = filepath;
                    // If it's a relative path starting with /archives/, it might need full URL if served from different domain, 
                    // but usually in Vite it should just work if files are in public/archives/.
                    // However, we'll check if it's a Google Drive link first.
                    if (filepath.includes('drive.google.com/file/d/')) {
                        const fileId = filepath.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)[1];
                        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    }
                    setContent(
                        <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <iframe src={embedUrl} style={{ width: '100%', flex: 1, minHeight: '600px', border: 'none', borderRadius: '12px', background: 'white' }} allow="autoplay" title={filename}>
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <p>Impossible d'afficher le PDF dans le navigateur.</p>
                                    <a href={filepath} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Cliquez ici pour l'ouvrir dans un nouvel onglet</a>
                                </div>
                            </iframe>
                        </div>
                    );
                } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                    setContent(
                        <div style={{ textAlign: 'center' }}>
                            <img src={filepath} style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px' }} alt={filename} />
                        </div>
                    );
                } else {
                    setContent(
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}><File size={48} /></div>
                            <h3>Fichier {extension.toUpperCase()}</h3>
                            <p>Ce type de fichier nécessite un téléchargement pour être visualisé.</p>
                            <button onClick={() => downloadFile(filepath, filename)} style={{ background: '#4299e1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>📥 Télécharger le fichier</button>
                        </div>
                    );
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, [file]);

    const downloadFile = (filepath, filename) => {
        const link = document.createElement('a');
        link.href = filepath;
        link.download = filename || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div id="fileViewer" className="file-viewer-overlay">
            <div className="file-viewer-content">
                <div className="file-viewer-header">
                    <h3>{filename}</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => downloadFile(filepath, filename)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', marginRight: '10px' }}><Download size={16} /> Télécharger</button>
                        <button onClick={onClose} className="btn-close"><X size={20} /></button>
                    </div>
                </div>
                <div className="file-viewer-body">
                    {loading ? <div className="loading-state"><Loader2 className="animate-spin" /> Chargement...</div> : error ? <p>Erreur: {error}</p> : content}
                </div>
            </div>
        </div>
    );
};

const SearchResults = ({ results, query, onSelectResult, onBack }) => (
    <div id="search-results" style={{ display: 'block' }}>
        <h2>Résultats de recherche pour "{query}"</h2>
        <button className="back-button" onClick={onBack}><ArrowLeft size={20} /> Retour à l'accueil</button>
        {results.length === 0 ? (
            <p>Aucun résultat trouvé.</p>
        ) : (
            <div className="grid">
                {results.map((result, index) => {
                    if (result.type === 'support') {
                        return (
                            <div key={index} className="card" onClick={() => onSelectResult(result)}>
                                <div className="card-icon"><ScrollText size={40} /></div>
                                <h3>{result.item.nom}</h3>
                                <p>{result.matiere.nom} - {result.semestre.nom}</p>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="card" onClick={() => onSelectResult(result)}>
                                <div className="card-icon"><BookMarked size={40} /></div>
                                <h3>{result.item.nom}</h3>
                                <p>{result.semestre.nom}</p>
                            </div>
                        );
                    }
                })}
            </div>
        )}
    </div>
);

const Toolbar = ({ onSearch, onAdminAccess }) => {
    const [query, setQuery] = useState('');
    const handleSearch = () => onSearch(query);
    const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearch(); };

    return (
        <div className="archive-toolbar">
            <div className="toolbar-branding">
                <h1 className="logo-text">Archives des Supports</h1>
                <p className="toolbar-subtitle">Plateforme de gestion pédagogique SupNum</p>
            </div>
            <div className="header-actions">
                <div className="search-bar">
                    <input type="text" className="search-input" placeholder="Rechercher un cours, une matière..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={handleKeyPress} />
                    <button className="search-btn" onClick={handleSearch}><Search size={20} /></button>
                </div>
            </div>
        </div>
    );
};

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (password === adminPassword) {
            sessionStorage.setItem('admin-authenticated', 'true');
            onLogin();
        } else {
            setError('Mot de passe incorrect');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <h2>🔐 Administration</h2>
                    <p>Connexion requise</p>
                </div>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Entrez le mot de passe admin" autoFocus />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-primary">Se connecter</button>
                </form>
                <div className="admin-login-footer"><small>💡 Mot de passe par défaut: admin123</small></div>
            </div>
        </div>
    );
};

// Admin Forms
const SemesterForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({ nom: '' });
    useEffect(() => { if (initialData) setFormData({ nom: initialData.nom }); }, [initialData]);
    const handleSubmit = (e) => { e.preventDefault(); if (formData.nom.trim()) { onSubmit(formData); setFormData({ nom: '' }); } };
    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="semester-name">Nom du semestre *</label>
                <input type="text" id="semester-name" value={formData.nom} onChange={(e) => setFormData({ nom: e.target.value })} placeholder="Ex: Semestre 1 - L1" required />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{initialData ? '✓ Modifier' : '+ Ajouter'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
            </div>
        </form>
    );
};

const SubjectForm = ({ onSubmit, onCancel, initialData = null, semesters = [] }) => {
    const [formData, setFormData] = useState({ nom: '', id_semestre: '' });
    useEffect(() => { if (initialData) setFormData({ nom: initialData.nom, id_semestre: initialData.id_semestre }); }, [initialData]);
    const handleSubmit = (e) => { e.preventDefault(); if (formData.nom.trim() && formData.id_semestre) { onSubmit({ nom: formData.nom, id_semestre: parseInt(formData.id_semestre) }); setFormData({ nom: '', id_semestre: '' }); } };
    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="subject-name">Nom de la matière *</label>
                <input type="text" id="subject-name" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex: Algorithmique" required />
            </div>
            <div className="form-group">
                <label htmlFor="semester-select">Semestre *</label>
                <select id="semester-select" value={formData.id_semestre} onChange={(e) => setFormData({ ...formData, id_semestre: e.target.value })} required>
                    <option value="">-- Sélectionner un semestre --</option>
                    {semesters.map(semester => <option key={semester.id} value={semester.id}>{semester.nom}</option>)}
                </select>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">{initialData ? '✓ Modifier' : '+ Ajouter'}</button>
                <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
            </div>
        </form>
    );
};

const SupportForm = ({ onSubmit, onCancel, initialData = null, matieres = [], semestres = [] }) => {
    const [formData, setFormData] = useState({ nom: '', type: 'cours', chemin_fichier: '', id_matiere: '' });
    const [selectedSemester, setSelectedSemester] = useState('');
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('manual');

    useEffect(() => {
        if (initialData) {
            setFormData({ nom: initialData.nom, type: initialData.type, chemin_fichier: initialData.chemin_fichier, id_matiere: initialData.id_matiere });
            const matiere = matieres.find(m => m.id === initialData.id_matiere);
            if (matiere) setSelectedSemester(matiere.id_semestre);
            setUploadMode('manual');
        }
    }, [initialData, matieres]);

    useEffect(() => {
        if (selectedSemester) setFilteredMatieres(matieres.filter(m => m.id_semestre === parseInt(selectedSemester)));
        else setFilteredMatieres([]);
    }, [selectedSemester, matieres]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (!formData.nom) setFormData({ ...formData, nom: file.name.split('.')[0] });
            if (selectedSemester && formData.id_matiere && formData.type) {
                const semester = semestres.find(s => s.id === parseInt(selectedSemester));
                const matiere = matieres.find(m => m.id === parseInt(formData.id_matiere));
                if (semester && matiere) {
                    const semesterNum = semester.nom.match(/\d+/)?.[0] || '1';
                    const path = `./s${semesterNum}/${matiere.nom.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_')}/${formData.type}/${file.name}`;
                    setFormData(prev => ({ ...prev, chemin_fichier: path }));
                }
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.nom.trim() && formData.chemin_fichier.trim() && formData.id_matiere) {
            onSubmit({ nom: formData.nom, type: formData.type, chemin_fichier: formData.chemin_fichier, id_matiere: parseInt(formData.id_matiere) });
            setFormData({ nom: '', type: 'cours', chemin_fichier: '', id_matiere: '' });
            setSelectedSemester('');
            setSelectedFile(null);
            setUploadMode('manual');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group"><label>Nom du document *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required /></div>
            <div className="form-group"><label>Type *</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>{['cours', 'td', 'tp', 'devoir', 'examen', 'rattrapage'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select></div>
            <div className="form-group"><label>Semestre *</label><select value={selectedSemester} onChange={(e) => { setSelectedSemester(e.target.value); setFormData({ ...formData, id_matiere: '' }); }} required><option value="">--</option>{semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}</select></div>
            <div className="form-group"><label>Matière *</label><select value={formData.id_matiere} onChange={(e) => setFormData({ ...formData, id_matiere: e.target.value })} required disabled={!selectedSemester}><option value="">--</option>{filteredMatieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
            <div className="form-group"><label>Chemin *</label><input type="text" value={formData.chemin_fichier} onChange={(e) => setFormData({ ...formData, chemin_fichier: e.target.value })} required /></div>
            <div className="form-actions"><button type="submit" className="btn-primary">Enregistrer</button><button type="button" onClick={onCancel} className="btn-secondary">Annuler</button></div>
        </form>
    );
};

const AdminPanel = ({ database, onDataChange, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const renderDashboard = () => (
        <div className="admin-dashboard">
            <div className="stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('semesters')}><h3>{database.semestres.length}</h3><p>Semestres</p></div>
                <div className="stat-card" onClick={() => setActiveTab('matieres')}><h3>{database.matieres.length}</h3><p>Matières</p></div>
                <div className="stat-card" onClick={() => setActiveTab('supports')}><h3>{database.supports.length}</h3><p>Documents</p></div>
            </div>
        </div>
    );

    const renderSemesters = () => (
        <div className="admin-section">
            <div className="section-header"><h2>Gestion des Semestres</h2><button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary"><Plus size={18} /> Ajouter</button></div>
            {showForm && <div className="form-container"><h3>{editingItem ? 'Modifier' : 'Nouveau'}</h3><SemesterForm onSubmit={(data) => { editingItem ? updateSemester(database, editingItem.id, data) : addSemester(database, data); onDataChange(loadData()); setShowForm(false); }} onCancel={() => setShowForm(false)} initialData={editingItem} /></div>}
            <div className="data-table">
                <table><thead><tr><th>ID</th><th>Nom</th><th>Actions</th></tr></thead><tbody>{database.semestres.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.nom}</td><td className="actions"><button className="btn-edit" onClick={() => { setEditingItem(s); setShowForm(true); }}><Edit2 size={16} /></button><button className="btn-delete" onClick={() => { deleteSemester(database, s.id); onDataChange(loadData()); }}><Trash2 size={16} /></button></td></tr>)}</tbody></table>
            </div>
        </div>
    );

    const renderMatieres = () => (
        <div className="admin-section">
            <div className="section-header"><h2>Gestion des Matières</h2><button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary"><Plus size={18} /> Ajouter</button></div>
            {showForm && <div className="form-container"><h3>{editingItem ? 'Modifier' : 'Nouvelle'}</h3><SubjectForm onSubmit={(data) => { editingItem ? updateMatiere(database, editingItem.id, data) : addMatiere(database, data); onDataChange(loadData()); setShowForm(false); }} onCancel={() => setShowForm(false)} initialData={editingItem} semesters={database.semestres} /></div>}
            <div className="data-table">
                <table><thead><tr><th>ID</th><th>Nom</th><th>Semestre</th><th>Actions</th></tr></thead><tbody>{database.matieres.map(m => <tr key={m.id}><td>{m.id}</td><td>{m.nom}</td><td>{database.semestres.find(s => s.id === m.id_semestre)?.nom}</td><td className="actions"><button className="btn-edit" onClick={() => { setEditingItem(m); setShowForm(true); }}><Edit2 size={16} /></button><button className="btn-delete" onClick={() => { deleteMatiere(database, m.id); onDataChange(loadData()); }}><Trash2 size={16} /></button></td></tr>)}</tbody></table>
            </div>
        </div>
    );

    const renderSupports = () => (
        <div className="admin-section">
            <div className="section-header"><h2>Gestion des Documents</h2><button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary"><Plus size={18} /> Ajouter</button></div>
            {showForm && <div className="form-container"><h3>{editingItem ? 'Modifier' : 'Nouveau'}</h3><SupportForm onSubmit={(data) => { editingItem ? updateSupport(database, editingItem.id, data) : addSupport(database, data); onDataChange(loadData()); setShowForm(false); }} onCancel={() => setShowForm(false)} initialData={editingItem} matieres={database.matieres} semestres={database.semestres} /></div>}
            <div className="data-table">
                <table><thead><tr><th>ID</th><th>Nom</th><th>Type</th><th>Matière</th><th>Actions</th></tr></thead><tbody>{database.supports.map(s => <tr key={s.id}><td>{s.id}</td><td>{s.nom}</td><td>{s.type}</td><td>{database.matieres.find(m => m.id === s.id_matiere)?.nom}</td><td className="actions"><button className="btn-edit" onClick={() => { setEditingItem(s); setShowForm(true); }}><Edit2 size={16} /></button><button className="btn-delete" onClick={() => { deleteSupport(database, s.id); onDataChange(loadData()); }}><Trash2 size={16} /></button></td></tr>)}</tbody></table>
            </div>
        </div>
    );

    return (
        <div className="admin-container">
            <aside className="admin-sidebar"><div className="sidebar-brand"><ShieldCheck size={32} /></div><span className="sidebar-text">Administration</span></aside>
            <main className="admin-main-area">
                <nav className="admin-top-nav">
                    <button className={`nav-pill ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Tableau de bord</button>
                    <button className={`nav-pill ${activeTab === 'semesters' ? 'active' : ''}`} onClick={() => setActiveTab('semesters')}>Semestres</button>
                    <button className={`nav-pill ${activeTab === 'matieres' ? 'active' : ''}`} onClick={() => setActiveTab('matieres')}>Matières</button>
                    <button className={`nav-pill ${activeTab === 'supports' ? 'active' : ''}`} onClick={() => setActiveTab('supports')}>Documents</button>
                    <button onClick={onLogout} className="nav-pill logout-pill"><LogOut size={18} /> Déconnexion</button>
                </nav>
                <div className="admin-content-view">
                    {activeTab === 'dashboard' && renderDashboard()}
                    {activeTab === 'semesters' && renderSemesters()}
                    {activeTab === 'matieres' && renderMatieres()}
                    {activeTab === 'supports' && renderSupports()}
                </div>
            </main>
        </div>
    );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

function Archive() {
    const [database, setDatabase] = useState({ semestres: [], matieres: [], supports: [] });
    const [loadingItems, setLoadingItems] = useState(true);
    const [currentView, setCurrentView] = useState('semesters');
    const [currentSemester, setCurrentSemester] = useState(null);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Accueil', action: 'semesters' }]);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(sessionStorage.getItem('admin-authenticated') === 'true');

    useEffect(() => {
        setIsAdminAuthenticated(sessionStorage.getItem('admin-authenticated') === 'true');
        const refreshData = async () => {
            setLoadingItems(true);
            const data = await loadDataFromAPI();
            setDatabase(data);
            setLoadingItems(false);
        };
        refreshData();
    }, []);

    const handleSelectSemester = (semesterId) => {
        const semester = database.semestres.find(s => s.id === semesterId);
        setCurrentSemester(semester);
        setCurrentView('subjects');
        setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }, { name: semester.nom, action: null }]);
    };

    const handleSelectSubject = (subjectId) => {
        const subject = database.matieres.find(m => m.id === subjectId);
        const semester = database.semestres.find(s => s.id === subject.id_semestre);
        setCurrentSubject(subject);
        setCurrentSemester(semester);
        setCurrentView('documents');
        setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }, { name: semester.nom, action: 'subjects' }, { name: subject.nom, action: null }]);
    };

    const handleSearch = (query) => {
        if (!query.trim()) return;
        setSearchQuery(query);
        const results = [];
        database.supports.forEach(support => {
            if (support.nom.toLowerCase().includes(query.toLowerCase())) {
                const matiere = database.matieres.find(m => m.id === support.id_matiere);
                const semestre = database.semestres.find(s => s.id === matiere.id_semestre);
                results.push({ type: 'support', item: support, matiere, semestre });
            }
        });
        database.matieres.forEach(matiere => {
            if (matiere.nom.toLowerCase().includes(query.toLowerCase())) {
                const semestre = database.semestres.find(s => s.id === matiere.id_semestre);
                results.push({ type: 'matiere', item: matiere, semestre });
            }
        });
        setSearchResults(results);
        setCurrentView('search');
        setBreadcrumbs([{ name: 'Recherche', action: null }]);
    };

    const handleNavigate = (item) => {
        if (item.action === 'semesters') {
            setCurrentView('semesters');
            setCurrentSemester(null);
            setCurrentSubject(null);
            setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }]);
        } else if (item.action === 'subjects') {
            setCurrentView('subjects');
            setCurrentSubject(null);
            setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }, { name: currentSemester.nom, action: null }]);
        }
    };


    const handleAdminLogin = () => {
        setIsAdminAuthenticated(true);
        setCurrentView('admin');
        setBreadcrumbs([{ name: 'Administration', action: null }]);
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem('admin-authenticated');
        setIsAdminAuthenticated(false);
        setCurrentView('semesters');
        setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }]);
    };

    const handleDataChange = (newData) => {
        setDatabase(newData);
    };

    const handleBack = () => {
        if (currentView === 'subjects') handleNavigate({ action: 'semesters' });
        else if (currentView === 'documents') handleNavigate({ action: 'subjects' });
        else if (currentView === 'search') handleNavigate({ action: 'semesters' });
    };

    const renderContent = () => {
        if (currentView === 'admin-login') return <AdminLogin onLogin={handleAdminLogin} />;
        if (currentView === 'admin' && isAdminAuthenticated) return <AdminPanel database={database} onDataChange={handleDataChange} onLogout={handleAdminLogout} />;

        return (
            <div className="container">
                <Toolbar onSearch={handleSearch} />
                <div className="main-content">
                    {loadingItems ? (
                        <div className="loader-container" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Loader2 className="animate-spin" size={40} style={{ color: '#667eea' }} />
                            <p style={{ marginTop: '1rem', color: '#64748b' }}>Chargement de l'archive...</p>
                        </div>
                    ) : (
                        <>
                            {currentView !== 'search' && <Breadcrumb items={breadcrumbs} onNavigate={handleNavigate} />}
                            {currentView === 'semesters' && <SemesterList semesters={database.semestres} subjects={database.matieres} onSelectSemester={handleSelectSemester} />}
                            {currentView === 'subjects' && currentSemester && <SubjectList subjects={database.matieres.filter(m => m.id_semestre === currentSemester.id)} supports={database.supports} semesterName={currentSemester.nom} onSelectSubject={handleSelectSubject} onBack={handleBack} />}
                            {currentView === 'documents' && currentSubject && <DocumentList documents={database.supports.filter(s => s.id_matiere === currentSubject.id)} subjectName={currentSubject.nom} onSelectDocument={(doc) => setCurrentFile(doc)} onBack={handleBack} />}
                            {currentView === 'search' && <SearchResults results={searchResults} query={searchQuery} onSelectResult={(res) => res.type === 'support' ? handleSelectSubject(res.matiere.id) : handleSelectSubject(res.item.id)} onBack={handleBack} />}
                        </>
                    )}
                </div>
                {currentFile && <FileViewer file={currentFile} onClose={() => setCurrentFile(null)} />}
            </div>
        );
    };

    return (
        <div className="archive-container">
            {renderContent()}
        </div>
    );
}

export default Archive;
