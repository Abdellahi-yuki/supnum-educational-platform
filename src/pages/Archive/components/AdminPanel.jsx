import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    GraduationCap,
    BookOpen,
    FileText,
    Settings,
    Download,
    Upload,
    RotateCcw,
    LogOut,
    Edit2,
    Trash2,
    Plus
} from 'lucide-react';
import SemesterForm from './SemesterForm';
import SubjectForm from './SubjectForm';
import SupportForm from './SupportForm';
import {
    addSemester,
    updateSemester,
    deleteSemester,
    addMatiere,
    updateMatiere,
    deleteMatiere,
    addSupport,
    updateSupport,
    deleteSupport,
    exportData,
    importData,
    resetToDefault
} from '../utils/dataManager';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn-secondary">
                        Annuler
                    </button>
                    <button onClick={onConfirm} className="btn-primary" style={{ background: '#ef4444' }}>
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminPanel = ({ database, onDataChange, onLogout }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingItem, setEditingItem] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [filterMatiere, setFilterMatiere] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [toasts, setToasts] = useState([]);

    // Confirmation Dialog State
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    // Reset filters when changing tabs
    useEffect(() => {
        setFilterType('');
        setFilterMatiere('');
    }, [activeTab]);

    const openConfirmDialog = (title, message, onConfirm) => {
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmDialog({ ...confirmDialog, isOpen: false });
            }
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    const showToast = (message, type = 'success', undoAction = null) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, undoAction }]);

        // Auto remove after 10 seconds
        setTimeout(() => {
            removeToast(id);
        }, 10000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleUndo = (toastId, undoAction) => {
        if (undoAction) {
            undoAction();
            removeToast(toastId);
            showToast('Action annulée', 'info');
        }
    };

    const handleAddSemester = (semesterData) => {
        const updatedData = addSemester(database, semesterData);
        onDataChange(updatedData);
        setShowForm(false);

        // Get the added item (last one)
        const newItem = updatedData.semestres[updatedData.semestres.length - 1];

        showToast(
            `Semestre "${newItem.nom}" ajouté`,
            'success',
            () => {
                const revertedData = deleteSemester(updatedData, newItem.id);
                onDataChange(revertedData);
            }
        );
    };

    const handleUpdateSemester = (id, updates) => {
        const updatedData = updateSemester(database, id, updates);
        onDataChange(updatedData);
        setEditingItem(null);
        setShowForm(false);
        showToast('Semestre modifié avec succès');
    };

    const handleDeleteSemester = (id) => {
        openConfirmDialog(
            'Supprimer le semestre',
            'Êtes-vous sûr de vouloir supprimer ce semestre ? Toutes les matières et supports associés seront également supprimés.',
            () => {
                const updatedData = deleteSemester(database, id);
                onDataChange(updatedData);
                showToast('Semestre supprimé', 'info');
            }
        );
    };

    const handleAddMatiere = (matiereData) => {
        const updatedData = addMatiere(database, matiereData);
        onDataChange(updatedData);
        setShowForm(false);

        const newItem = updatedData.matieres[updatedData.matieres.length - 1];

        showToast(
            `Matière "${newItem.nom}" ajoutée`,
            'success',
            () => {
                const revertedData = deleteMatiere(updatedData, newItem.id);
                onDataChange(revertedData);
            }
        );
    };

    const handleUpdateMatiere = (id, updates) => {
        const updatedData = updateMatiere(database, id, updates);
        onDataChange(updatedData);
        setEditingItem(null);
        setShowForm(false);
        showToast('Matière modifiée avec succès');
    };

    const handleDeleteMatiere = (id) => {
        openConfirmDialog(
            'Supprimer la matière',
            'Êtes-vous sûr de vouloir supprimer cette matière ? Tous les supports associés seront également supprimés.',
            () => {
                const updatedData = deleteMatiere(database, id);
                onDataChange(updatedData);
                showToast('Matière supprimée', 'info');
            }
        );
    };

    const handleAddSupport = (supportData) => {
        const updatedData = addSupport(database, supportData);
        onDataChange(updatedData);
        setShowForm(false);

        const newItem = updatedData.supports[updatedData.supports.length - 1];

        showToast(
            `Document "${newItem.nom}" ajouté`,
            'success',
            () => {
                const revertedData = deleteSupport(updatedData, newItem.id);
                onDataChange(revertedData);
            }
        );
    };

    const handleUpdateSupport = (id, updates) => {
        const updatedData = updateSupport(database, id, updates);
        onDataChange(updatedData);
        setEditingItem(null);
        setShowForm(false);
        showToast('Document modifié avec succès');
    };

    const handleDeleteSupport = (id) => {
        openConfirmDialog(
            'Supprimer le document',
            'Êtes-vous sûr de vouloir supprimer ce support ?',
            () => {
                const updatedData = deleteSupport(database, id);
                onDataChange(updatedData);
                showToast('Document supprimé', 'info');
            }
        );
    };

    const handleExport = () => {
        exportData(database);
        showToast('Exportation réussie', 'success');
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            importData(file)
                .then(data => {
                    onDataChange(data);
                    showToast('Données importées avec succès', 'success');
                })
                .catch(error => {
                    alert('Erreur lors de l\'importation: ' + error.message);
                });
        }
    };

    const handleReset = () => {
        openConfirmDialog(
            'Réinitialiser les données',
            'Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.',
            () => {
                const data = resetToDefault();
                onDataChange(data);
                showToast('Données réinitialisées', 'info');
            }
        );
    };

    const getSemesterName = (id) => {
        const semester = database.semestres.find(s => s.id === id);
        return semester ? semester.nom : 'Inconnu';
    };

    const getMatiereName = (id) => {
        const matiere = database.matieres.find(m => m.id === id);
        return matiere ? matiere.nom : 'Inconnu';
    };

    const renderDashboard = () => (
        <div className="admin-dashboard">
            <h2><BarChart3 size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Tableau de bord</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><GraduationCap size={48} /></div>
                    <div className="stat-content">
                        <h3>{database.semestres.length}</h3>
                        <p>Semestres</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><BookOpen size={48} /></div>
                    <div className="stat-content">
                        <h3>{database.matieres.length}</h3>
                        <p>Matières</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><FileText size={48} /></div>
                    <div className="stat-content">
                        <h3>{database.supports.length}</h3>
                        <p>Documents</p>
                    </div>
                </div>
            </div>

            <div className="admin-actions">
                <h3><Settings size={20} style={{ display: 'inline', marginRight: '0.5rem' }} /> Actions rapides</h3>
                <div className="action-buttons">
                    <button onClick={handleExport} className="btn-action">
                        <Download size={18} style={{ marginRight: '0.5rem' }} /> Exporter les données
                    </button>
                    <label className="btn-action">
                        <Upload size={18} style={{ marginRight: '0.5rem' }} /> Importer les données
                        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                    </label>
                    <button onClick={handleReset} className="btn-action btn-danger">
                        <RotateCcw size={18} style={{ marginRight: '0.5rem' }} /> Réinitialiser
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSemesters = () => (
        <div className="admin-section">
            <div className="section-header">
                <h2><GraduationCap size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Gestion des Semestres</h2>
                <button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Ajouter un semestre
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h3>{editingItem ? 'Modifier le semestre' : 'Nouveau semestre'}</h3>
                    <SemesterForm
                        onSubmit={(data) => editingItem ? handleUpdateSemester(editingItem.id, data) : handleAddSemester(data)}
                        onCancel={() => { setShowForm(false); setEditingItem(null); }}
                        initialData={editingItem}
                    />
                </div>
            )}

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Matières</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {database.semestres.map(semester => (
                            <tr key={semester.id}>
                                <td data-label="ID">{semester.id}</td>
                                <td data-label="Nom">{semester.nom}</td>
                                <td data-label="Matières">{database.matieres.filter(m => m.id_semestre === semester.id).length}</td>
                                <td data-label="Actions" className="actions">
                                    <button
                                        onClick={() => { setEditingItem(semester); setShowForm(true); }}
                                        className="btn-edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSemester(semester.id)}
                                        className="btn-delete"
                                    >
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

    const renderMatieres = () => (
        <div className="admin-section">
            <div className="section-header">
                <h2><BookOpen size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Gestion des Matières</h2>
                <button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary">
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Ajouter une matière
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <h3>{editingItem ? 'Modifier la matière' : 'Nouvelle matière'}</h3>
                    <SubjectForm
                        onSubmit={(data) => editingItem ? handleUpdateMatiere(editingItem.id, data) : handleAddMatiere(data)}
                        onCancel={() => { setShowForm(false); setEditingItem(null); }}
                        initialData={editingItem}
                        semesters={database.semestres}
                    />
                </div>
            )}

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Semestre</th>
                            <th>Documents</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {database.matieres.map(matiere => (
                            <tr key={matiere.id}>
                                <td data-label="ID">{matiere.id}</td>
                                <td data-label="Nom">{matiere.nom}</td>
                                <td data-label="Semestre">{getSemesterName(matiere.id_semestre)}</td>
                                <td data-label="Documents">{database.supports.filter(s => s.id_matiere === matiere.id).length}</td>
                                <td data-label="Actions" className="actions">
                                    <button
                                        onClick={() => { setEditingItem(matiere); setShowForm(true); }}
                                        className="btn-edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMatiere(matiere.id)}
                                        className="btn-delete"
                                    >
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

    const renderSupports = () => {
        console.log('===== RENDER SUPPORTS CALLED =====');
        console.log('Current filter values:', { filterType, filterMatiere });
        console.log('Total supports in database:', database.supports.length);

        // Get unique types for dropdown
        const uniqueTypes = [...new Set(database.supports.map(s => s.type))];
        console.log('Unique types:', uniqueTypes);

        // Apply filters
        let filteredSupports = database.supports;

        // Filter by type if selected
        if (filterType && filterType !== '') {
            console.log(`Filtering by type: "${filterType}"`);
            filteredSupports = filteredSupports.filter(support => {
                const matches = support.type === filterType;
                console.log(`Support ${support.id}: type="${support.type}" matches="${matches}"`);
                return matches;
            });
            console.log(`After type filter: ${filteredSupports.length} supports`);
        }

        // Filter by matiere if selected
        if (filterMatiere && filterMatiere !== '') {
            console.log(`Filtering by matiere: "${filterMatiere}"`);
            filteredSupports = filteredSupports.filter(support => {
                const matches = String(support.id_matiere) === String(filterMatiere);
                console.log(`Support ${support.id}: id_matiere=${support.id_matiere} (${typeof support.id_matiere}) matches="${matches}"`);
                return matches;
            });
            console.log(`After matiere filter: ${filteredSupports.length} supports`);
        }

        console.log('Final filtered count:', filteredSupports.length);
        console.log('===================================');

        return (
            <div className="admin-section">
                <div className="section-header">
                    <h2><FileText size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Gestion des Documents</h2>
                    <button onClick={() => { setShowForm(true); setEditingItem(null); }} className="btn-primary">
                        <Plus size={18} style={{ marginRight: '0.5rem' }} /> Ajouter un document
                    </button>
                </div>

                <div className="filters-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '0.5rem' }}>
                    <div className="filter-group">
                        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Type:</label>
                        <select
                            value={filterType}
                            onChange={(e) => {
                                console.log('Type filter changed to:', e.target.value);
                                setFilterType(e.target.value);
                            }}
                            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '2px solid var(--color-border)' }}
                        >
                            <option value="">Tous les types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>Matière:</label>
                        <select
                            value={filterMatiere}
                            onChange={(e) => {
                                console.log('Matiere filter changed to:', e.target.value);
                                setFilterMatiere(e.target.value);
                            }}
                            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '2px solid var(--color-border)' }}
                        >
                            <option value="">Toutes les matières</option>
                            {database.matieres.map(matiere => (
                                <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontWeight: 'bold', color: '#667eea' }}>
                        Résultats: {filteredSupports.length} / {database.supports.length}
                    </div>
                </div>

                {showForm && (
                    <div className="form-container">
                        <h3>{editingItem ? 'Modifier le document' : 'Nouveau document'}</h3>
                        <SupportForm
                            onSubmit={(data) => editingItem ? handleUpdateSupport(editingItem.id, data) : handleAddSupport(data)}
                            onCancel={() => { setShowForm(false); setEditingItem(null); }}
                            initialData={editingItem}
                            matieres={database.matieres}
                            semestres={database.semestres}
                        />
                    </div>
                )}

                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Matière</th>
                                <th>Chemin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSupports.map(support => (
                                <tr key={support.id}>
                                    <td data-label="ID">{support.id}</td>
                                    <td data-label="Nom">{support.nom}</td>
                                    <td data-label="Type"><span className="badge">{support.type}</span></td>
                                    <td data-label="Matière">{getMatiereName(support.id_matiere)}</td>
                                    <td data-label="Chemin" className="file-path">{support.chemin_fichier}</td>
                                    <td data-label="Actions" className="actions">
                                        <button
                                            onClick={() => { setEditingItem(support); setShowForm(true); }}
                                            className="btn-edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSupport(support.id)}
                                            className="btn-delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSupports.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                        Aucun document trouvé pour ces critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-panel">
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={closeConfirmDialog}
            />

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type}`}>
                        <div className="toast-content">
                            <span className="toast-message">{toast.message}</span>
                        </div>
                        {toast.undoAction && (
                            <button
                                onClick={() => handleUndo(toast.id, toast.undoAction)}
                                className="toast-undo-btn"
                            >
                                ↩ Annuler
                            </button>
                        )}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="toast-close-btn"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="admin-header">

                <h1><Settings size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Administration</h1>
                <button onClick={onLogout} className="btn-logout">
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Déconnexion
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
                    onClick={() => { setActiveTab('dashboard'); setShowForm(false); setEditingItem(null); }}
                >
                    <BarChart3 size={18} style={{ marginRight: '0.5rem', display: 'inline' }} /> Tableau de bord
                </button>
                <button
                    className={activeTab === 'semesters' ? 'tab active' : 'tab'}
                    onClick={() => { setActiveTab('semesters'); setShowForm(false); setEditingItem(null); }}
                >
                    <GraduationCap size={18} style={{ marginRight: '0.5rem', display: 'inline' }} /> Semestres
                </button>
                <button
                    className={activeTab === 'matieres' ? 'tab active' : 'tab'}
                    onClick={() => { setActiveTab('matieres'); setShowForm(false); setEditingItem(null); }}
                >
                    <BookOpen size={18} style={{ marginRight: '0.5rem', display: 'inline' }} /> Matières
                </button>
                <button
                    className={activeTab === 'supports' ? 'tab active' : 'tab'}
                    onClick={() => { setActiveTab('supports'); setShowForm(false); setEditingItem(null); }}
                >
                    <FileText size={18} style={{ marginRight: '0.5rem', display: 'inline' }} /> Documents
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'semesters' && renderSemesters()}
                {activeTab === 'matieres' && renderMatieres()}
                {activeTab === 'supports' && renderSupports()}
            </div>
        </div>
    );
};

export default AdminPanel;
