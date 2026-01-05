import React from 'react';
import { BookOpenText, ScrollText, Laptop, ClipboardCheck, FileSpreadsheet, Microscope, RotateCcw, ArrowLeft } from 'lucide-react';

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
        cours: 'Cours',
        td: 'Travaux Dirigés',
        tp: 'Travaux Pratiques',
        devoir: 'Devoirs',
        examen: 'Examens',
        examen_pratique: 'Examens Pratiques',
        rattrapage: 'Rattrapages'
    };

    const typeIcons = {
        cours: <BookOpenText size={20} />,
        td: <ScrollText size={20} />,
        tp: <Laptop size={20} />,
        devoir: <ClipboardCheck size={20} />,
        examen: <FileSpreadsheet size={20} />,
        examen_pratique: <Microscope size={20} />,
        rattrapage: <RotateCcw size={20} />
    };

    const hasDocuments = Object.values(groupedDocs).some(arr => arr.length > 0);

    return (
        <div id="documentsView">
            <button className="back-button" onClick={onBack}><ArrowLeft size={20} /> Retour</button>
            <h2 id="documentsTitle">{subjectName}</h2>
            <div id="documentsGrid">
                {!hasDocuments && (
                    <p style={{ textAlign: 'center', color: '#666', margin: '40px 0' }}>
                        Aucun document disponible pour cette matière.
                    </p>
                )}
                {Object.keys(groupedDocs).map(type => {
                    if (groupedDocs[type].length === 0) return null;
                    return (
                        <div key={type}>
                            <h3 style={{ marginTop: '20px', color: '#4a5568', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {typeIcons[type]}
                                {typeNames[type]}
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

export default DocumentList;
