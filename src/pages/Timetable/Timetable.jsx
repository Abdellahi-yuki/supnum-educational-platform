import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import TimetableGrid from '../../components/Timetable/TimetableGrid';
import './Timetable.css';

// Groups definition per level
const GROUPS = {
    L1: ['G1', 'G2', 'G3', 'G4'],
    L2: ['G1 - RSS', 'G2 - DSI', 'G3 - DSI', 'G4 - DWM'],
    L3: ['G1 - RSS', 'G2 - DSI', 'G3 - DSI', 'G4 - DWM'],
};

const Timetable = () => {
    const { user } = useAuth();
    const [level, setLevel] = useState('L1');
    const [semester, setSemester] = useState(1);
    const [group, setGroup] = useState('G1');
    const [week, setWeek] = useState(0);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    const levels = ['L1', 'L2', 'L3'];
    const semesters = level === 'L1' ? [1, 2] : level === 'L2' ? [3, 4] : [5, 6];
    const weeks = Array.from({ length: 21 }, (_, i) => i); // 0..20

    const getCurrentInfo = () => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDays = (now - startOfYear) / 86400000;
        const currentWeek = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
        return { formattedDate, currentWeek };
    };

    const { formattedDate, currentWeek } = getCurrentInfo();

    // When level changes → reset to first semester and first group
    useEffect(() => {
        if (!semesters.includes(semester)) setSemester(semesters[0]);
        setGroup(GROUPS[level][0]);
    }, [level]);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const url = `${API_BASE_URL}/timetable.php?level=${level}&semester=${semester}&week=${week}&group=${encodeURIComponent(group)}`;
            const response = await fetch(url);
            const data = await response.json();
            if (Array.isArray(data)) {
                setEntries(data);
            } else {
                console.error('Expected array of timetable entries, got:', data);
                setEntries([]);
            }
        } catch (error) {
            console.error('Error fetching timetable:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetable();
    }, [level, semester, group, week]);

    return (
        <div className="timetable-page">
            <div className="timetable-header">
                <h1>Emploi du temps</h1>
                <p className="date-display">{formattedDate} — Semaine {currentWeek}</p>
                <p>Gérez et visualisez vos horaires de cours pour l'année universitaire.</p>
            </div>

            <div className="timetable-controls glass-card">
                {/* ── Niveau ── */}
                <div className="level-tabs">
                    {levels.map(l => (
                        <button
                            key={l}
                            className={`tab-btn ${level === l ? 'active' : ''}`}
                            onClick={() => setLevel(l)}
                        >
                            {l}
                        </button>
                    ))}
                </div>

                {/* ── Groupe ── */}
                <div className="group-tabs">
                    {GROUPS[level].map(g => (
                        <button
                            key={g}
                            className={`group-btn ${group === g ? 'active' : ''}`}
                            onClick={() => setGroup(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>

                {/* ── Semestre ── */}
                <div className="semester-tabs">
                    {semesters.map(s => (
                        <button
                            key={s}
                            className={`semester-btn ${semester === s ? 'active' : ''}`}
                            onClick={() => setSemester(s)}
                        >
                            Semestre {s}
                        </button>
                    ))}
                </div>

                {/* ── Semaine ── */}
                <div className="week-selector">
                    <span className="selector-label">Semaine:</span>
                    <select className="week-dropdown" value={week} onChange={e => setWeek(parseInt(e.target.value))}>
                        {weeks.map(w => (
                            <option key={w} value={w}>
                                {w === 0 ? 'Toutes les semaines' : `Semaine ${w}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="timetable-container glass-card">
                {loading ? (
                    <div className="loading-spinner">Chargement en cours…</div>
                ) : (
                    <TimetableGrid
                        entries={entries}
                        level={level}
                        semester={semester}
                        group={group}
                        user={user}
                        onRefresh={fetchTimetable}
                    />
                )}
            </div>
        </div>
    );
};

export default Timetable;
