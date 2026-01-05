import React from 'react';
import { BookMarked, ArrowLeft } from 'lucide-react';

const SubjectList = ({ subjects, supports, onSelectSubject, onBack, semesterName }) => {
    return (
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
};

export default SubjectList;
