import React from 'react';

const QuizModal = ({ isOpen, onClose, title, message, onConfirm, confirmText = 'Confirmer', cancelText = 'Annuler', type = 'confirm' }) => {
    if (!isOpen) return null;

    return (
        <div className="quiz-modal-overlay" onClick={onClose}>
            <div className="quiz-modal" onClick={e => e.stopPropagation()}>
                <div className="quiz-modal-header">
                    <div className="quiz-modal-title">{title}</div>
                    <button className="quiz-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="quiz-modal-body" style={{ marginBottom: 24, color: 'var(--quiz-text-muted)', lineHeight: 1.5 }}>
                    {message}
                </div>
                <div className="quiz-modal-actions" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    {type === 'confirm' && (
                        <button className="quiz-btn quiz-btn-outline" onClick={onClose}>
                            {cancelText}
                        </button>
                    )}
                    <button
                        className={`quiz-btn ${type === 'alert' ? 'quiz-btn-primary' : 'quiz-btn-danger'}`}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
