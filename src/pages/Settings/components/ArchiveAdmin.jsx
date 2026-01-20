import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig';
import {
    LayoutDashboard, GraduationCap, BookOpen, FileText,
    LogOut, Plus, Trash2, Upload, X, Loader2, ChevronRight, ArrowLeft
} from 'lucide-react';
import './ArchiveAdmin.css';

const ArchiveAdmin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ semesters: 0, subjects: 0, documents: 0 });
    const [hierarchy, setHierarchy] = useState([]);
    const [loading, setLoading] = useState(false);

    // Drill-down State
    const [selectedSemester, setSelectedSemester] = useState(null);

    // Modal & Form State
    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchData();
        fetchStats();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/archive.php`);
            if (Array.isArray(res.data)) {
                setHierarchy(res.data);
                // Refresh selected semester if it exists
                if (selectedSemester) {
                    const updated = res.data.find(s => s.id === selectedSemester.id);
                    if (updated) setSelectedSemester(updated);
                }
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/archive.php?action=stats`);
            if (res.data) setStats(res.data);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/archive.php?type=${type}&id=${id}`);
            fetchData();
            fetchStats();
        } catch (e) { alert('Erreur lors de la suppression'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        try {
            if (modal.type === 'add_semester') {
                data.append('action', 'create_semester');
                data.append('name', formData.name);
            } else if (modal.type === 'add_subject') {
                data.append('action', 'create_subject');
                data.append('semester_id', formData.semester_id || selectedSemester?.id);
                data.append('name', formData.name);
            } else if (modal.type === 'add_file') {
                data.append('action', 'upload_file');
                data.append('subject_id', formData.subject_id);
                data.append('title', formData.title);
                data.append('category', formData.category || 'cours');
                if (file) data.append('file', file);
                else { alert('Veuillez sélectionner un fichier'); return; }
            }

            await axios.post(`${API_BASE_URL}/admin/archive.php`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setModal({ show: false, type: '', data: null });
            setFormData({});
            setFile(null);
            fetchData();
            fetchStats();
        } catch (error) {
            alert('Erreur: ' + (error.response?.data?.message || 'Une erreur est survenue'));
        }
    };

    const handleSelectSemester = (sem) => {
        setSelectedSemester(sem);
        setActiveTab('subjects_detail'); // Custom interior view
    };

    // --- Renders ---

    const renderDashboard = () => (
        <div className="admin-view-fade">
            <div className="admin-header">
                <h1>Tableau de bord</h1>
                <p>Statistiques globales de la plateforme éducative</p>
            </div>

            <div className="stats-container">
                <div className="stat-card" style={{ '--accent': '#3b82f6' }}>
                    <div className="stat-content">
                        <h3>{stats.semesters}</h3>
                        <p>Semestres</p>
                    </div>
                    <div className="stat-icon-wrapper"><GraduationCap size={28} /></div>
                </div>

                <div className="stat-card" style={{ '--accent': '#6366f1' }}>
                    <div className="stat-content">
                        <h3>{stats.subjects}</h3>
                        <p>Matières</p>
                    </div>
                    <div className="stat-icon-wrapper"><BookOpen size={28} /></div>
                </div>

                <div className="stat-card" style={{ '--accent': '#a855f7' }}>
                    <div className="stat-content">
                        <h3>{stats.documents}</h3>
                        <p>Documents</p>
                    </div>
                    <div className="stat-icon-wrapper"><FileText size={28} /></div>
                </div>
            </div>
        </div>
    );

    const renderSemestersList = () => (
        <div className="admin-view-fade">
            <div className="admin-header flex-row">
                <div>
                    <h1>Semestres</h1>
                    <p>Gestion des cycles académiques</p>
                </div>
                <button className="btn-add" onClick={() => setModal({ show: true, type: 'add_semester' })}>
                    <Plus size={20} /> Nouveau Semestre
                </button>
            </div>

            <div className="semester-grid">
                {hierarchy.map(sem => (
                    <div key={sem.id} className="semester-card" onClick={() => handleSelectSemester(sem)}>
                        <div className="sem-icon"><GraduationCap /></div>
                        <div className="sem-info">
                            <h3>{sem.name}</h3>
                            <p>{sem.subjects?.length || 0} Matières</p>
                        </div>
                        <div className="sem-actions">
                            <button className="btn-icon-del" onClick={(e) => { e.stopPropagation(); handleDelete('semester', sem.id); }}>
                                <Trash2 size={16} />
                            </button>
                            <ChevronRight className="chevron" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSubjectsBySemester = () => (
        <div className="admin-view-fade">
            <div className="back-breadcrumb" onClick={() => setActiveTab('semesters')}>
                <ArrowLeft size={16} /> Retour aux semestres
            </div>
            <div className="admin-header flex-row">
                <div>
                    <h1>{selectedSemester.name}</h1>
                    <p>Matières enregistrées dans ce semestre</p>
                </div>
                <button className="btn-add" onClick={() => setModal({ show: true, type: 'add_subject' })}>
                    <Plus size={20} /> Ajouter une Matière
                </button>
            </div>

            <div className="subject-list">
                {selectedSemester.subjects?.length === 0 ? (
                    <div className="empty-state">Aucune matière trouvée.</div>
                ) : (
                    selectedSemester.subjects?.map(sub => (
                        <div key={sub.id} className="subject-item">
                            <div className="sub-main">
                                <BookOpen size={20} className="sub-icon" />
                                <div>
                                    <h4>{sub.name}</h4>
                                    <p>{sub.files?.length || 0} Documents</p>
                                </div>
                            </div>
                            <div className="sub-actions">
                                <button className="btn-action-text" onClick={() => setModal({ show: true, type: 'add_file', data: sub })}>
                                    <Upload size={16} /> Upload
                                </button>
                                <button className="btn-icon-del" onClick={() => handleDelete('subject', sub.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderAllDocuments = () => {
        const allDocs = [];
        hierarchy.forEach(sem => {
            sem.subjects?.forEach(sub => {
                sub.files?.forEach(doc => {
                    allDocs.push({ ...doc, subName: sub.name, semName: sem.name });
                });
            });
        });

        return (
            <div className="admin-view-fade">
                <div className="admin-header">
                    <h1>Gestion des Documents</h1>
                    <p>Liste exhaustive de tous les supports de cours</p>
                </div>

                <div className="table-wrapper">
                    <table className="modern-admin-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Matière</th>
                                <th>Type</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDocs.map(doc => (
                                <tr key={doc.id}>
                                    <td><div className="flex-row"><FileText size={18} className="text-purple" /> {doc.title}</div></td>
                                    <td><span className="badge-sub">{doc.subName}</span> <span className="text-dim">({doc.semName})</span></td>
                                    <td><span className="file-badge">{doc.category || doc.file_type}</span></td>
                                    <td align="right">
                                        <button className="btn-icon-del" onClick={() => handleDelete('file', doc.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderModal = () => {
        if (!modal.show) return null;

        // Context-aware subject ID for file upload
        if (modal.type === 'add_file' && modal.data && !formData.subject_id) {
            setFormData({ ...formData, subject_id: modal.data.id, category: 'cours' });
        }

        return (
            <div className="admin-modal-overlay" onClick={() => setModal({ show: false })}>
                <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
                    <div className="modal-top">
                        <h3>
                            {modal.type === 'add_semester' && 'Nouveau Semestre'}
                            {modal.type === 'add_subject' && 'Nouvelle Matière'}
                            {modal.type === 'add_file' && 'Uploader un Document'}
                        </h3>
                        <button className="close-btn" onClick={() => setModal({ show: false })}><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {modal.type !== 'add_file' ? (
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    autoFocus
                                    placeholder="Ex: L1 Semestre 1 ou Algèbre"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Titre</label>
                                    <input
                                        autoFocus
                                        placeholder="Ex: TD Algèbre Chapitre 1"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type de document</label>
                                    <select
                                        value={formData.category || 'cours'}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="styled-select"
                                    >
                                        <option value="cours">Cours</option>
                                        <option value="td">Travaux Dirigés (TD)</option>
                                        <option value="tp">Travaux Pratiques (TP)</option>
                                        <option value="devoir">Devoirs</option>
                                        <option value="examen">Examens</option>
                                        <option value="examen_pratique">Examens Pratiques</option>
                                        <option value="rattrapage">Rattrapages</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Fichier</label>
                                    <input
                                        type="file"
                                        onChange={e => setFile(e.target.files[0])}
                                        required
                                        className="file-input-styled"
                                    />
                                </div>
                            </>
                        )}

                        <div className="modal-bottom">
                            <button type="button" className="btn-cancel" onClick={() => setModal({ show: false })}>Annuler</button>
                            <button type="submit" className="btn-submit">Confirmer</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-archive-wrapper">
            {/* Sidebar matches the requested design */}
            <div className="admin-side-bar">
                <div className="admin-brand-pill">
                    <span>ADMINISTRATION</span>
                </div>
            </div>

            <div className="admin-body">
                <nav className="admin-top-nav">
                    <div className="nav-tabs">
                        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                            <LayoutDashboard size={18} /> Tableau de bord
                        </button>
                        <button className={activeTab === 'semesters' || activeTab === 'subjects_detail' ? 'active' : ''} onClick={() => setActiveTab('semesters')}>
                            <GraduationCap size={18} /> Semestres
                        </button>
                        <button className={activeTab === 'documents' ? 'active' : ''} onClick={() => setActiveTab('documents')}>
                            <FileText size={18} /> Documents
                        </button>
                    </div>
                </nav>

                <main className="admin-scroll-content">
                    {loading ? (
                        <div className="loader-full"><Loader2 className="spinning" /></div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'semesters' && renderSemestersList()}
                            {activeTab === 'subjects_detail' && renderSubjectsBySemester()}
                            {activeTab === 'documents' && renderAllDocuments()}
                        </>
                    )}
                </main>
            </div>

            {renderModal()}
        </div>
    );
};

export default ArchiveAdmin;
