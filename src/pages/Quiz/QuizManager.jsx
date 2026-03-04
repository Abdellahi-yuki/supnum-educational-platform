import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import QuizStats from './QuizStats';
import QuizModal from './QuizModal';

export default function QuizManager() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statsQuizId, setStatsQuizId] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [filterSemester, setFilterSemester] = useState('');
    const [semesters, setSemesters] = useState([]);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const params = filterSemester ? `?semester_id=${filterSemester}` : '';
            const res = await fetch(`${API_BASE_URL}/quiz.php${params}`, { credentials: 'include' });
            const data = await res.json();
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchSemesters = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/archive.php`);
            const data = await res.json();
            setSemesters(data.semestres || []);
        } catch (e) { }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        fetchQuizzes();
    }, [filterSemester]);

    const toggleActive = async (quiz) => {
        try {
            await fetch(`${API_BASE_URL}/quiz.php`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: quiz.id, is_active: quiz.is_active ? 0 : 1 }),
            });
            fetchQuizzes();
        } catch (e) { }
    };

    const handleDelete = (id) => {
        setModal({
            isOpen: true,
            title: 'Supprimer le quiz',
            message: 'Êtes-vous sûr de vouloir supprimer ce quiz définitivement ? Cette action est irréversible.',
            onConfirm: () => {
                fetch(`${API_BASE_URL}/quiz.php?id=${id}`, { method: 'DELETE', credentials: 'include' })
                    .then(() => fetchQuizzes());
            }
        });
    };

    const totalActive = quizzes.filter(q => q.is_active).length;
    const totalAttempts = quizzes.reduce((sum, q) => sum + parseInt(q.attempt_count || 0), 0);

    return (
        <div className="quiz-page">
            <div className="quiz-page-header">
                <div>
                    <h1>Gestion des Quiz</h1>
                    <p className="subtitle">Gérer les quiz par matière et semestre</p>
                </div>
                <button className="quiz-btn quiz-btn-primary" onClick={() => navigate('/quiz/new')}>
                    Nouveau Quiz
                </button>
            </div>

            {/* Stats Row */}
            <div className="quiz-stats-row">
                <div className="quiz-stat-card">
                    <div className="stat-value">{quizzes.length}</div>
                    <div className="stat-label">Total Quiz</div>
                </div>
                <div className="quiz-stat-card">
                    <div className="stat-value">{totalActive}</div>
                    <div className="stat-label">Quiz Actifs</div>
                </div>
                <div className="quiz-stat-card">
                    <div className="stat-value">{totalAttempts}</div>
                    <div className="stat-label">Tentatives</div>
                </div>
            </div>

            {/* Filters */}
            <div className="quiz-browser-filters" style={{ marginBottom: 20 }}>
                <button
                    className={`quiz-filter-btn ${filterSemester === '' ? 'active' : ''}`}
                    onClick={() => setFilterSemester('')}
                >
                    Tous les semestres
                </button>
                {semesters.map(s => (
                    <button
                        key={s.id}
                        className={`quiz-filter-btn ${filterSemester === String(s.id) ? 'active' : ''}`}
                        onClick={() => setFilterSemester(String(s.id))}
                    >
                        {s.nom}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="quiz-loading">
                    <div className="quiz-spinner" />
                    Chargement...
                </div>
            ) : quizzes.length === 0 ? (
                <div className="quiz-empty-state">
                    <p>Aucun quiz pour le moment.</p>
                    <p>Cliquez sur "Nouveau Quiz" pour commencer.</p>
                </div>
            ) : (
                <div className="quiz-table-wrap">
                    <table className="quiz-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Semestre</th>
                                <th>Matière</th>
                                <th>Timer</th>
                                <th>Tentatives</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.id}>
                                    <td style={{ fontWeight: 600 }}>{quiz.title}</td>
                                    <td>{quiz.semester_name || '—'}</td>
                                    <td>{quiz.subject_name || '—'}</td>
                                    <td>{quiz.time_limit ? `${quiz.time_limit} min` : '—'}</td>
                                    <td>{quiz.attempt_count || 0}</td>
                                    <td>
                                        <span className={`quiz-badge ${quiz.is_active ? 'quiz-badge-active' : 'quiz-badge-inactive'}`}>
                                            {quiz.is_active ? '● Actif' : '○ Inactif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            <button
                                                className="quiz-btn quiz-btn-outline quiz-btn-sm"
                                                onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className={`quiz-btn quiz-btn-sm ${quiz.is_active ? 'quiz-btn-danger' : 'quiz-btn-success'}`}
                                                onClick={() => toggleActive(quiz)}
                                            >
                                                {quiz.is_active ? 'Désactiver' : 'Activer'}
                                            </button>
                                            <button
                                                className="quiz-btn quiz-btn-outline quiz-btn-sm"
                                                onClick={() => setStatsQuizId(quiz.id === statsQuizId ? null : quiz.id)}
                                            >
                                                Stats
                                            </button>
                                            <button
                                                className="quiz-btn quiz-btn-danger quiz-btn-sm"
                                                onClick={() => handleDelete(quiz.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        {statsQuizId === quiz.id && (
                                            <QuizStats quizId={quiz.id} onClose={() => setStatsQuizId(null)} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <QuizModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
}
