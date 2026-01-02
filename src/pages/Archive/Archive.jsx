import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline'; // Removed to avoid global side effects
import theme from './theme';
import { loadData } from './utils/dataManager';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import SemesterList from './components/SemesterList';
import SubjectList from './components/SubjectList';
import DocumentList from './components/DocumentList';
import FileViewer from './components/FileViewer';
import SearchResults from './components/SearchResults';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './style.css';

function Archive() {
    const [database, setDatabase] = useState(loadData());
    const [currentView, setCurrentView] = useState('semesters'); // semesters, subjects, documents, search, admin
    const [currentSemester, setCurrentSemester] = useState(null);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Accueil', action: 'semesters' }]);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
        sessionStorage.getItem('admin-authenticated') === 'true'
    );

    // Check authentication on mount
    useEffect(() => {
        const isAuth = sessionStorage.getItem('admin-authenticated') === 'true';
        setIsAdminAuthenticated(isAuth);
    }, []);

    const handleSelectSemester = (semesterId) => {
        const semester = database.semestres.find(s => s.id === semesterId);
        setCurrentSemester(semester);
        setCurrentView('subjects');
        setBreadcrumbs([
            { name: 'Accueil', action: 'semesters' },
            { name: semester.nom, action: null }
        ]);
    };

    const handleSelectSubject = (subjectId) => {
        const subject = database.matieres.find(m => m.id === subjectId);
        const semester = database.semestres.find(s => s.id === subject.id_semestre);
        setCurrentSubject(subject);
        setCurrentSemester(semester); // Ensure semester is set if coming from search
        setCurrentView('documents');
        setBreadcrumbs([
            { name: 'Accueil', action: 'semesters' },
            { name: semester.nom, action: 'subjects' },
            { name: subject.nom, action: null }
        ]);
    };

    const handleSelectDocument = (doc) => {
        setCurrentFile(doc);
    };

    const handleSearch = (query) => {
        if (!query.trim()) return;
        setSearchQuery(query);

        const results = [];
        // Search supports
        database.supports.forEach(support => {
            if (support.nom.toLowerCase().includes(query.toLowerCase())) {
                const matiere = database.matieres.find(m => m.id === support.id_matiere);
                const semestre = database.semestres.find(s => s.id === matiere.id_semestre);
                results.push({
                    type: 'support',
                    item: support,
                    matiere: matiere,
                    semestre: semestre
                });
            }
        });

        // Search subjects
        database.matieres.forEach(matiere => {
            if (matiere.nom.toLowerCase().includes(query.toLowerCase())) {
                const semestre = database.semestres.find(s => s.id === matiere.id_semestre);
                results.push({
                    type: 'matiere',
                    item: matiere,
                    semestre: semestre
                });
            }
        });

        setSearchResults(results);
        setCurrentView('search');
        setBreadcrumbs([{ name: 'Recherche', action: null }]);
    };

    const handleSelectSearchResult = (result) => {
        if (result.type === 'support') {
            handleSelectSubject(result.matiere.id);
            // Optionally auto-open the document, but for now just go to the list
        } else {
            handleSelectSubject(result.item.id);
        }
    };

    const handleNavigate = (item) => {
        if (item.action === 'semesters') {
            setCurrentView('semesters');
            setCurrentSemester(null);
            setCurrentSubject(null);
            setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }]);
        } else if (item.action === 'subjects') {
            setCurrentView('subjects');
            setCurrentSubject(null);
            setBreadcrumbs([
                { name: 'Accueil', action: 'semesters' },
                { name: currentSemester.nom, action: null }
            ]);
        }
    };

    const handleAdminAccess = () => {
        if (isAdminAuthenticated) {
            setCurrentView('admin');
            setBreadcrumbs([{ name: 'Administration', action: null }]);
        } else {
            setCurrentView('admin-login');
        }
    };

    const handleAdminLogin = () => {
        setIsAdminAuthenticated(true);
        setCurrentView('admin');
        setBreadcrumbs([{ name: 'Administration', action: null }]);
    };

    const handleAdminLogout = () => {
        sessionStorage.removeItem('admin-authenticated');
        setIsAdminAuthenticated(false);
        setCurrentView('semesters');
        setBreadcrumbs([{ name: 'Accueil', action: 'semesters' }]);
    };

    const handleDataChange = (newData) => {
        setDatabase(newData);
    };

    const handleBack = () => {
        if (currentView === 'subjects') {
            handleNavigate({ action: 'semesters' });
        } else if (currentView === 'documents') {
            handleNavigate({ action: 'subjects' });
        } else if (currentView === 'search') {
            handleNavigate({ action: 'semesters' });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="archive-container">
                <div className="container">
                    <Header onSearch={handleSearch} onAdminAccess={handleAdminAccess} />

                    <div className="main-content">
                        {currentView === 'admin-login' && (
                            <AdminLogin onLogin={handleAdminLogin} />
                        )}

                        {currentView === 'admin' && isAdminAuthenticated && (
                            <AdminPanel
                                database={database}
                                onDataChange={handleDataChange}
                                onLogout={handleAdminLogout}
                            />
                        )}

                        {currentView !== 'search' && currentView !== 'admin' && currentView !== 'admin-login' && (
                            <Breadcrumb items={breadcrumbs} onNavigate={handleNavigate} />
                        )}

                        {currentView === 'semesters' && (
                            <SemesterList
                                semesters={database.semestres}
                                subjects={database.matieres}
                                onSelectSemester={handleSelectSemester}
                            />
                        )}

                        {currentView === 'subjects' && currentSemester && (
                            <SubjectList
                                subjects={database.matieres.filter(m => m.id_semestre === currentSemester.id)}
                                supports={database.supports}
                                semesterName={currentSemester.nom}
                                onSelectSubject={handleSelectSubject}
                                onBack={handleBack}
                            />
                        )}

                        {currentView === 'documents' && currentSubject && (
                            <DocumentList
                                documents={database.supports.filter(s => s.id_matiere === currentSubject.id)}
                                subjectName={currentSubject.nom}
                                onSelectDocument={handleSelectDocument}
                                onBack={handleBack}
                            />
                        )}

                        {currentView === 'search' && (
                            <SearchResults
                                results={searchResults}
                                query={searchQuery}
                                onSelectResult={handleSelectSearchResult}
                                onBack={handleBack}
                            />
                        )}

                        {currentView !== 'admin' && currentView !== 'admin-login' && (
                            <>
                                <p className="i-uz-arch">Made by PixelCraft</p>
                                <p className="i-uz-arch">RSS THE TOP</p>
                                <p className="i-uz-arch">I use Arch Btw</p>
                            </>
                        )}
                    </div>

                    <h3 style={{ color: 'rgba(255, 255, 255, 0)' }}>I use Arch Btw</h3>

                    {currentFile && (
                        <FileViewer file={currentFile} onClose={() => setCurrentFile(null)} />
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default Archive;
