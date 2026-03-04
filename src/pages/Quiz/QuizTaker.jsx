import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import CodeBlock from './CodeBlock';
import QuizModal from './QuizModal';

export default function QuizTaker() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({}); // { question_id: value }
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const timerRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/quiz.php?id=${id}`)
            .then(r => r.json())
            .then(data => {
                setQuiz(data);
                if (data.time_limit) {
                    setTimeLeft(data.time_limit * 60);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleSubmit = useCallback(async (autoSubmit = false) => {
        if (submitting) return;
        setSubmitting(true);
        if (timerRef.current) clearInterval(timerRef.current);

        try {
            const res = await fetch(`${API_BASE_URL}/quiz_attempt.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quiz_id: parseInt(id), user_id: user.id, answers }),
            });
            const data = await res.json();
            navigate(`/quiz/results/${data.attempt_id}`, { state: { results: data } });
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    }, [submitting, answers, id, user, navigate]);

    const handleConfirmSubmit = () => {
        setModal({
            isOpen: true,
            title: 'Terminer le quiz',
            message: 'Soumettre le quiz ? Vous ne pourrez plus modifier vos réponses.',
            onConfirm: () => handleSubmit(true)
        });
    };

    // Timer
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) { handleSubmit(true); return; }
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [timeLeft !== null && timeLeft === quiz?.time_limit * 60]); // only start once

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const setAnswer = (questionId, type, optionId) => {
        setAnswers(prev => {
            if (type === 'mcq') {
                const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
                const has = current.includes(optionId);
                return { ...prev, [questionId]: has ? current.filter(x => x !== optionId) : [...current, optionId] };
            } else {
                return { ...prev, [questionId]: [optionId] };
            }
        });
    };

    const setShortAnswer = (questionId, text) => {
        setAnswers(prev => ({ ...prev, [questionId]: text }));
    };

    if (loading) return <div className="quiz-loading"><div className="quiz-spinner" /> Chargement du quiz...</div>;
    if (!quiz) return <div className="quiz-loading">Quiz introuvable.</div>;
    if (!quiz.is_active) return (
        <div className="quiz-page">
            <div className="quiz-empty-state">
                <p>Ce quiz n'est pas encore disponible.</p>
                <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>Retour</button>
            </div>
        </div>
    );

    const questions = quiz.questions || [];
    const q = questions[current];
    const answeredCount = Object.keys(answers).filter(k => {
        const a = answers[k];
        return Array.isArray(a) ? a.length > 0 : (a !== '' && a !== null && a !== undefined);
    }).length;

    const isAnswered = (qId) => {
        const a = answers[qId];
        return Array.isArray(a) ? a.length > 0 : (typeof a === 'string' ? a.trim() !== '' : false);
    };

    const selectedOptions = Array.isArray(answers[q?.id]) ? answers[q.id] : (answers[q?.id] ? [answers[q.id]] : []);

    return (
        <div className="quiz-page">
            <div className="quiz-taker-wrap">
                {/* Header */}
                <div className="quiz-page-header">
                    <div>
                        <h1 style={{ fontSize: '1.35rem' }}>{quiz.title}</h1>
                        <div className="subtitle">{quiz.subject_name} · {quiz.semester_name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {timeLeft !== null && (
                            <div className={`quiz-timer ${timeLeft <= 60 ? 'urgent' : ''}`}>
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        <button className="quiz-btn quiz-btn-outline quiz-btn-sm" onClick={() => navigate('/quiz')}>Quitter</button>
                    </div>
                </div>

                {/* Progress */}
                <div className="quiz-progress-bar-wrap">
                    <div className="quiz-progress-bar" style={{ width: `${((answeredCount) / questions.length) * 100}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.8rem', color: 'var(--quiz-text-muted)' }}>
                    <span>{answeredCount} / {questions.length} répondu{answeredCount > 1 ? 's' : ''}</span>
                    <span>Question {current + 1} / {questions.length}</span>
                </div>

                {/* Question navigation dots */}
                <div className="quiz-question-nav">
                    {questions.map((ques, idx) => (
                        <button
                            key={idx}
                            className={`quiz-q-dot ${idx === current ? 'current' : ''} ${isAnswered(ques.id) ? 'answered' : ''}`}
                            onClick={() => setCurrent(idx)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Question block */}
                {q && (
                    <div className="quiz-question-block" key={q.id}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            <span className="quiz-badge quiz-badge-inactive">
                                {q.question_type === 'mcq' ? 'Choix multiple' : q.question_type === 'true_false' ? 'Vrai / Faux' : 'Réponse courte'}
                            </span>
                            <span className="quiz-badge quiz-badge-inactive">{q.points} pt{q.points > 1 ? 's' : ''}</span>
                        </div>
                        <div className="quiz-question-text">{q.question_text}</div>

                        {/* Code snippet if present */}
                        {q.code_snippet && q.code_snippet.trim() && (
                            <CodeBlock code={q.code_snippet} language={q.code_language} />
                        )}

                        {/* MCQ / True-False options */}
                        {q.question_type !== 'short' && (
                            <div style={{ marginTop: 20 }}>
                                {q.options?.map(opt => {
                                    const sel = selectedOptions.includes(opt.id) || selectedOptions.includes(String(opt.id));
                                    return (
                                        <div
                                            key={opt.id}
                                            className={`quiz-option-choice ${sel ? 'selected' : ''}`}
                                            onClick={() => setAnswer(q.id, q.question_type, opt.id)}
                                        >
                                            <div className="quiz-option-radio">
                                                {sel && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
                                            </div>
                                            <span>{opt.option_text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Short answer */}
                        {q.question_type === 'short' && (
                            <textarea
                                className="quiz-textarea"
                                style={{ marginTop: 20 }}
                                value={answers[q.id] || ''}
                                onChange={e => setShortAnswer(q.id, e.target.value)}
                                placeholder="Écrivez votre réponse ici..."
                                rows={4}
                            />
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="quiz-taker-actions">
                    <button
                        className="quiz-btn quiz-btn-outline"
                        onClick={() => setCurrent(c => c - 1)}
                        disabled={current === 0}
                    >
                        ← Précédent
                    </button>

                    {current < questions.length - 1 ? (
                        <button
                            className="quiz-btn quiz-btn-primary"
                            onClick={() => setCurrent(c => c + 1)}
                        >
                            Suivant →
                        </button>
                    ) : (
                        <button
                            className="quiz-btn quiz-btn-success"
                            onClick={handleConfirmSubmit}
                            disabled={submitting}
                        >
                            {submitting ? 'Soumission...' : 'Soumettre le quiz'}
                        </button>
                    )}
                </div>
            </div>

            <QuizModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
            />
        </div>
    );
};
