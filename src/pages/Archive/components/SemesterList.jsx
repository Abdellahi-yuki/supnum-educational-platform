import React from 'react';
import { FolderOpen } from 'lucide-react';

const SemesterList = ({ semesters, subjects, onSelectSemester }) => {
    return (
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
};

export default SemesterList;
