import React, { useState, useEffect } from 'react';

const SupportForm = ({ onSubmit, onCancel, initialData = null, matieres = [], semestres = [] }) => {
    const [formData, setFormData] = useState({
        nom: '',
        type: 'cours',
        chemin_fichier: '',
        id_matiere: ''
    });

    const [selectedSemester, setSelectedSemester] = useState('');
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('manual'); // 'manual' or 'upload'

    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom,
                type: initialData.type,
                chemin_fichier: initialData.chemin_fichier,
                id_matiere: initialData.id_matiere
            });

            const matiere = matieres.find(m => m.id === initialData.id_matiere);
            if (matiere) {
                setSelectedSemester(matiere.id_semestre);
            }
            setUploadMode('manual');
        }
    }, [initialData, matieres]);

    useEffect(() => {
        if (selectedSemester) {
            setFilteredMatieres(matieres.filter(m => m.id_semestre === parseInt(selectedSemester)));
        } else {
            setFilteredMatieres([]);
        }
    }, [selectedSemester, matieres]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            if (!formData.nom) {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                setFormData({ ...formData, nom: nameWithoutExt });
            }

            if (selectedSemester && formData.id_matiere && formData.type) {
                const semester = semestres.find(s => s.id === parseInt(selectedSemester));
                const matiere = matieres.find(m => m.id === parseInt(formData.id_matiere));

                if (semester && matiere) {
                    const semesterNum = semester.nom.match(/\d+/)?.[0] || '1';
                    const semesterFolder = `s${semesterNum}`;
                    const matiereFolder = matiere.nom.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                    const typeFolder = formData.type === 'examen_pratique' ? 'exam_pratique' : formData.type;
                    const path = `./${semesterFolder}/${matiereFolder}/${typeFolder}/${file.name}`;
                    setFormData(prev => ({ ...prev, chemin_fichier: path }));
                }
            }
        }
    };

    useEffect(() => {
        if (uploadMode === 'upload' && selectedFile && selectedSemester && formData.id_matiere && formData.type) {
            const semester = semestres.find(s => s.id === parseInt(selectedSemester));
            const matiere = matieres.find(m => m.id === parseInt(formData.id_matiere));

            if (semester && matiere) {
                const semesterNum = semester.nom.match(/\d+/)?.[0] || '1';
                const semesterFolder = `s${semesterNum}`;
                const matiereFolder = matiere.nom.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
                const typeFolder = formData.type === 'examen_pratique' ? 'exam_pratique' : formData.type;
                const path = `./${semesterFolder}/${matiereFolder}/${typeFolder}/${selectedFile.name}`;
                setFormData(prev => ({ ...prev, chemin_fichier: path }));
            }
        }
    }, [selectedSemester, formData.id_matiere, formData.type, uploadMode, selectedFile, semestres, matieres]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (uploadMode === 'upload' && selectedFile) {
            const publicPath = formData.chemin_fichier.replace('./', 'public/');
            const message = `📁 Fichier ajouté à la base de données !\n\n⚠️ N'oubliez pas de placer le fichier "${selectedFile.name}" dans:\n${publicPath}\n\nSinon le fichier ne sera pas accessible.`;
            alert(message);
        }

        if (formData.nom.trim() && formData.chemin_fichier.trim() && formData.id_matiere) {
            onSubmit({
                nom: formData.nom,
                type: formData.type,
                chemin_fichier: formData.chemin_fichier,
                id_matiere: parseInt(formData.id_matiere)
            });
            setFormData({ nom: '', type: 'cours', chemin_fichier: '', id_matiere: '' });
            setSelectedSemester('');
            setSelectedFile(null);
            setUploadMode('manual');
        }
    };

    const documentTypes = [
        { value: 'cours', label: '📚 Cours' },
        { value: 'td', label: '📝 TD' },
        { value: 'tp', label: '💻 TP' },
        { value: 'devoir', label: '📋 Devoir' },
        { value: 'examen', label: '📄 Examen' },
        { value: 'examen_pratique', label: '⌨️ Examen Pratique' },
        { value: 'rattrapage', label: '🔄 Rattrapage' }
    ];

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="support-name">Nom du document *</label>
                <input
                    type="text"
                    id="support-name"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Chapitre 1 - Introduction"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="support-type">Type de document *</label>
                <select
                    id="support-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                >
                    {documentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="semester-filter">Semestre *</label>
                <select
                    id="semester-filter"
                    value={selectedSemester}
                    onChange={(e) => {
                        setSelectedSemester(e.target.value);
                        setFormData({ ...formData, id_matiere: '' });
                    }}
                    required
                >
                    <option value="">-- Sélectionner un semestre --</option>
                    {semestres.map(semester => (
                        <option key={semester.id} value={semester.id}>
                            {semester.nom}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="matiere-select">Matière *</label>
                <select
                    id="matiere-select"
                    value={formData.id_matiere}
                    onChange={(e) => setFormData({ ...formData, id_matiere: e.target.value })}
                    required
                    disabled={!selectedSemester}
                >
                    <option value="">-- Sélectionner une matière --</option>
                    {filteredMatieres.map(matiere => (
                        <option key={matiere.id} value={matiere.id}>
                            {matiere.nom}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Mode d'ajout du fichier</label>
                <div className="upload-mode-selector">
                    <button
                        type="button"
                        className={uploadMode === 'manual' ? 'mode-btn active' : 'mode-btn'}
                        onClick={() => setUploadMode('manual')}
                    >
                        ✍️ Chemin manuel
                    </button>
                    <button
                        type="button"
                        className={uploadMode === 'upload' ? 'mode-btn active' : 'mode-btn'}
                        onClick={() => setUploadMode('upload')}
                    >
                        📤 Sélectionner fichier
                    </button>
                </div>
            </div>

            {uploadMode === 'upload' ? (
                <>
                    <div className="form-group">
                        <label htmlFor="file-upload">Sélectionner un fichier *</label>
                        <input
                            type="file"
                            id="file-upload"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.sql,.java,.py,.c,.cpp,.html,.css,.js,.xlsx"
                            className="file-input"
                        />
                        {selectedFile && (
                            <div className="file-preview">
                                <span className="file-icon">📄</span>
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                            </div>
                        )}
                        <small>Le chemin sera généré automatiquement selon le semestre, la matière et le type</small>
                    </div>

                    {formData.chemin_fichier && (
                        <div className="form-group">
                            <label>Chemin généré automatiquement</label>
                            <div className="generated-path">
                                <code>{formData.chemin_fichier}</code>
                            </div>
                            <small className="path-instruction">
                                ⚠️ <strong>Important:</strong> Après l'ajout, placez le fichier dans: <strong>public{formData.chemin_fichier.substring(1)}</strong>
                            </small>
                        </div>
                    )}
                </>
            ) : (
                <div className="form-group">
                    <label htmlFor="file-path">Chemin du fichier *</label>
                    <input
                        type="text"
                        id="file-path"
                        value={formData.chemin_fichier}
                        onChange={(e) => setFormData({ ...formData, chemin_fichier: e.target.value })}
                        placeholder="Ex: ./s1/Analyse/cours/chapitre1.pdf"
                        required
                    />
                    <small>Chemin relatif vers le fichier dans le dossier public</small>
                </div>
            )}

            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {initialData ? '✓ Modifier' : '+ Ajouter'}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default SupportForm;
