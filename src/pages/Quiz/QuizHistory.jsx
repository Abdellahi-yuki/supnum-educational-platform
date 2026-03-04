import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';

export default function QuizHistory() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        fetch(`${API_BASE_URL}/quiz_history.php?user_id=${user.id}`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => { setHistory(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [user]);

    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return dateStr; }
    };

    return (
        <div className="quiz-page">
            <div className="quiz-page-header">
                <div>
                    <h1>📋 Mon Historique</h1>
                    <p className="subtitle">Toutes vos tentatives de quiz</p>
                </div>
                <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>
                    ← Retour aux quiz
                </button>
            </div>

            {loading ? (
                <div className="quiz-loading"><div className="quiz-spinner" /> Chargement...</div>
            ) : history.length === 0 ? (
                <div className="quiz-empty-state">
                    <div className="empty-icon">📭</div>
                    <p>Vous n'avez encore passé aucun quiz.</p>
                    <button className="quiz-btn quiz-btn-primary" onClick={() => navigate('/quiz')}>
                        Découvrir les quiz →
                    </button>
                </div>
            ) : (
                <>
                    {/* Summary stats */}
                    <div className="quiz-stats-row">
                        <div className="quiz-stat-card">
                            <div className="stat-value">{history.length}</div>
                            <div className="stat-label">Tentatives</div>
                        </div>
                        <div className="quiz-stat-card">
                            <div className="stat-value">
                                {history.filter(h => h.percentage >= 50).length}
                            </div>
                            <div className="stat-label">Réussies</div>
                        </div>
                        <div className="quiz-stat-card">
                            <div className="stat-value">
                                {history.length > 0
                                    ? Math.round(history.reduce((s, h) => s + h.percentage, 0) / history.length)
                                    : 0}%
                            </div>
                            <div className="stat-label">Moyenne</div>
                        </div>
                    </div>

                    <div className="quiz-history-grid">
                        {history.map((attempt, i) => {
                            const passed = attempt.percentage >= 50;
                            return (
                                <div key={i} className="quiz-history-item">
                                    <div className={`quiz-history-score-badge ${passed ? 'pass' : 'fail'}`}>
                                        {attempt.percentage}%
                                    </div>
                                    <div className="quiz-history-info">
                                        <div className="quiz-history-title">{attempt.quiz_title}</div>
                                        <div className="quiz-history-meta">
                                            📚 {attempt.subject_name || '—'} &nbsp;·&nbsp;
                                            🗓 {attempt.semester_name || '—'} &nbsp;·&nbsp;
                                            {attempt.score} / {attempt.max_score} pts &nbsp;·&nbsp;
                                            🕐 {formatDate(attempt.submitted_at)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            className="quiz-btn quiz-btn-outline quiz-btn-sm"
                                            onClick={() => navigate(`/quiz/take/${attempt.quiz_id}`)}
                                        >
                                            ↺ Rejouer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
