import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import QuizPreview from './QuizPreview';
import { CODE_LANGUAGES } from './CodeBlock';
import QuizModal from './QuizModal';

const EMPTY_OPTION = () => ({ option_text: '', is_correct: false });
const EMPTY_QUESTION = () => ({
    question_text: '',
    question_type: 'mcq',
    points: 1,
    explanation: '',
    code_snippet: '',
    code_language: 'python',
    options: [EMPTY_OPTION(), EMPTY_OPTION()],
});

export default function QuizEditor() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: '',
        description: '',
        subject_id: '',
        semester_id: '',
        is_active: 0,
        time_limit: '',
    });
    const [questions, setQuestions] = useState([EMPTY_QUESTION()]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'alert' });
    const [loading, setLoading] = useState(isEdit);

    // Load archive for semester/subject selectors
    useEffect(() => {
        fetch(`${API_BASE_URL}/archive.php`)
            .then(r => r.json())
            .then(data => {
                setSemesters(data.semestres || []);
                setSubjects(data.matieres || []);
            });
    }, []);

    // When semester changes, filter subjects
    useEffect(() => {
        if (form.semester_id) {
            setFilteredSubjects(subjects.filter(s => String(s.id_semestre) === String(form.semester_id)));
        } else {
            setFilteredSubjects([]);
        }
    }, [form.semester_id, subjects]);

    // Load existing quiz for edit
    useEffect(() => {
        if (!isEdit) return;
        fetch(`${API_BASE_URL}/quiz.php?id=${id}`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                setForm({
                    title: data.title || '',
                    description: data.description || '',
                    subject_id: String(data.subject_id || ''),
                    semester_id: String(data.semester_id || ''),
                    is_active: data.is_active || 0,
                    time_limit: data.time_limit || '',
                });
                if (data.questions && data.questions.length > 0) {
                    setQuestions(data.questions.map(q => ({
                        question_text: q.question_text,
                        question_type: q.question_type,
                        points: q.points,
                        explanation: q.explanation || '',
                        code_snippet: q.code_snippet || '',
                        code_language: q.code_language || 'python',
                        options: q.options && q.options.length > 0
                            ? q.options.map(o => ({ option_text: o.option_text, is_correct: !!parseInt(o.is_correct) }))
                            : [EMPTY_OPTION(), EMPTY_OPTION()],
                    })));
                }
                setLoading(false);
            });
    }, [id]);

    const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

    // Question helpers
    const addQuestion = () => setQuestions(qs => [...qs, EMPTY_QUESTION()]);
    const removeQuestion = (idx) => setQuestions(qs => qs.filter((_, i) => i !== idx));
    const updateQuestion = (idx, key, val) =>
        setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [key]: val } : q));

    const setOptionType = (idx, type) => {
        let newOptions = type === 'true_false'
            ? [{ option_text: 'Vrai', is_correct: true }, { option_text: 'Faux', is_correct: false }]
            : (type === 'short' ? [] : [EMPTY_OPTION(), EMPTY_OPTION()]);
        setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, question_type: type, options: newOptions } : q));
    };

    const addOption = (qIdx) =>
        setQuestions(qs => qs.map((q, i) => i === qIdx ? { ...q, options: [...q.options, EMPTY_OPTION()] } : q));

    const removeOption = (qIdx, oIdx) =>
        setQuestions(qs => qs.map((q, i) =>
            i === qIdx ? { ...q, options: q.options.filter((_, j) => j !== oIdx) } : q
        ));

    const updateOption = (qIdx, oIdx, key, val) =>
        setQuestions(qs => qs.map((q, i) =>
            i === qIdx
                ? {
                    ...q,
                    options: q.options.map((o, j) => {
                        // For radio-type questions: selecting one correct answer deselects others
                        if (key === 'is_correct' && q.question_type !== 'mcq') {
                            return j === oIdx ? { ...o, is_correct: val } : { ...o, is_correct: false };
                        }
                        // For mcq or text changes: update only the target option
                        return j === oIdx ? { ...o, [key]: val } : o;
                    })
                }
                : q
        ));

    const handleSave = async () => {
        if (!form.title || !form.subject_id || !form.semester_id) {
            setModal({ isOpen: true, title: 'Incomplet', message: 'Titre, semestre et matière sont requis.', type: 'alert' });
            return;
        }
        setSaving(true);
        try {
            let quizId = id;
            if (isEdit) {
                await fetch(`${API_BASE_URL}/quiz.php`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...form, id: parseInt(id) }),
                });
            } else {
                const res = await fetch(`${API_BASE_URL}/quiz.php`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...form, created_by: user.id }),
                });
                const data = await res.json();
                quizId = data.id;
            }

            // Save questions
            await fetch(`${API_BASE_URL}/quiz_questions.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quiz_id: parseInt(quizId), questions }),
            });

            navigate('/quiz');
        } catch (e) {
            console.error(e);
            setModal({ isOpen: true, title: 'Erreur', message: 'Erreur lors de la sauvegarde.', type: 'alert' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="quiz-loading"><div className="quiz-spinner" /> Chargement du quiz...</div>;
    }

    return (
        <div className="quiz-page">
            {showPreview && (
                <QuizPreview
                    quiz={{ ...form, questions }}
                    semesters={semesters}
                    subjects={subjects}
                    onClose={() => setShowPreview(false)}
                />
            )}

            <div className="quiz-page-header">
                <div>
                    <h1>{isEdit ? 'Modifier le Quiz' : 'Nouveau Quiz'}</h1>
                    <p className="subtitle">Configurez le quiz et ajoutez les questions</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="quiz-btn quiz-btn-outline" onClick={() => setShowPreview(true)}>
                        Prévisualiser
                    </button>
                    <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>
                        Retour
                    </button>
                    <button className="quiz-btn quiz-btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>

            {/* Quiz Info */}
            <div className="quiz-card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 20, fontWeight: 700, color: 'var(--quiz-primary-light)' }}>
                    Informations du quiz
                </h3>
                <div className="quiz-form-row">
                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Titre du quiz *</label>
                        <input
                            className="quiz-input"
                            value={form.title}
                            onChange={e => setField('title', e.target.value)}
                            placeholder="Ex: Contrôle de connaissances — Algorithmique"
                        />
                    </div>
                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Durée (minutes, optionnel)</label>
                        <input
                            className="quiz-input"
                            type="number"
                            min="0"
                            value={form.time_limit}
                            onChange={e => setField('time_limit', e.target.value)}
                            placeholder="Ex: 30"
                        />
                    </div>
                </div>
                <div className="quiz-form-group">
                    <label className="quiz-form-label">Description</label>
                    <textarea
                        className="quiz-textarea"
                        value={form.description}
                        onChange={e => setField('description', e.target.value)}
                        placeholder="Description optionnelle du quiz..."
                    />
                </div>
                <div className="quiz-form-row">
                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Semestre *</label>
                        <select
                            className="quiz-select"
                            value={form.semester_id}
                            onChange={e => { setField('semester_id', e.target.value); setField('subject_id', ''); }}
                        >
                            <option value="">Choisir un semestre</option>
                            {semesters.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Matière *</label>
                        <select
                            className="quiz-select"
                            value={form.subject_id}
                            onChange={e => setField('subject_id', e.target.value)}
                            disabled={!form.semester_id}
                        >
                            <option value="">Choisir une matière</option>
                            {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                </div>
                <div className="quiz-form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                        type="checkbox"
                        id="quiz-active"
                        checked={!!form.is_active}
                        onChange={e => setField('is_active', e.target.checked ? 1 : 0)}
                        style={{ width: 18, height: 18, accentColor: 'var(--quiz-primary)' }}
                    />
                    <label htmlFor="quiz-active" style={{ fontWeight: 500, color: 'var(--quiz-text)', cursor: 'pointer' }}>
                        Activer le quiz immédiatement (visible par les étudiants)
                    </label>
                </div>
            </div>

            {/* Questions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--quiz-primary-light)' }}>
                    Questions ({questions.length})
                </h3>
                <button className="quiz-btn quiz-btn-outline" onClick={addQuestion}>
                    Ajouter une question
                </button>
            </div>

            {questions.map((q, qIdx) => (
                <div key={qIdx} className="quiz-question-card">
                    <div className="quiz-question-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="quiz-question-number">{qIdx + 1}</span>
                            <select
                                className="quiz-select"
                                value={q.question_type}
                                onChange={e => setOptionType(qIdx, e.target.value)}
                                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                                <option value="mcq">QCM (choix multiple)</option>
                                <option value="true_false">Vrai / Faux</option>
                                <option value="short">Réponse courte</option>
                            </select>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--quiz-text-muted)' }}>Points:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={q.points}
                                    onChange={e => updateQuestion(qIdx, 'points', parseInt(e.target.value) || 1)}
                                    className="quiz-input"
                                    style={{ width: 60, padding: '6px 10px', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>
                        <button
                            className="quiz-btn quiz-btn-danger quiz-btn-sm"
                            onClick={() => removeQuestion(qIdx)}
                            disabled={questions.length === 1}
                        >
                            Supprimer
                        </button>
                    </div>

                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Énoncé de la question</label>
                        <textarea
                            className="quiz-textarea"
                            value={q.question_text}
                            onChange={e => updateQuestion(qIdx, 'question_text', e.target.value)}
                            placeholder="Entrez la question..."
                            style={{ minHeight: 60 }}
                        />
                    </div>

                    {/* Options */}
                    {q.question_type !== 'short' && (
                        <div className="quiz-form-group">
                            <label className="quiz-form-label">
                                Options de réponse
                                {q.question_type === 'mcq'
                                    ? ' (cochez toutes les bonnes réponses)'
                                    : ' (sélectionnez la bonne réponse)'}
                            </label>
                            {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="quiz-option-row">
                                    <input
                                        type={q.question_type === 'mcq' ? 'checkbox' : 'radio'}
                                        className="quiz-option-checkbox"
                                        checked={opt.is_correct}
                                        onChange={e => updateOption(qIdx, oIdx, 'is_correct', e.target.checked)}
                                        name={`q${qIdx}-correct`}
                                        title="Marquer comme bonne réponse"
                                    />
                                    <input
                                        className="quiz-option-input"
                                        value={opt.option_text}
                                        onChange={e => updateOption(qIdx, oIdx, 'option_text', e.target.value)}
                                        placeholder={`Option ${oIdx + 1}`}
                                        disabled={q.question_type === 'true_false'}
                                    />
                                    {q.question_type === 'mcq' && (
                                        <button
                                            className="quiz-option-remove"
                                            onClick={() => removeOption(qIdx, oIdx)}
                                            disabled={q.options.length <= 2}
                                            title="Supprimer l'option"
                                        >
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            ))}
                            {q.question_type === 'mcq' && (
                                <button className="quiz-add-option-btn" onClick={() => addOption(qIdx)}>
                                    Ajouter une option
                                </button>
                            )}
                        </div>
                    )}

                    {q.question_type === 'short' && (
                        <div style={{ padding: '12px 16px', background: 'rgba(99,102,241,0.06)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--quiz-text-muted)' }}>
                            Les réponses courtes seront stockées textuellement pour relecture manuelle.
                        </div>
                    )}

                    <div className="quiz-form-group" style={{ marginBottom: 0, marginTop: 12 }}>
                        <label className="quiz-form-label">Explication / Feedback pédagogique (optionnel)</label>
                        <input
                            className="quiz-input"
                            value={q.explanation}
                            onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                            placeholder="Explication affichée après soumission..."
                        />
                    </div>

                    {/* Code snippet */}
                    <div style={{ marginTop: 12 }}>
                        <button
                            type="button"
                            className={`cq-code-toggle-btn ${q.code_snippet !== '' ? 'active' : ''}`}
                            onClick={() => updateQuestion(qIdx, 'code_snippet', q.code_snippet === '' ? ' ' : '')}
                        >
                            {q.code_snippet !== '' ? 'Modifier le code' : 'Ajouter un extrait de code'}
                        </button>

                        {q.code_snippet !== '' && (
                            <div className="cq-code-editor-wrap">
                                <div className="cq-code-editor-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span className="cq-code-dot" />
                                        <span className="cq-code-dot" style={{ opacity: 0.6 }} />
                                        <span className="cq-code-dot" style={{ opacity: 0.3 }} />
                                        <span className="cq-code-lang-name">Langage</span>
                                    </div>
                                    <select
                                        className="cq-lang-select"
                                        value={q.code_language || 'python'}
                                        onChange={e => updateQuestion(qIdx, 'code_language', e.target.value)}
                                    >
                                        {CODE_LANGUAGES.filter(l => l.value).map(l => (
                                            <option key={l.value} value={l.value}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    className="cq-code-textarea"
                                    value={q.code_snippet.trim() ? q.code_snippet : ''}
                                    onChange={e => updateQuestion(qIdx, 'code_snippet', e.target.value)}
                                    placeholder={`# Collez votre code ${q.code_language || 'python'} ici...\ndef exemple():\n    pass`}
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button className="quiz-btn quiz-btn-outline" onClick={addQuestion}>
                    Ajouter une question
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
                <button className="quiz-btn quiz-btn-outline" onClick={() => navigate('/quiz')}>
                    Annuler
                </button>
                <button className="quiz-btn quiz-btn-outline" onClick={() => setShowPreview(true)}>
                    Prévisualiser
                </button>
                <button className="quiz-btn quiz-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder le quiz'}
                </button>
            </div>

            <QuizModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}
