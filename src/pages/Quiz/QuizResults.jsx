import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function QuizResults() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const results = state?.results;

    if (!results) {
        return (
            <div className="quiz-page">
                <div className="quiz-empty-state">
                    <p>Résultats introuvables.</p>
                    <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>Retour aux quiz</button>
                </div>
            </div>
        );
    }

    const { score, max_score, percentage, results: questionResults } = results;
    const passed = percentage >= 50;

    return (
        <div className="quiz-page">
            <div className="quiz-results-wrap">
                {/* Score ring card */}
                <div className="quiz-score-ring">
                    <div className={`quiz-circle-score ${passed ? 'pass' : 'fail'}`}>
                        <div>{percentage}%</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{score}/{max_score} pts</div>
                    </div>
                    <div className={`quiz-results-title`} style={{ color: passed ? '#34d399' : '#f87171' }}>
                        {passed ? 'Bien joué !' : 'Continuez vos efforts'}
                    </div>
                    <div className="quiz-results-sub">
                        {passed
                            ? `Vous avez réussi avec ${percentage}% de bonne réponses.`
                            : `Vous n'avez pas atteint le seuil de 50%. Révisez et réessayez !`}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                        <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>
                            ← Retour aux quiz
                        </button>
                        <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz/history')}>
                            Mon historique
                        </button>
                    </div>
                </div>

                {/* Detailed correction */}
                {questionResults && questionResults.length > 0 && (
                    <>
                        <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--quiz-primary-light)' }}>
                            Correction détaillée
                        </h3>
                        <div className="quiz-correction-list">
                            {questionResults.map((r, idx) => (
                                <div key={idx} className={`quiz-correction-item ${r.is_correct ? 'correct' : 'wrong'}`}>
                                    <div className="quiz-correction-header">
                                        <div className="quiz-correction-icon">
                                            {r.is_correct ? 'Correct' : 'Incorrect'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div className="quiz-correction-qtext">
                                                Q{idx + 1}. {r.question_text}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--quiz-text-muted)', marginTop: 4 }}>
                                                {r.is_correct ? `+${r.points} point${r.points > 1 ? 's' : ''}` : '0 point'}
                                                {r.is_correct ? ' · Correct' : ' · Incorrect'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options for mcq/true_false */}
                                    {r.question_type !== 'short' && r.options?.map(opt => {
                                        const isCorrect = r.correct_option_ids?.includes(opt.id) || r.correct_option_ids?.includes(String(opt.id));
                                        const wasSubmitted = Array.isArray(r.submitted)
                                            ? r.submitted.includes(opt.id) || r.submitted.includes(String(opt.id))
                                            : r.submitted === opt.id || r.submitted === String(opt.id);

                                        let cls = 'neutral';
                                        if (isCorrect) cls = 'correct-answer';
                                        else if (wasSubmitted && !isCorrect) cls = 'wrong-answer';

                                        return (
                                            <div key={opt.id} className={`quiz-correction-option ${cls}`}>
                                                {isCorrect ? '✓' : wasSubmitted ? '✗' : '○'}
                                                <span>{opt.option_text}</span>
                                                {wasSubmitted && !isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Votre réponse</span>}
                                                {isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>Bonne réponse</span>}
                                            </div>
                                        );
                                    })}

                                    {/* Short answer display */}
                                    {r.question_type === 'short' && r.submitted && (
                                        <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.06)', borderRadius: 8, fontSize: '0.85rem', marginTop: 8 }}>
                                            <strong>Votre réponse :</strong> {r.submitted}
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    {r.explanation && (
                                        <div className="quiz-explanation">
                                            <strong>Explication :</strong> {r.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <button className="quiz-btn quiz-btn-primary" onClick={() => navigate('/quiz')}>
                        ← Retour aux quiz
                    </button>
                </div>
            </div>
        </div>
    );
}
