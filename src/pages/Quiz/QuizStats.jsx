import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../apiConfig';

export default function QuizStats({ quizId, onClose }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/quiz_stats.php?quiz_id=${quizId}`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [quizId]);

    if (loading) return (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--quiz-text-muted)' }}>
            <div className="quiz-spinner" style={{ margin: '0 auto' }} /> Chargement...
        </div>
    );

    if (!stats) return null;

    return (
        <div style={{
            marginTop: 12,
            padding: 20,
            background: 'rgba(99, 102, 241, 0.04)',
            border: '1px solid var(--quiz-border)',
            borderRadius: 12,
            animation: 'fadeInUp 0.25s ease',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--quiz-primary-light)' }}>Statistiques</h4>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--quiz-text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 20 }}>
                {[
                    { value: stats.participant_count, label: 'Participants' },
                    { value: `${stats.success_rate}%`, label: 'Taux de réussite' },
                    { value: `${stats.avg_percentage}%`, label: 'Score moyen' },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: 'var(--quiz-surface)',
                        border: '1px solid var(--quiz-border)',
                        borderRadius: 8,
                        padding: '12px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--quiz-primary-light)' }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--quiz-text-muted)', marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {stats.question_stats && stats.question_stats.length > 0 && (
                <>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--quiz-text-muted)', marginBottom: 10 }}>
                        RÉUSSITE PAR QUESTION
                    </div>
                    {stats.question_stats.map((q, i) => (
                        <div key={q.id} className="quiz-stats-question-bar">
                            <div className="quiz-stats-question-label" title={q.question_text}>
                                Q{i + 1}. {q.question_text}
                            </div>
                            <div className="quiz-stats-bar-track">
                                <div className="quiz-stats-bar-fill" style={{ width: `${q.correct_rate}%` }} />
                            </div>
                            <div className="quiz-stats-bar-pct">{q.correct_rate}%</div>
                        </div>
                    ))}
                </>
            )}

            {stats.participant_count === 0 && (
                <div style={{ color: 'var(--quiz-text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                    Aucune tentative enregistrée pour ce quiz.
                </div>
            )}
        </div>
    );
}
