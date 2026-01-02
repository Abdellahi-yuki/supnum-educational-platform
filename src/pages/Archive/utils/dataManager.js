import { database as initialDatabase } from '../data/database';

const STORAGE_KEY = 'archive-supnum-data';

// Charger les données depuis localStorage ou utiliser les données initiales
export const loadData = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
    return { ...initialDatabase };
};

// Sauvegarder les données dans localStorage
export const saveData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
        return false;
    }
};

// Générer un nouvel ID
const generateId = (items) => {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
};

// CRUD pour les semestres
export const addSemester = (data, newSemester) => {
    const id = generateId(data.semestres);
    const semester = { id, ...newSemester };
    const updatedData = {
        ...data,
        semestres: [...data.semestres, semester]
    };
    saveData(updatedData);
    return updatedData;
};

export const updateSemester = (data, id, updates) => {
    const updatedData = {
        ...data,
        semestres: data.semestres.map(s => s.id === id ? { ...s, ...updates } : s)
    };
    saveData(updatedData);
    return updatedData;
};

export const deleteSemester = (data, id) => {
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

// CRUD pour les matières
export const addMatiere = (data, newMatiere) => {
    const id = generateId(data.matieres);
    const matiere = { id, ...newMatiere };
    const updatedData = {
        ...data,
        matieres: [...data.matieres, matiere]
    };
    saveData(updatedData);
    return updatedData;
};

export const updateMatiere = (data, id, updates) => {
    const updatedData = {
        ...data,
        matieres: data.matieres.map(m => m.id === id ? { ...m, ...updates } : m)
    };
    saveData(updatedData);
    return updatedData;
};

export const deleteMatiere = (data, id) => {
    const updatedData = {
        ...data,
        matieres: data.matieres.filter(m => m.id !== id),
        supports: data.supports.filter(s => s.id_matiere !== id)
    };
    saveData(updatedData);
    return updatedData;
};

// CRUD pour les supports
export const addSupport = (data, newSupport) => {
    const id = generateId(data.supports);
    const support = { id, ...newSupport };
    const updatedData = {
        ...data,
        supports: [...data.supports, support]
    };
    saveData(updatedData);
    return updatedData;
};

export const updateSupport = (data, id, updates) => {
    const updatedData = {
        ...data,
        supports: data.supports.map(s => s.id === id ? { ...s, ...updates } : s)
    };
    saveData(updatedData);
    return updatedData;
};

export const deleteSupport = (data, id) => {
    const updatedData = {
        ...data,
        supports: data.supports.filter(s => s.id !== id)
    };
    saveData(updatedData);
    return updatedData;
};

// Export/Import
export const exportData = (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `archive-supnum-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

export const importData = (file) => {
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

// Réinitialiser aux données par défaut
export const resetToDefault = () => {
    const data = { ...initialDatabase };
    saveData(data);
    return data;
};
