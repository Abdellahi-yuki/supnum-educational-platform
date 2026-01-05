import React, { useState, useEffect } from 'react';

const SubjectForm = ({ onSubmit, onCancel, initialData = null, semesters = [] }) => {
    const [formData, setFormData] = useState({
        nom: '',
        id_semestre: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nom: initialData.nom,
                id_semestre: initialData.id_semestre
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.nom.trim() && formData.id_semestre) {
            onSubmit({
                nom: formData.nom,
                id_semestre: parseInt(formData.id_semestre)
            });
            setFormData({ nom: '', id_semestre: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="subject-name">Nom de la matière *</label>
                <input
                    type="text"
                    id="subject-name"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Algorithmique et Programmation"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="semester-select">Semestre *</label>
                <select
                    id="semester-select"
                    value={formData.id_semestre}
                    onChange={(e) => setFormData({ ...formData, id_semestre: e.target.value })}
                    required
                >
                    <option value="">-- Sélectionner un semestre --</option>
                    {semesters.map(semester => (
                        <option key={semester.id} value={semester.id}>
                            {semester.nom}
                        </option>
                    ))}
                </select>
            </div>

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

export default SubjectForm;
