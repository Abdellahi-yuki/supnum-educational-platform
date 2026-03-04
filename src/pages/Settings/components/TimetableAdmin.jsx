import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../apiConfig';
import { useAuth } from '../../../context/AuthContext';
import TimetableGrid from '../../../components/Timetable/TimetableGrid';
import './TimetableAdmin.css';

const TimetableAdmin = () => {
    const { user } = useAuth();
    const [level, setLevel] = useState('L1');
    const [semester, setSemester] = useState(1);
    const [week, setWeek] = useState(0);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    const levels = ['L1', 'L2', 'L3'];
    const semesters = level === 'L1' ? [1, 2] : level === 'L2' ? [3, 4] : [5, 6];
    const weeks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/timetable.php?level=${level}&semester=${semester}&week=${week}`);
            const data = await response.json();
            setEntries(data);
        } catch (error) {
            console.error('Error fetching timetable:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!semesters.includes(semester)) {
            setSemester(semesters[0]);
        }
    }, [level]);

    useEffect(() => {
        fetchTimetable();
    }, [level, semester, week]);

    return (
        <div className="timetable-admin">
            <div className="admin-controls glass-card">
                <div className="control-group">
                    <h3>Niveau</h3>
                    <div className="mini-tabs">
                        {levels.map(l => (
                            <button
                                key={l}
                                className={`mini-tab ${level === l ? 'active' : ''}`}
                                onClick={() => setLevel(l)}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="control-group">
                    <h3>Semestre</h3>
                    <div className="mini-tabs">
                        {semesters.map(s => (
                            <button
                                key={s}
                                className={`mini-tab ${semester === s ? 'active' : ''}`}
                                onClick={() => setSemester(s)}
                            >
                                S{s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="control-group">
                    <h3>Semaine</h3>
                    <select className="mini-select" value={week} onChange={e => setWeek(parseInt(e.target.value))}>
                        {weeks.map(w => (
                            <option key={w} value={w}>
                                {w === 0 ? 'Toutes' : `Semaine ${w}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-grid-container glass-card">
                {loading ? (
                    <div className="loading-spinner">Mise à jour du planning...</div>
                ) : (
                    <TimetableGrid
                        entries={entries}
                        level={level}
                        semester={semester}
                        user={user}
                        onRefresh={fetchTimetable}
                    />
                )}
            </div>
        </div>
    );
};

export default TimetableAdmin;
