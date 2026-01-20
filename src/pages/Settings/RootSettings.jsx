import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../apiConfig';
import ArchiveAdmin from './components/ArchiveAdmin';
import { UserPlus, X, Ban, Mail, Users, Plus, Trash2, UserMinus, Search } from 'lucide-react';
import './RootSettings.css';

const RootSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(user?.role === 'teacher' ? 'archive' : 'users');
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [mailingLists, setMailingLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [listMembers, setListMembers] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [newListForm, setNewListForm] = useState({ name: '', alias: '' });
    const [loading, setLoading] = useState(false);

    // Filter states
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'reports') fetchReports();
        if (activeTab === 'mailing-lists') fetchMailingLists();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/users.php`);
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/reports.php`);
            setReports(res.data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    // Ban Modal State
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUserToBan, setSelectedUserToBan] = useState(null);
    const [banDuration, setBanDuration] = useState('permanent');

    const openBanModal = (user) => {
        setSelectedUserToBan(user);
        setBanDuration('permanent');
        setShowBanModal(true);
    };

    const confirmBan = async () => {
        if (!selectedUserToBan) return;
        try {
            await axios.put(`${API_BASE_URL}/admin/users.php`, {
                id: selectedUserToBan.id,
                action: 'ban',
                duration: banDuration
            });
            fetchUsers();
            setShowBanModal(false);
            setSelectedUserToBan(null);
        } catch (e) {
            alert('Error banning user');
        }
    };

    const handleUnban = async (id) => {
        if (!confirm(`Unban this user?`)) return;
        try {
            await axios.put(`${API_BASE_URL}/admin/users.php`, { id, action: 'unban' });
            fetchUsers();
        } catch (e) {
            alert('Error unbanning user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure? This is irreversible.')) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/users.php?id=${id}`);
            fetchUsers();
        } catch (e) {
            alert('Error deleting user');
        }
    };

    // Teacher Modal State
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [teacherForm, setTeacherForm] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/admin/users.php`, { ...teacherForm, role: 'teacher' });
            fetchUsers();
            setShowTeacherModal(false);
            setTeacherForm({
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: ''
            });
            alert('Compte enseignant créé avec succès');
        } catch (error) {
            console.error('Error creating teacher:', error);
            alert('Erreur lors de la création');
        }
    };

    const handleDismissReport = async (reportId) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/reports.php`, { action: 'dismiss', report_id: reportId });
            fetchReports();
        } catch (e) {
            alert('Error');
        }
    };

    const handleDeleteContent = async (messageId) => {
        if (!confirm('Delete this message and resolve report?')) return;
        try {
            await axios.post(`${API_BASE_URL}/admin/reports.php`, { action: 'delete_message', message_id: messageId });
            fetchReports();
        } catch (e) {
            alert('Error');
        }
    };

    const fetchMailingLists = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/mailing_lists.php`);
            setMailingLists(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/admin/mailing_lists.php`, { ...newListForm });
            setNewListForm({ name: '', alias: '' });
            fetchMailingLists();
        } catch (e) { alert('Error creating list'); }
    };

    const handleDeleteList = async (id) => {
        if (!confirm('Delete this list?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/mailing_lists.php?id=${id}`);
            fetchMailingLists();
        } catch (e) { alert('Error deleting list'); }
    };

    const fetchListMembers = async (list) => {
        setSelectedList(list);
        try {
            const res = await axios.get(`${API_BASE_URL}/admin/mailing_lists.php?id=${list.id}&members=true`);
            setListMembers(res.data);
            setShowListModal(true);
        } catch (e) { alert('Error fetching members'); }
    };

    const handleAddMember = async (email) => {
        if (!email) return;
        try {
            await axios.post(`${API_BASE_URL}/admin/mailing_lists.php`, {
                action: 'add_member',
                list_id: selectedList.id,
                email
            });
            fetchListMembers(selectedList);
        } catch (e) { alert('Error adding member'); }
    };

    const handleRemoveMember = async (email) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/mailing_lists.php`, {
                action: 'remove_member',
                list_id: selectedList.id,
                email
            });
            fetchListMembers(selectedList);
        } catch (e) { alert('Error removing member'); }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1 className="settings-title">Admin Command Center</h1>
                <p className="settings-subtitle">Manage Users, Content, and System Integrity</p>
            </div>

            {/* Ban Modal */}
            {showBanModal && selectedUserToBan && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <button className="modal-close" onClick={() => setShowBanModal(false)}><X size={20} /></button>
                        <h2 style={{ marginBottom: '1rem' }}><Ban className="inline-icon" size={24} /> Bannir {selectedUserToBan.first_name}</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--p-text-dim)' }}>Sélectionnez la durée de la suspension.</p>

                        <div className="form-group">
                            <label>Durée</label>
                            <select
                                value={banDuration}
                                onChange={(e) => setBanDuration(e.target.value)}
                                className="auth-input"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                            >
                                <option value="24h">24 Heures</option>
                                <option value="7d">1 Semaine</option>
                                <option value="30d">1 Mois</option>
                                <option value="permanent">Indéfiniment</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowBanModal(false)} className="action-btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--glass-bg-hover)' }}>Annuler</button>
                            <button onClick={confirmBan} className="action-btn btn-ban" style={{ flex: 1, justifyContent: 'center' }}>Confirmer le Ban</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ban Modal */}
            {showBanModal && selectedUserToBan && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <button className="modal-close" onClick={() => setShowBanModal(false)}><X size={20} /></button>
                        <h2 style={{ marginBottom: '1rem' }}><Ban className="inline-icon" size={24} /> Bannir {selectedUserToBan.first_name}</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--p-text-dim)' }}>Sélectionnez la durée de la suspension.</p>

                        <div className="form-group">
                            <label>Durée</label>
                            <select
                                value={banDuration}
                                onChange={(e) => setBanDuration(e.target.value)}
                                className="auth-input"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                            >
                                <option value="24h">24 Heures</option>
                                <option value="7d">1 Semaine</option>
                                <option value="30d">1 Mois</option>
                                <option value="permanent">Indéfiniment</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowBanModal(false)} className="action-btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--glass-bg-hover)' }}>Annuler</button>
                            <button onClick={confirmBan} className="action-btn btn-ban" style={{ flex: 1, justifyContent: 'center' }}>Confirmer le Ban</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Teacher Modal */}
            {showTeacherModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <button className="modal-close" onClick={() => setShowTeacherModal(false)}><X size={20} /></button>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Nouveau Professeur</h2>
                        <form onSubmit={handleCreateTeacher}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        value={teacherForm.first_name}
                                        onChange={e => setTeacherForm({ ...teacherForm, first_name: e.target.value })}
                                        className="auth-input"
                                        placeholder="ex: Ahmed"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        required
                                        value={teacherForm.last_name}
                                        onChange={e => setTeacherForm({ ...teacherForm, last_name: e.target.value })}
                                        className="auth-input"
                                        placeholder="ex: Diallo"
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    required
                                    value={teacherForm.username}
                                    onChange={e => setTeacherForm({ ...teacherForm, username: e.target.value })}
                                    className="auth-input"
                                    placeholder="ex: prof.diallo"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={teacherForm.email}
                                    onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                                    className="auth-input"
                                    placeholder="Email académique"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={teacherForm.password}
                                    onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                                    className="auth-input"
                                    placeholder="********"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                />
                            </div>
                            <button type="submit" className="action-btn btn-create" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                                Créer le compte
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mailing List Member Modal */}
            {showListModal && selectedList && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card" style={{ maxWidth: '600px', width: '90%' }}>
                        <button className="modal-close" onClick={() => setShowListModal(false)}><X size={20} /></button>
                        <h2 style={{ marginBottom: '1rem' }}><Users className="inline-icon" size={24} /> {selectedList.name}</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--p-text-dim)' }}>Gestion des membres pour {selectedList.alias}</p>

                        <div className="add-member-form" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                            <input
                                id="new-member-email"
                                type="email"
                                placeholder="Email du nouveau membre..."
                                className="auth-input"
                                style={{ flex: 1, padding: '0.8rem', borderRadius: '10px' }}
                            />
                            <button
                                className="action-btn btn-create"
                                onClick={() => {
                                    const input = document.getElementById('new-member-email');
                                    handleAddMember(input.value);
                                    input.value = '';
                                }}
                            >
                                <Plus size={18} /> Ajouter
                            </button>
                        </div>

                        <div className="members-list" style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '10px', background: 'rgba(0,0,0,0.1)' }}>
                            {listMembers.length === 0 ? (
                                <p style={{ padding: '20px', textAlign: 'center', color: 'var(--p-text-dim)' }}>Aucun membre dans cette liste.</p>
                            ) : (
                                listMembers.map(member => (
                                    <div key={member.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{member.username}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--p-text-dim)' }}>{member.email}</div>
                                        </div>
                                        <button className="icon-btn btn-delete" onClick={() => handleRemoveMember(member.email)}>
                                            <UserMinus size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="settings-tabs">
                {user?.role === 'Root' && (
                    <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <i className="fas fa-users"></i> Users Management
                    </button>
                )}
                <button className={`tab-btn ${activeTab === 'archive' ? 'active' : ''}`} onClick={() => setActiveTab('archive')}>
                    <i className="fas fa-archive"></i> Archive Control
                </button>
                <button className={`tab-btn ${activeTab === 'mailing-lists' ? 'active' : ''}`} onClick={() => setActiveTab('mailing-lists')}>
                    <Mail size={18} /> Listes de Diffusion
                </button>
                {user?.role === 'Root' && (
                    <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                        <i className="fas fa-flag"></i> Reports & Safety
                    </button>
                )}
            </div>

            <div className="settings-content">
                {activeTab === 'users' && user?.role === 'Root' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2 className="section-title">All Users</h2>
                            <button className="btn-create" onClick={() => setShowTeacherModal(true)}>
                                <UserPlus size={18} /> New Teacher
                            </button>
                        </div>

                        {/* Search and Filter Row */}
                        <div className="content-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, email ou pseudo..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className="auth-input"
                                    style={{ width: '100%', paddingLeft: '3rem' }}
                                />
                                <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="auth-input"
                                style={{ width: '200px', cursor: 'pointer' }}
                            >
                                <option value="all">Tous les rôles</option>
                                <option value="Root">Root</option>
                                <option value="teacher">Professeurs</option>
                                <option value="user">Étudiants</option>
                            </select>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter(u => {
                                        const matchesSearch = (
                                            (u.first_name + ' ' + u.last_name).toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                            (u.username || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                            (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase())
                                        );
                                        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
                                        return matchesSearch && matchesRole;
                                    })
                                    .map(u => (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ fontWeight: 'bold' }}>{u.first_name} {u.last_name}</div>
                                                <div style={{ fontSize: '0.9em', color: 'var(--p-text-dim)' }}>{u.email}</div>
                                            </td>
                                            <td><span className={`role-badge ${u.role?.toLowerCase()}`}>{u.role}</span></td>
                                            <td>
                                                <span className={`status-badge ${u.is_banned == 1 ? 'banned' : 'active'}`}>
                                                    {u.is_banned == 1 ? 'Banned' : 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                {u.role !== 'Root' && (
                                                    <>
                                                        {u.is_banned == 1 ? (
                                                            <button className="action-btn btn-unban" onClick={() => handleUnban(u.id)}>Unban</button>
                                                        ) : (
                                                            <button className="action-btn btn-ban" onClick={() => openBanModal(u)}>Ban</button>
                                                        )}
                                                        <button className="action-btn btn-delete" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'reports' && user?.role === 'Root' && (
                    <div className="settings-section">
                        <h2 className="section-title">Community Reports</h2>
                        {reports.length === 0 ? <p style={{ padding: '20px', textAlign: 'center' }}>No pending reports. Great job!</p> : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Reported Content</th>
                                        <th>Reason</th>
                                        <th>Reporter</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map(r => (
                                        <tr key={r.id}>
                                            <td style={{ maxWidth: '300px' }}>
                                                <div style={{ fontStyle: 'italic' }}>"{r.message_content}"</div>
                                                <div style={{ fontSize: '0.8em', marginTop: '5px' }}>Author ID: {r.message_author_id}</div>
                                            </td>
                                            <td>{r.reason}</td>
                                            <td>{r.reporter_name}</td>
                                            <td>
                                                {r.status === 'pending' && (
                                                    <>
                                                        <button className="action-btn btn-delete" onClick={() => handleDeleteContent(r.message_id)}>Delete Content</button>
                                                        <button className="action-btn" onClick={() => handleDismissReport(r.id)}>Dismiss</button>
                                                    </>
                                                )}
                                                {r.status !== 'pending' && <span className="status-badge">{r.status}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'mailing-lists' && (
                    <div className="settings-section">
                        <div className="section-header">
                            <h2 className="section-title">Listes de Diffusion</h2>
                        </div>

                        <form onSubmit={handleCreateList} className="new-list-form" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', fontWeight: 600 }}>Nom de la liste</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Département Informatique"
                                    value={newListForm.name}
                                    onChange={e => setNewListForm({ ...newListForm, name: e.target.value })}
                                    className="auth-input"
                                    style={{ width: '100%', padding: '0.8rem' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', fontWeight: 600 }}>Alias Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ex: info@supnum.mr"
                                    value={newListForm.alias}
                                    onChange={e => setNewListForm({ ...newListForm, alias: e.target.value })}
                                    className="auth-input"
                                    style={{ width: '100%', padding: '0.8rem' }}
                                />
                            </div>
                            <button type="submit" className="action-btn btn-create" style={{ alignSelf: 'flex-end', height: '45px' }}>
                                <Plus size={18} /> Créer la liste
                            </button>
                        </form>

                        <div className="lists-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {mailingLists.map(list => (
                                <div key={list.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{list.name}</h3>
                                        <code style={{ fontSize: '0.9rem', color: 'var(--primary-blue)' }}>{list.alias}</code>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <button className="action-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => fetchListMembers(list)}>
                                            <Users size={16} /> Membres
                                        </button>
                                        <button className="action-btn btn-delete" onClick={() => handleDeleteList(list.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'archive' && (
                    <div className="settings-section" style={{ padding: 0, background: 'transparent', boxShadow: 'none', border: 'none' }}>
                        <ArchiveAdmin />
                    </div>
                )}
            </div>
        </div>
    );
};

export default RootSettings;
