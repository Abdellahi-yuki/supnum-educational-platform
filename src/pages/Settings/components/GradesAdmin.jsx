import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../../apiConfig';
import {
    LayoutDashboard, Plus, Upload, Database, Save,
    X, Trash2, Edit3, CheckCircle2, AlertCircle, FileSpreadsheet,
    Loader2, ChevronRight
} from 'lucide-react';
import './GradesAdmin.css';

const GradesAdmin = () => {
    const [activeTab, setActiveTab] = useState('manual');
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Manual Grade Form
    const [gradeForm, setGradeForm] = useState({
        semester: 1,
        Matricule: '',
        Dept: '',
        Prenom: '',
        Nom: '',
        // Dynamic subject grades go here
    });

    // Excel Import State
    const [excelData, setExcelData] = useState(null);
    const [importSemester, setImportSemester] = useState(1);
    const [startRow, setStartRow] = useState(2);
    const [colMapping, setColMapping] = useState({});
    const [tableCols, setTableCols] = useState([]);
    const [manualCols, setManualCols] = useState([]);
    const [manualData, setManualData] = useState({});
    const [isManualExpanded, setIsManualExpanded] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0, status: 'idle' });
    const [columnGroups, setColumnGroups] = useState({ groups: {}, individual: [], orderedUnits: [] });

    // Matieres Form Task
    const [matiereForm, setMatiereForm] = useState({ code: '', nom: '', credit: 2 });
    const [editingMatiere, setEditingMatiere] = useState(null);

    useEffect(() => {
        fetchMatieres();
    }, []);

    const fetchMatieres = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/matieres.php`);
            setMatieres(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching matieres:', e);
        }
    };

    const handleFetchTableCols = async (sem, isManual = false) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/grades.php?semester=${sem}&action=cols`);
            if (res.data && res.data.columns) {
                const cols = res.data.columns;
                if (isManual) {
                    setManualCols(cols);
                    const initialData = {};
                    cols.forEach(col => initialData[col] = '');
                    setManualData(initialData);
                    setIsManualExpanded(false); // Reset expansion on semester change
                } else {
                    setTableCols(cols);

                    const groups = {};
                    const individual = [];
                    const orderedUnits = [];
                    const processedCols = new Set();

                    cols.forEach((col) => {
                        if (processedCols.has(col)) return;

                        const parts = col.split('_');
                        const prefix = parts[0];
                        const suffix = parts.slice(1).join('_');

                        if (['NCC', 'NSN', 'NSR', 'MOY', 'CAPIT', 'V'].includes(prefix) && suffix) {
                            // Find all columns belonging to this subject group
                            const subjectCols = cols.filter(c => {
                                const p = c.split('_');
                                return p.slice(1).join('_') === suffix && ['NCC', 'NSN', 'NSR', 'MOY', 'CAPIT', 'V'].includes(p[0]);
                            });

                            if (!groups[suffix]) {
                                groups[suffix] = subjectCols;
                                orderedUnits.push({ id: suffix, size: subjectCols.length, dbCols: subjectCols, isGroup: true });
                                subjectCols.forEach(c => processedCols.add(c));
                            }
                        } else {
                            individual.push(col);
                            orderedUnits.push({ id: col, size: 1, dbCols: [col], isGroup: false });
                            processedCols.add(col);
                        }
                    });

                    setColumnGroups({ groups, individual, orderedUnits });

                    // Default mapping: sequential logical indices
                    const initialMapping = {};
                    orderedUnits.forEach((unit, idx) => {
                        initialMapping[unit.id] = idx + 1;
                    });
                    setColMapping(initialMapping);
                }
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        handleFetchTableCols(gradeForm.semester, true);
    }, [gradeForm.semester]);

    useEffect(() => {
        handleFetchTableCols(importSemester);
    }, [importSemester]);

    // Excel Parsing
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            setExcelData(data);

            // Auto-detect columns if any
            if (data.length > 0) {
                // ...
            }
        };
        reader.readAsBinaryString(file);
    };

    const runImport = async () => {
        if (!excelData || Object.keys(colMapping).length === 0) return;

        // Calculate physical Excel indices from logical mapping
        const sortedMappedUnits = columnGroups.orderedUnits
            .filter(u => colMapping[u.id] > 0)
            .sort((a, b) => colMapping[a.id] - colMapping[b.id]);

        const unitToExcelCol = {};
        if (sortedMappedUnits.length > 0) {
            let currentExcelCol = colMapping[sortedMappedUnits[0].id];
            unitToExcelCol[sortedMappedUnits[0].id] = currentExcelCol;

            for (let i = 1; i < sortedMappedUnits.length; i++) {
                const prev = sortedMappedUnits[i - 1];
                const curr = sortedMappedUnits[i];
                const logicalGap = colMapping[curr.id] - colMapping[prev.id];
                currentExcelCol += logicalGap * prev.size;
                unitToExcelCol[curr.id] = currentExcelCol;
            }
        }

        setImportProgress({ current: 0, total: excelData.length - startRow + 1, status: 'processing' });

        let count = 0;
        for (let i = startRow - 1; i < excelData.length; i++) {
            const row = excelData[i];

            // STOP at empty line
            if (!row || row.length === 0 || !row.some(cell => cell !== null && cell !== '')) {
                break;
            }

            // Build record based on mapping
            const record = {};
            Object.entries(unitToExcelCol).forEach(([unitId, excelStartCol]) => {
                const unit = columnGroups.orderedUnits.find(u => u.id === unitId);
                if (!unit) return;

                unit.dbCols.forEach((dbCol, offset) => {
                    record[dbCol] = row[excelStartCol + offset - 1];
                });
            });

            try {
                await axios.post(`${API_BASE_URL}/admin/grades.php`, {
                    action: 'upsert',
                    semester: importSemester,
                    record: record
                });
                count++;
                setImportProgress(prev => ({ ...prev, current: count }));
            } catch (e) {
                console.error('Error importing row:', i, e);
                // Continue?
            }
        }
        setImportProgress(prev => ({ ...prev, status: 'done' }));
        alert(`Importation terminée ! ${count} lignes insérées.`);
    };

    const handleSaveMatiere = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/admin/matieres.php`, {
                action: 'upsert',
                ...matiereForm
            });
            setMatiereForm({ code: '', nom: '', credit: 2 });
            setEditingMatiere(null);
            fetchMatieres();
            alert('Matière enregistrée avec succès');
        } catch (e) {
            alert('Erreur lors de l\'enregistrement');
        }
        setSaving(false);
    };

    const handleManualGradeSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/admin/grades.php`, {
                action: 'upsert',
                semester: gradeForm.semester,
                record: manualData
            });
            alert('Notes enregistrées avec succès');
        } catch (e) {
            alert('Erreur lors de l\'enregistrement');
        }
        setSaving(false);
    };

    return (
        <div className="grades-admin-container">
            <div className="admin-header">
                <div>
                    <h1>Gestion des Notes & Matières</h1>
                    <p>Administration centralisée des résultats académiques</p>
                </div>
            </div>

            <div className="management-tabs">
                <button
                    className={`m-tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manual')}
                >
                    <Plus size={18} /> Saisie Manuelle
                </button>
                <button
                    className={`m-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                    onClick={() => setActiveTab('import')}
                >
                    <FileSpreadsheet size={18} /> Import Excel
                </button>
                <button
                    className={`m-tab-btn ${activeTab === 'matieres' ? 'active' : ''}`}
                    onClick={() => setActiveTab('matieres')}
                >
                    <BookOpen size={18} /> Matières
                </button>
            </div>

            <div className="admin-body-content">
                {activeTab === 'manual' && (
                    <div className="admin-form-card admin-view-fade">
                        <h2>Saisie de Notes Individuelle</h2>
                        <form onSubmit={handleManualGradeSave}>
                            <div className="form-grid" style={{ marginBottom: '2rem' }}>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Semestre</label>
                                    <select
                                        className="auth-input"
                                        style={{ maxWidth: '300px' }}
                                        value={gradeForm.semester}
                                        onChange={e => setGradeForm({ ...gradeForm, semester: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>Semestre 1</option>
                                        <option value={11}>Semestre 1 (Rattrapage)</option>
                                        <option value={2}>Semestre 2</option>
                                        <option value={22}>Semestre 2 (Rattrapage)</option>
                                        <option value={3}>Semestre 3</option>
                                        <option value={4}>Semestre 4</option>
                                    </select>
                                </div>

                                {manualCols.filter(c => ['Dept', 'Matricule', 'Prenom', 'Nom'].includes(c)).map(col => (
                                    <div key={col} className="form-group">
                                        <label>{col}</label>
                                        <input
                                            className="auth-input"
                                            placeholder={`Valeur pour ${col}`}
                                            value={manualData[col] || ''}
                                            onChange={e => setManualData({ ...manualData, [col]: e.target.value })}
                                            required={col === 'Matricule'}
                                        />
                                    </div>
                                ))}

                                {!isManualExpanded && (
                                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem', textAlign: 'center' }}>
                                        <button
                                            type="button"
                                            className="btn-primary"
                                            onClick={() => setIsManualExpanded(true)}
                                            style={{ margin: '0 auto' }}
                                        >
                                            Continuer la saisie <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {isManualExpanded && manualCols.filter(c => !['Dept', 'Matricule', 'Prenom', 'Nom'].includes(c)).map(col => (
                                    <div key={col} className="form-group">
                                        <label>{col}</label>
                                        <input
                                            className="auth-input"
                                            placeholder={`Valeur pour ${col}`}
                                            value={manualData[col] || ''}
                                            onChange={e => setManualData({ ...manualData, [col]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>

                            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                                <AlertCircle size={14} className="inline-icon" /> Pour les notes spécifiques (NCC, NSN, NSR), utilisez l'import Excel pour un gain de temps, ou ajoutez les champs dynamiquement si nécessaire.
                            </p>

                            <div style={{ marginTop: '2rem' }}>
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? <Loader2 className="spinning" /> : <Save size={18} />} Enregistrer les Notes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'import' && (
                    <div className="admin-form-card admin-view-fade">
                        <h2>Importation massive via Excel</h2>

                        {!excelData ? (
                            <div className="import-zone" onClick={() => document.getElementById('excel-file').click()}>
                                <FileSpreadsheet size={48} className="text-dim" style={{ marginBottom: '1rem' }} />
                                <h3>Cliquez pour sélectionner un fichier Excel</h3>
                                <p>Fichiers .xlsx ou .xls supportés</p>
                                <input
                                    type="file"
                                    id="excel-file"
                                    hidden
                                    accept=".xlsx, .xls"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        ) : (
                            <div className="import-config">
                                <div className="form-grid" style={{ marginBottom: '2rem' }}>
                                    <div className="form-group">
                                        <label>Semestre cible</label>
                                        <select
                                            className="auth-input"
                                            value={importSemester}
                                            onChange={e => setImportSemester(parseInt(e.target.value))}
                                        >
                                            <option value={1}>Semestre 1</option>
                                            <option value={11}>Semestre 1 (Rattrapage)</option>
                                            <option value={2}>Semestre 2</option>
                                            <option value={22}>Semestre 2 (Rattrapage)</option>
                                            <option value={3}>Semestre 3</option>
                                            <option value={4}>Semestre 4</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Première ligne de données</label>
                                        <input
                                            type="number"
                                            className="auth-input"
                                            value={startRow}
                                            onChange={e => setStartRow(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button className="btn-secondary" onClick={() => setExcelData(null)}>Changer de fichier</button>
                                    </div>
                                </div>

                                <div className="mapping-container">
                                    <h3>Correspondance des colonnes</h3>
                                    <p style={{ color: 'var(--p-text-dim)', marginBottom: '1rem' }}>
                                        Indiquez l'ordre logique des colonnes. Pour les groupes (en bleu), <strong>utilisez un numéro séquentiel</strong> (ex: 15, 16) et le système calculera automatiquement le décalage réel dans l'Excel.
                                    </p>

                                    <div className="mapping-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {columnGroups.orderedUnits.map(unit => (
                                            <div
                                                key={unit.id}
                                                className={`mapping-item ${unit.isGroup ? 'group-mapping' : ''}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    background: unit.isGroup ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.03)',
                                                    padding: '0.8rem',
                                                    borderRadius: '10px',
                                                    border: unit.isGroup ? '1px solid rgba(59, 130, 246, 0.2)' : 'none'
                                                }}
                                            >
                                                <label
                                                    style={{
                                                        flex: 1,
                                                        fontSize: '0.9rem',
                                                        fontWeight: unit.isGroup ? '600' : '400',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    title={unit.isGroup ? `Groupe: ${unit.dbCols.join(', ')}` : unit.id}
                                                >
                                                    {unit.id}
                                                    {unit.isGroup && (
                                                        <div style={{ fontSize: '0.7rem', fontWeight: '400', opacity: 0.6 }}>Bloc de {unit.size}</div>
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    className="mapping-input"
                                                    placeholder="-"
                                                    value={colMapping[unit.id] || ''}
                                                    onChange={e => setColMapping(prev => ({ ...prev, [unit.id]: parseInt(e.target.value) || 0 }))}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                            <strong>Note:</strong> Vous pouvez aussi ajouter des colonnes personnalisées comme <code>NCC_DEV110</code> en les ajoutant manuellement à la liste des champs (Fonctionnalité avancée).
                                        </p>
                                    </div>
                                </div>

                                {importProgress.status === 'processing' && (
                                    <div className="import-stats">
                                        <div className="stat-item">
                                            <span className="stat-value">{importProgress.current} / {importProgress.total}</span>
                                            <span className="stat-label">Progression</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-value" style={{ color: 'var(--primary-blue)' }}>{Math.round((importProgress.current / importProgress.total) * 100)}%</span>
                                            <span className="stat-label">Terminé</span>
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={runImport}
                                        disabled={importProgress.status === 'processing'}
                                    >
                                        {importProgress.status === 'processing' ? <Loader2 className="spinning" /> : <Upload size={18} />} Démarrer l'importation
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'matieres' && (
                    <div className="admin-view-fade">
                        <div className="form-card admin-form-card" style={{ marginBottom: '2rem' }}>
                            <h3>{editingMatiere ? 'Modifier la Matière' : 'Ajouter une Matière'}</h3>
                            <form onSubmit={handleSaveMatiere} className="form-grid">
                                <div className="form-group">
                                    <label>Code</label>
                                    <input
                                        className="auth-input"
                                        placeholder="ex: DEV110"
                                        value={matiereForm.code}
                                        onChange={e => setMatiereForm({ ...matiereForm, code: e.target.value.toUpperCase() })}
                                        required
                                        disabled={!!editingMatiere}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom complet</label>
                                    <input
                                        className="auth-input"
                                        placeholder="ex: Algorithmique..."
                                        value={matiereForm.nom}
                                        onChange={e => setMatiereForm({ ...matiereForm, nom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Crédits</label>
                                    <input
                                        type="number"
                                        className="auth-input"
                                        value={matiereForm.credit}
                                        onChange={e => setMatiereForm({ ...matiereForm, credit: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                                    <button type="submit" className="btn-primary">
                                        <Save size={18} /> {editingMatiere ? 'Mettre à jour' : 'Ajouter'}
                                    </button>
                                    {editingMatiere && (
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={() => { setEditingMatiere(null); setMatiereForm({ code: '', nom: '', credit: 2 }); }}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="matieres-grid">
                            {matieres.map(m => (
                                <div key={m.code} className="matiere-card card-hover">
                                    <div className="matiere-info">
                                        <h4><span className="code-badge">{m.code}</span> {m.nom}</h4>
                                        <p>{m.credit} Crédits</p>
                                    </div>
                                    <div className="matiere-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="icon-btn" onClick={() => { setEditingMatiere(m); setMatiereForm(m); }}>
                                            <Edit3 size={16} />
                                        </button>
                                        <button className="icon-btn btn-delete" onClick={async () => {
                                            if (confirm(`Supprimer ${m.code} ?`)) {
                                                await axios.delete(`${API_BASE_URL}/admin/matieres.php?code=${m.code}`);
                                                fetchMatieres();
                                            }
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BookOpen = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

export default GradesAdmin;
