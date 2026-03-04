import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

export default function QuizPreview({ quiz, semesters, subjects, onClose }) {
    const [current, setCurrent] = useState(0);
    const questions = quiz.questions || [];
    const q = questions[current];

    const semName = semesters.find(s => String(s.id) === String(quiz.semester_id))?.nom || '';
    const subName = subjects.find(s => String(s.id) === String(quiz.subject_id))?.nom || '';

    return (
        <div className="quiz-modal-overlay" onClick={onClose}>
            <div className="quiz-modal" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
                <div className="quiz-modal-header">
                    <div>
                        <div className="quiz-modal-title">👁 Prévisualisation — {quiz.title || 'Quiz sans titre'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--quiz-text-muted)', marginTop: 4 }}>
                            {semName && subName ? `${semName} · ${subName}` : 'Aucune matière sélectionnée'}
                            {quiz.time_limit ? ` · ⏱ ${quiz.time_limit} min` : ''}
                        </div>
                    </div>
                    <button className="quiz-modal-close" onClick={onClose}>✕</button>
                </div>

                {questions.length === 0 ? (
                    <div className="quiz-empty-state">
                        <div className="empty-icon">❓</div>
                        <p>Aucune question ajoutée.</p>
                    </div>
                ) : (
                    <>
                        {/* Progress */}
                        <div className="quiz-progress-bar-wrap">
                            <div
                                className="quiz-progress-bar"
                                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--quiz-text-muted)', marginBottom: 16 }}>
                            Question {current + 1} / {questions.length}
                        </div>

                        <div className="quiz-question-block" style={{ animation: 'none' }}>
                            <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                                <span className="quiz-badge quiz-badge-inactive" style={{ textTransform: 'capitalize' }}>
                                    {q.question_type === 'mcq' ? 'QCM' : q.question_type === 'true_false' ? 'Vrai/Faux' : 'Réponse courte'}
                                </span>
                                <span className="quiz-badge quiz-badge-inactive">{q.points || 1} pt{q.points > 1 ? 's' : ''}</span>
                            </div>
                            <div className="quiz-question-text">{q.question_text || <em style={{ color: 'var(--quiz-text-muted)' }}>Énoncé vide</em>}</div>

                            {/* Code snippet */}
                            {q.code_snippet && q.code_snippet.trim() && (
                                <CodeBlock code={q.code_snippet} language={q.code_language} />
                            )}

                            {q.question_type !== 'short' && q.options?.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="quiz-option-choice" style={{ cursor: 'default' }}>
                                            <div className="quiz-option-radio"></div>
                                            <span>{opt.option_text || <em>Option vide</em>}</span>
                                            {opt.is_correct && (
                                                <span style={{ marginLeft: 'auto', color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                                                    ✓ Bonne réponse
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {q.question_type === 'short' && (
                                <div style={{ marginTop: 16 }}>
                                    <input
                                        className="quiz-input"
                                        placeholder="L'étudiant écrira sa réponse ici..."
                                        disabled
                                        style={{ opacity: 0.5 }}
                                    />
                                </div>
                            )}

                            {q.explanation && (
                                <div className="quiz-explanation" style={{ marginTop: 16 }}>
                                    <strong>💡 Explication :</strong> {q.explanation}
                                </div>
                            )}
                        </div>

                        <div className="quiz-taker-actions">
                            <button
                                className="quiz-btn quiz-btn-outline"
                                onClick={() => setCurrent(c => c - 1)}
                                disabled={current === 0}
                            >
                                ← Précédent
                            </button>
                            <span style={{ color: 'var(--quiz-text-muted)', fontSize: '0.85rem' }}>
                                {questions.length} question{questions.length > 1 ? 's' : ''} au total
                            </span>
                            <button
                                className="quiz-btn quiz-btn-primary"
                                onClick={() => setCurrent(c => c + 1)}
                                disabled={current === questions.length - 1}
                            >
                                Suivant →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
