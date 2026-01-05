import React from 'react';
import { BookOpenText, ScrollText, Laptop, ClipboardCheck, FileSpreadsheet, Microscope, RotateCcw, BookMarked, ArrowLeft } from 'lucide-react';

const SearchResults = ({ results, query, onSelectResult, onBack }) => {
    return (
        <div id="search-results" style={{ display: 'block' }}>
            <h2>Résultats de recherche pour "{query}"</h2>
            <button className="back-button" onClick={onBack}><ArrowLeft size={20} /> Retour à l'accueil</button>

            {results.length === 0 ? (
                <p>Aucun résultat trouvé.</p>
            ) : (
                <div className="grid">
                    {results.map((result, index) => {
                        if (result.type === 'support') {
                            const typeIcons = {
                                cours: <BookOpenText size={40} />,
                                td: <ScrollText size={40} />,
                                tp: <Laptop size={40} />,
                                devoir: <ClipboardCheck size={40} />,
                                examen: <FileSpreadsheet size={40} />,
                                examen_pratique: <Microscope size={40} />,
                                rattrapage: <RotateCcw size={40} />
                            };
                            const icon = typeIcons[result.item.type] || <ScrollText size={40} />;
                            return (
                                <div key={index} className="card" onClick={() => onSelectResult(result)}>
                                    <div className="card-icon">{icon}</div>
                                    <h3>{result.item.nom}</h3>
                                    <p>{result.matiere.nom} - {result.semestre.nom}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div key={index} className="card" onClick={() => onSelectResult(result)}>
                                    <div className="card-icon"><BookMarked size={40} /></div>
                                    <h3>{result.item.nom}</h3>
                                    <p>{result.semestre.nom}</p>
                                </div>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
