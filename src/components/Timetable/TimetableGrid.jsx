import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, MapPin, User, X, Check } from 'lucide-react';
import { API_BASE_URL } from '../../apiConfig';
import './TimetableGrid.css';

const TimetableGrid = ({ entries = [], level, semester, group, user, onRefresh }) => {
    const [editingEntry, setEditingEntry] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        day: '',
        start_time: '',
        end_time: '',
        subject: '',
        teacher_name: '',
        classroom: '',
        week_number: 0
    });

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const timeSlots = [
        { start: '08:30', end: '09:45' },
        { start: '09:50', end: '11:15' },
        { start: '11:30', end: '13:00' },
        { start: '15:00', end: '16:30' },
        { start: '17:00', end: '18:30' }
    ];

    const canEdit = user?.role === 'Root' || user?.role === 'teacher';

    const handleAdd = (day, slot) => {
        if (!canEdit) return;
        setEditingEntry(null);
        setFormData({
            day,
            start_time: slot.start,
            end_time: slot.end,
            subject: '',
            teacher_name: '',
            classroom: '',
            week_number: 0
        });
        setIsModalOpen(true);
    };

    const handleEdit = (entry) => {
        if (!canEdit) return;
        setEditingEntry(entry);
        setFormData({
            day: entry.day,
            start_time: entry.start_time.substring(0, 5),
            end_time: entry.end_time.substring(0, 5),
            subject: entry.subject,
            teacher_name: entry.teacher_name,
            classroom: entry.classroom,
            week_number: entry.week_number || 0
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce cours ?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/timetable.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_id: user.id })
            });
            if (response.ok) onRefresh();
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            level,
            semester,
            group_name: group,   // ← pass current group
            user_id: user.id,
            id: editingEntry?.id
        };

        try {
            const response = await fetch(`${API_BASE_URL}/timetable.php`, {
                method: editingEntry ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setIsModalOpen(false);
                onRefresh();
            }
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    const getEntry = (day, startTime) => {
        if (!Array.isArray(entries)) return null;
        return entries.find(e => e.day === day && e.start_time.startsWith(startTime));
    };

    return (
        <div className="timetable-grid-wrapper">
            {/* Group label */}
            <div className="group-label-bar">
                <span className="group-badge">Groupe : {group}</span>
            </div>

            <table className="timetable-table">
                <thead>
                    <tr>
                        <th>Horaires</th>
                        {days.map(day => <th key={day}>{day}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((slot, index) => (
                        <tr key={index}>
                            <td className="time-col">
                                <div className="time-range">
                                    <span className="start">{slot.start}</span>
                                    <span className="separator"></span>
                                    <span className="end">{slot.end}</span>
                                </div>
                            </td>
                            {days.map(day => {
                                const entry = getEntry(day, slot.start);
                                return (
                                    <td key={day} className="slot-cell">
                                        {entry ? (
                                            <div className="course-card">
                                                <div className="course-header">
                                                    <span className="course-subject">{entry.subject}</span>
                                                    {canEdit && (
                                                        <div className="course-actions">
                                                            <button onClick={() => handleEdit(entry)} className="edit-btn"><Edit2 size={12} /></button>
                                                            <button onClick={() => handleDelete(entry.id)} className="delete-btn"><Trash2 size={12} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="course-info">
                                                    <div className="info-item"><User size={12} /> <span>{entry.teacher_name}</span></div>
                                                    <div className="info-item"><MapPin size={12} /> <span>{entry.classroom}</span></div>
                                                </div>
                                            </div>
                                        ) : (
                                            canEdit && (
                                                <button className="add-slot-btn" onClick={() => handleAdd(day, slot)}>
                                                    <Plus size={20} />
                                                </button>
                                            )
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <div className="modal-header">
                            <h2>{editingEntry ? 'Modifier le cours' : 'Ajouter un cours'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* Group indicator (readonly) */}
                            <div className="form-group">
                                <label>Groupe</label>
                                <input type="text" value={group} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                            </div>

                            <div className="form-group">
                                <label>Matière</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    placeholder="Ex: Algorithmique"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Enseignant</label>
                                    <input
                                        type="text"
                                        value={formData.teacher_name}
                                        onChange={e => setFormData({ ...formData, teacher_name: e.target.value })}
                                        placeholder="Nom du prof"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Salle</label>
                                    <input
                                        type="text"
                                        value={formData.classroom}
                                        onChange={e => setFormData({ ...formData, classroom: e.target.value })}
                                        placeholder="Ex: Salle 102"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Jour</label>
                                    <select value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })}>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Début</label>
                                    <input type="time" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Fin</label>
                                    <input type="time" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Semaine (0 = Toutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={formData.week_number}
                                    onChange={e => setFormData({ ...formData, week_number: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Annuler</button>
                                <button type="submit" className="save-btn"><Check size={20} /> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableGrid;
