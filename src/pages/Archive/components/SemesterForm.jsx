import React, { useState, useEffect } from 'react';

const SemesterForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        nom: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ nom: initialData.nom });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.nom.trim()) {
            onSubmit(formData);
            setFormData({ nom: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
                <label htmlFor="semester-name">Nom du semestre *</label>
                <input
                    type="text"
                    id="semester-name"
                    value={formData.nom}
                    onChange={(e) => setFormData({ nom: e.target.value })}
                    placeholder="Ex: Semestre 1 - L1"
                    required
                />
                <small>Format recommandé: Semestre X - LY</small>
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

export default SemesterForm;
