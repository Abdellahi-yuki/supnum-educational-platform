import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuizManager from './QuizManager';
import QuizEditor from './QuizEditor';
import QuizBrowser from './QuizBrowser';
import QuizTaker from './QuizTaker';
import QuizResults from './QuizResults';
import QuizHistory from './QuizHistory';
import './Quiz.css';

export default function Quiz() {
    const { user } = useAuth();
    const isStaff = user?.role === 'Root' || user?.role === 'teacher';

    if (!user) return <Navigate to="/login" replace />;

    return (
        <Routes>
            <Route index element={isStaff ? <QuizManager /> : <QuizBrowser />} />
            <Route path="manage" element={isStaff ? <QuizManager /> : <Navigate to="/quiz" replace />} />
            <Route path="edit/:id" element={isStaff ? <QuizEditor /> : <Navigate to="/quiz" replace />} />
            <Route path="new" element={isStaff ? <QuizEditor /> : <Navigate to="/quiz" replace />} />
            <Route path="take/:id" element={<QuizTaker />} />
            <Route path="results/:attemptId" element={<QuizResults />} />
            <Route path="history" element={<QuizHistory />} />
            <Route path="*" element={<Navigate to="/quiz" replace />} />
        </Routes>
    );
}
