import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

export default function QuizBrowser() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [activeSemester, setActiveSemester] = useState('');
    const [activeSubject, setActiveSubject] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load archive structure and active quizzes in parallel
        Promise.all([
            fetch(`${API_BASE_URL}/archive.php`).then(r => r.json()),
            fetch(`${API_BASE_URL}/quiz.php?active_only=1`).then(r => r.json()),
        ]).then(([archive, quizData]) => {
            setSemesters(archive.semestres || []);
            setSubjects(archive.matieres || []);
            setQuizzes(Array.isArray(quizData) ? quizData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filteredSubjects = activeSemester
        ? subjects.filter(s => String(s.id_semestre) === activeSemester)
        : [];

    const filteredQuizzes = quizzes.filter(q => {
        if (activeSemester && String(q.semester_id) !== activeSemester) return false;
        if (activeSubject && String(q.subject_id) !== activeSubject) return false;
        return true;
    });

    const getQuizIcon = (subject) => {
        const icons = ['🧠', '📐', '⚙️', '💻', '📊', '🔬', '📡', '🗃️'];
        // Deterministic icon from subject name
        const hash = (subject || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        return icons[hash % icons.length];
    };

    return (
        <div className="quiz-page">
            <div className="quiz-page-header">
                <div>
                    <h1>🧠 Quiz</h1>
                    <p className="subtitle">Testez vos connaissances par matière</p>
                </div>
                <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz/history')}>
                    📋 Mon historique
                </button>
            </div>

            {/* Semester filter */}
            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--quiz-text-muted)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em' }}>
                    SEMESTRE
                </div>
                <div className="quiz-browser-filters">
                    <button
                        className={`quiz-filter-btn ${activeSemester === '' ? 'active' : ''}`}
                        onClick={() => { setActiveSemester(''); setActiveSubject(''); }}
                    >
                        Tous
                    </button>
                    {semesters.map(s => (
                        <button
                            key={s.id}
                            className={`quiz-filter-btn ${activeSemester === String(s.id) ? 'active' : ''}`}
                            onClick={() => { setActiveSemester(String(s.id)); setActiveSubject(''); }}
                        >
                            {s.nom}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject filter */}
            {activeSemester && filteredSubjects.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--quiz-text-muted)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em' }}>
                        MATIÈRE
                    </div>
                    <div className="quiz-browser-filters">
                        <button
                            className={`quiz-filter-btn ${activeSubject === '' ? 'active' : ''}`}
                            onClick={() => setActiveSubject('')}
                        >
                            Toutes les matières
                        </button>
                        {filteredSubjects.map(s => (
                            <button
                                key={s.id}
                                className={`quiz-filter-btn ${activeSubject === String(s.id) ? 'active' : ''}`}
                                onClick={() => setActiveSubject(String(s.id))}
                            >
                                {s.nom}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="quiz-loading"><div className="quiz-spinner" /> Chargement des quiz...</div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="quiz-empty-state">
                    <div className="empty-icon">📭</div>
                    <p>Aucun quiz disponible pour le moment.</p>
                    <p>Revenez plus tard ou sélectionnez un autre semestre.</p>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '0.85rem', color: 'var(--quiz-text-muted)', marginBottom: 16 }}>
                        {filteredQuizzes.length} quiz disponible{filteredQuizzes.length > 1 ? 's' : ''}
                    </div>
                    <div className="quiz-cards-grid">
                        {filteredQuizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} userId={user?.id} navigate={navigate} getIcon={getQuizIcon} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function QuizCard({ quiz, userId, navigate, getIcon }) {
    const [prevAttempt, setPrevAttempt] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!userId) return;
        fetch(`${API_BASE_URL}/quiz_attempt.php?quiz_id=${quiz.id}&user_id=${userId}`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => { setPrevAttempt(data); setChecking(false); })
            .catch(() => setChecking(false));
    }, [quiz.id, userId]);

    const percentage = prevAttempt && prevAttempt.max_score > 0
        ? Math.round((prevAttempt.score / prevAttempt.max_score) * 100)
        : null;

    const passed = percentage !== null && percentage >= 50;

    return (
        <div
            className={`quiz-item-card ${prevAttempt ? 'quiz-already-done' : ''}`}
            onClick={() => navigate(`/quiz/take/${quiz.id}`)}
        >
            <div className="quiz-item-icon">{getIcon(quiz.subject_name)}</div>
            <div className="quiz-item-title">{quiz.title}</div>
            <div className="quiz-item-meta">
                <span>📚 {quiz.subject_name || '—'}</span>
                <span>🗓 {quiz.semester_name || '—'}</span>
                {quiz.time_limit && <span>⏱ {quiz.time_limit} min</span>}
                <span>👥 {quiz.attempt_count || 0} tentative{quiz.attempt_count !== 1 ? 's' : ''}</span>
            </div>

            {!checking && (
                prevAttempt ? (
                    <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', gap: 8 }}>
                        <span className={`quiz-score-chip ${passed ? 'pass' : 'fail'}`}>
                            {passed ? '✓' : '✗'} {percentage}%
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--quiz-text-muted)' }}>
                            Déjà tenté · Recommencer
                        </span>
                    </div>
                ) : (
                    <button className="quiz-btn quiz-btn-primary quiz-btn-sm" style={{ marginTop: 4 }}>
                        ▶ Commencer
                    </button>
                )
            )}
        </div>
    );
}
