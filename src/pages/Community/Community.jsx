import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
    MessageSquare,
    Users,
    Heart,
    Share2,
    Send,
    Image as ImageIcon,
    Paperclip,
    MoreVertical,
    Trash2,
    Bookmark,
    BookmarkCheck,
    Loader2,
    Menu,
    X,
    Shield,
    CheckCircle,
    Plus,
    User,
    BarChart2,
    ChevronRight,
    CheckSquare
} from 'lucide-react';
import { API_BASE_URL, FILE_BASE_URL } from '../Dashboard/apiConfig';
import { useLocation } from 'react-router-dom';
import UserProfile from '../Dashboard/components/UserProfile';
import './Community.css';
import FileViewer from '../../components/Common/FileViewer';
import { useFileViewer } from '../../context/FileViewerContext';

const Community = ({ user }) => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlySaved, setShowOnlySaved] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0 });
    const [viewingFile, setViewingFile] = useState(null);
    const { openFile } = useFileViewer();
    // Notifications state


    // Comments state
    const [commentInputs, setCommentInputs] = useState({});
    const [expandedComments, setExpandedComments] = useState({});

    // New features state
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showMembersList, setShowMembersList] = useState(false);
    const [members, setMembers] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const pollInterval = useRef(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // ── Poll state ────────────────────────────────────────────────────────
    const [polls, setPolls] = useState([]);
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);
    const [pollToDelete, setPollToDelete] = useState(null);
    const [showPollDeleteModal, setShowPollDeleteModal] = useState(false);

    const combinedItems = useMemo(() => {
        const interleaved = [
            ...messages.map(m => ({ ...m, itemType: 'message' })),
            ...polls.map(p => ({ ...p, itemType: 'poll' }))
        ];
        // Sort descending (newest first)
        return interleaved.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [messages, polls]);

    const fetchMessages = useCallback(async () => {
        if (!user || !user.id || user.id === '0' || user.id === 0) {
            setMessages([]);
            setLoading(false);
            return;
        }
        try {
            let url = `${API_BASE_URL}/community_messages.php?user_id=${user.id}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (showOnlySaved) url += `&only_archived=true`;

            const response = await fetch(url);
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
            } else {
                console.error('Expected array of community messages, got:', data);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, searchQuery, showOnlySaved]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/community_stats.php`);
            const data = await res.json();
            if (data && !data.error) {
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/community_members.php`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMembers(data);
            } else {
                console.error('Expected array of community members, got:', data);
                setMembers([]);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }, []);

    const fetchPolls = useCallback(async () => {
        if (!user || !user.id || user.id === '0' || user.id === 0) {
            setPolls([]);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/community_polls.php?user_id=${user.id}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setPolls(data);
            } else {
                console.error('Expected array of community polls, got:', data);
                setPolls([]);
            }
        } catch (e) {
            console.error('Error fetching polls:', e);
        }
    }, [user?.id]);

    const handleCreatePoll = async () => {
        const nonEmpty = pollOptions.filter(o => o.trim());
        if (!pollQuestion.trim() || nonEmpty.length < 2) return;
        if (!user || !user.id || user.id === '0' || user.id === 0) {
            alert('Vous devez être connecté pour créer un sondage.');
            return;
        }
        setIsCreatingPoll(true);
        try {
            const res = await fetch(`${API_BASE_URL}/community_polls.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    user_id: user.id,
                    question: pollQuestion.trim(),
                    options: nonEmpty
                })
            });
            if (res.ok) {
                setPollQuestion('');
                setPollOptions(['', '']);
                setShowPollCreator(false);
                fetchPolls();
            }
        } catch (e) {
            console.error('Error creating poll:', e);
        } finally {
            setIsCreatingPoll(false);
        }
    };

    const handleVotePoll = async (pollId, optionId) => {
        if (!user || !user.id || user.id === '0' || user.id === 0) {
            alert('Vous devez être connecté pour voter.');
            return;
        }

        // Check if we already voted for this specific option
        const currentPoll = polls.find(p => p.id === pollId);
        if (currentPoll && currentPoll.user_vote === optionId) {
            return;
        }

        try {
            await fetch(`${API_BASE_URL}/community_polls.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'vote', user_id: user.id, poll_id: pollId, option_id: optionId })
            });
            fetchPolls();
        } catch (e) {
            console.error('Error voting:', e);
        }
    };

    const handleDeletePoll = async () => {
        if (!pollToDelete) return;
        try {
            const res = await fetch(`${API_BASE_URL}/community_polls.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poll_id: pollToDelete, user_id: user.id })
            });
            if (res.ok) {
                fetchPolls();
                setShowPollDeleteModal(false);
                setPollToDelete(null);
            }
        } catch (e) {
            console.error('Error deleting poll:', e);
        }
    };

    const handleUserClick = (userId) => {
        setSelectedUserId(userId);
        setShowUserProfile(true);
    };

    const handleBackToCommunity = () => {
        setShowUserProfile(false);
        setSelectedUserId(null);
    };



    useEffect(() => {
        fetchMessages();
        fetchStats();
        fetchMembers();
        fetchPolls();

        pollInterval.current = setInterval(() => {
            fetchMessages();
            fetchStats();
            fetchPolls();
        }, 5000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [fetchMessages, fetchStats, fetchMembers, fetchPolls]);

    // Handle Deep Linking (Scroll to Message)
    useEffect(() => {
        if (location.state?.scrollToMessage && messages.length > 0) {
            const msgId = location.state.scrollToMessage;
            const element = document.getElementById(`msg-${msgId}`);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.transition = 'background-color 0.5s';
                    element.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                    setTimeout(() => {
                        element.style.backgroundColor = 'transparent';
                    }, 2500);
                }, 100); // Small delay to ensure rendering
            }
        }
    }, [location.state, messages]);

    const uploadFileInChunks = async (file) => {
        const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('upload_id', uploadId);
            formData.append('chunk_index', chunkIndex);
            formData.append('total_chunks', totalChunks);
            formData.append('file_name', file.name);

            const res = await fetch(`${API_BASE_URL}/community_upload.php`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Chunk upload failed');

            const data = await res.json();
            const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
            setUploadProgress(percent);

            if (data.status === 'done') {
                return { media_url: data.media_url, type: data.type };
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log('Sending message...', { newMessage, selectedFile, userId: user?.id });
        if ((!newMessage.trim() && !selectedFile) || isSending) return;

        setIsSending(true);
        setUploadProgress(0);

        try {
            let mediaUrl = null;
            let mediaType = 'text';

            if (selectedFile) {
                console.log('Uploading file...', selectedFile.name);
                const uploadResult = await uploadFileInChunks(selectedFile);
                mediaUrl = uploadResult.media_url;
                mediaType = uploadResult.type;
                console.log('Upload success:', mediaUrl);
            }

            const formData = new FormData();
            formData.append('user_id', user.id);
            formData.append('content', newMessage);
            if (mediaUrl) {
                formData.append('media_url', mediaUrl);
                formData.append('media_type', mediaType);
            }
            if (replyTo) {
                formData.append('reply_to_id', replyTo.id);
            }

            console.log('POSTing message to API...');
            const res = await fetch(`${API_BASE_URL}/community_messages.php`, {
                method: 'POST',
                body: formData,
            });

            console.log('API Response Status:', res.status);
            if (res.ok) {
                const data = await res.json();
                console.log('Message sent successfully:', data);
                setNewMessage('');
                setSelectedFile(null);
                setReplyTo(null);
                fetchMessages();
            } else {
                const text = await res.text();
                console.error('API Error Response:', text);
                throw new Error(`Server returned ${res.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erreur lors de l\'envoi du message: ' + error.message);
        } finally {
            setIsSending(false);
            setUploadProgress(0);
        }
    };

    const handleSendComment = async (messageId) => {
        const content = commentInputs[messageId];
        if (!content || !content.trim()) return;
        if (!user || !user.id || user.id === '0' || user.id === 0) {
            alert('Vous devez être connecté pour commenter.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/community_comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_id: messageId,
                    user_id: user.id,
                    content: content
                }),
            });
            if (res.ok) {
                setCommentInputs(prev => ({ ...prev, [messageId]: '' }));
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending comment:', error);
        }
    };

    const handleToggleSave = async (messageId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/community_archives.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id, message_id: messageId })
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    };

    const confirmDeleteMessage = (msgId) => {
        setMessageToDelete(msgId);
        setShowDeleteModal(true);
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            const res = await fetch(`${API_BASE_URL}/community_messages.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message_id: messageToDelete, user_id: user.id })
            });
            if (res.ok) {
                fetchMessages();
                setShowDeleteModal(false);
                setMessageToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleReportMessage = async (msgId) => {
        const reason = prompt("Raison du signalement :");
        if (!reason) return;

        try {
            await fetch(`${API_BASE_URL}/admin/reports.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_id: msgId,
                    reporter_id: user.id,
                    reason: reason
                })
            });
            alert('Signalement envoyé aux administrateurs.');
        } catch (error) {
            alert('Erreur lors du signalement.');
        }
    };

    const toggleComments = (messageId) => {
        setExpandedComments(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    if (!user) return <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>;

    // Show user profile if selected
    if (showUserProfile && selectedUserId) {
        return <UserProfile userId={selectedUserId} onBack={handleBackToCommunity} currentUser={user} />;
    }

    return (
        <div className="community-whatsapp-container">
            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`whatsapp-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header-wrapper">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>Publications</h2>
                        <div style={{ position: 'relative' }}>
                            {/* Notifications removed from here and moved to Header */}
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="auth-input"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '0.9rem', borderRadius: '12px' }}
                        />
                        <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div
                        onClick={() => { setShowOnlySaved(false); setShowMembersList(false); }}
                        style={{
                            padding: '1.2rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            cursor: 'pointer',
                            background: (!showOnlySaved && !showMembersList) ? 'rgba(28, 53, 134, 0.05)' : 'transparent',
                            borderLeft: (!showOnlySaved && !showMembersList) ? '5px solid var(--primary-blue)' : '5px solid transparent',
                            transition: 'all 0.33s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(28, 53, 134, 0.2)' }}>
                            <Users size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Flux Global</h4>
                                <span style={{ fontSize: '0.7rem', color: 'var(--primary-green)', fontWeight: 700 }}>{stats.activeMembers} actifs</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                {messages.length > 0 ? messages[0].content : 'Voir les publications...'}
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={() => { setShowOnlySaved(true); setShowMembersList(false); }}
                        style={{
                            padding: '1.2rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            cursor: 'pointer',
                            background: showOnlySaved ? 'rgba(28, 53, 134, 0.05)' : 'transparent',
                            borderLeft: showOnlySaved ? '5px solid var(--primary-blue)' : '5px solid transparent',
                            transition: 'all 0.33s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(28, 53, 134, 0.2)' }}>
                            <Bookmark size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Favoris</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>Messages enregistrés</p>
                        </div>
                    </div>

                    <div
                        onClick={() => { setShowMembersList(true); setShowOnlySaved(false); }}
                        style={{
                            padding: '1.2rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            cursor: 'pointer',
                            background: showMembersList ? 'rgba(46, 171, 78, 0.05)' : 'transparent',
                            borderLeft: showMembersList ? '5px solid var(--primary-green)' : '5px solid transparent',
                            transition: 'all 0.33s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(46, 171, 78, 0.2)' }}>
                            <Users size={28} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Membres</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>{stats.totalMembers} personnes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="whatsapp-chat">
                {/* Chat Header */}
                <div id='whatsapp-chat-header'>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', paddingLeft: window.innerWidth <= 768 ? '3rem' : '0' }}>

                        <div style={{ width: '48px', height: '48px', borderRadius: '15px', background: showMembersList ? 'var(--primary-green)' : (showOnlySaved ? 'var(--primary-blue)' : 'var(--primary-blue)'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {showMembersList ? <Users size={24} /> : (showOnlySaved ? <Bookmark size={24} /> : <Users size={24} />)}
                        </div>
                        <div>
                            <h3 style={{ fontSize: window.innerWidth <= 768 ? '1.1rem' : '1.3rem', fontWeight: 900, margin: 0 }}>{showMembersList ? 'Membres' : (showOnlySaved ? 'Favoris' : 'Share-Differ-Respect')}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)' }}></div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600, margin: 0 }}>{stats.activeMembers} actifs</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chat-messages-area">
                    {/* Members List View */}
                    {showMembersList ? (
                        <div className="member-list-wrapper">
                            {members.map(member => (
                                <div key={member.id} className="member-card" onClick={() => handleUserClick(member.id)}>
                                    <div className={`member-avatar-box ${member.is_active ? 'active' : ''}`}>
                                        {member.profile_path ? (
                                            <img src={`${FILE_BASE_URL}${member.profile_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={24} color={member.is_active ? 'white' : 'var(--p-text-dim)'} />
                                        )}
                                        {member.is_active && <div className="online-indicator"></div>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, marginBottom: '2px', color: 'inherit' }}>{member.full_name || member.username}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--p-text-dim)', margin: 0 }}>
                                            {member.message_count} message{member.message_count !== 1 ? 's' : ''}
                                            {member.is_active && <span style={{ color: 'var(--primary-green)', marginLeft: '0.5rem', fontWeight: 600 }}>• Actif</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        <div style={{ margin: 'auto' }}><Loader2 className="animate-spin" size={48} color="var(--primary-blue)" /></div>
                    ) : messages.length === 0 && polls.length === 0 ? (
                        <div className="empty-state-view">
                            <div className="empty-state-icon-box">
                                <MessageSquare size={48} style={{ opacity: 0.2 }} />
                            </div>
                            <h3>Pas encore de messages</h3>
                            <p>Envoyez le premier message pour lancer la discussion !</p>
                        </div>
                    ) : (
                        <>
                            {/* ── Polls Section ── */}

                            {combinedItems.map(item => {
                                if (item.itemType === 'poll') {
                                    const poll = item;
                                    const hasVoted = poll.user_vote !== null;
                                    const isOwner = poll.created_by === user.id;
                                    const isAdmin = user.role === 'Root' || user.role === 'admin';
                                    return (
                                        <div key={`poll-${poll.id}`} className="poll-card" style={{ marginBottom: '1.5rem' }}>
                                            {/* Poll header */}
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <BarChart2 size={18} color="white" />
                                                    </div>
                                                    <div>
                                                        <span
                                                            onClick={() => handleUserClick(poll.created_by)}
                                                            style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-blue)', cursor: 'pointer' }}
                                                            onMouseOver={e => e.target.style.textDecoration = 'underline'}
                                                            onMouseOut={e => e.target.style.textDecoration = 'none'}
                                                        >{poll.full_name || poll.username}</span>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                            {new Date(poll.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {(isOwner || isAdmin) && (
                                                    <button
                                                        onClick={() => { setPollToDelete(poll.id); setShowPollDeleteModal(true); }}
                                                        style={{ background: 'rgba(239,68,68,0.08)', border: 'none', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                                                        title="Supprimer"
                                                    ><Trash2 size={15} /></button>
                                                )}
                                            </div>

                                            {/* Question */}
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1.2rem', lineHeight: 1.4 }}>{poll.question}</h4>

                                            {/* Options */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                                {poll.options.map(opt => {
                                                    const pct = poll.total_votes > 0 ? Math.round((opt.vote_count / poll.total_votes) * 100) : 0;
                                                    const isMyVote = poll.user_vote === opt.id;
                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => handleVotePoll(poll.id, opt.id)}
                                                            className={`poll-option-btn${isMyVote ? ' voted' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div className="poll-option-bar" style={{ width: hasVoted ? `${pct}%` : '0%' }} />
                                                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: isMyVote ? 700 : 500 }}>
                                                                    {isMyVote && <CheckSquare size={15} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />}
                                                                    {opt.option_text}
                                                                </span>
                                                                {hasVoted && (
                                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isMyVote ? 'var(--primary-blue)' : 'var(--gray-500)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                                                                        {pct}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Footer */}
                                            <p style={{ margin: '1rem 0 0', fontSize: '0.8rem', color: 'var(--gray-400)', fontWeight: 600 }}>
                                                {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}{hasVoted ? ' • Vous avez voté (cliquez pour changer)' : ' • Cliquez pour voter'}
                                            </p>
                                        </div>
                                    );
                                } else {
                                    const msg = item;
                                    const isMe = msg.user_id == user.id;
                                    return (
                                        <div key={`msg-${msg.id}`} id={`msg-${msg.id}`} className="message-wrapper">
                                            {/* Header with ID and timestamp */}
                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem', marginLeft: '1rem' }}>
                                                {/* Profile Picture */}
                                                <div
                                                    onClick={() => handleUserClick(msg.user_id)}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '14px',
                                                        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%)',
                                                        overflow: 'hidden',
                                                        flexShrink: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    {msg.profile_path ? (
                                                        <img src={`${FILE_BASE_URL}${msg.profile_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <User size={24} color="white" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User ID Badge */}
                                                <div style={{
                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                                                    backdropFilter: 'blur(10px)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    border: '1px solid rgba(102, 126, 234, 0.2)'
                                                }}>
                                                    <div style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '8px',
                                                        background: (msg.role === 'Root' || msg.role === 'teacher')
                                                            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                                            : 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 900,
                                                        boxShadow: (msg.role === 'Root' || msg.role === 'teacher') ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
                                                    }}>
                                                        {(msg.role === 'Root' || msg.role === 'teacher') ? <CheckCircle size={14} /> : <Users size={14} />}
                                                    </div>
                                                    <span
                                                        onClick={(e) => { e.stopPropagation(); handleUserClick(msg.user_id); }}
                                                        style={{
                                                            fontSize: '0.9rem',
                                                            fontWeight: 700,
                                                            color: 'var(--primary-blue)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                    >
                                                        {msg.full_name || msg.username || `User ${msg.user_id}`}
                                                        {(msg.role === 'Root' || msg.role === 'teacher') && (
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                background: msg.role === 'Root' ? 'var(--primary-blue)' : 'var(--primary-green)',
                                                                color: 'white',
                                                                padding: '2px 6px',
                                                                borderRadius: '100px',
                                                                fontWeight: 800,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                {msg.role}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Timestamp Badge */}
                                                <div style={{
                                                    background: 'rgba(0, 0, 0, 0.03)',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--gray-500)',
                                                    fontWeight: 600
                                                }}>
                                                    {new Date(msg.created_at).toLocaleString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>

                                                {/* Bookmark icon */}
                                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                    {/* Reply button */}
                                                    <button
                                                        onClick={() => {
                                                            setReplyTo(msg);
                                                            document.getElementById('community-textarea')?.focus();
                                                        }}
                                                        style={{
                                                            background: 'rgba(102, 126, 234, 0.1)',
                                                            border: 'none',
                                                            color: 'var(--primary-blue)',
                                                            cursor: 'pointer',
                                                            padding: '0.5rem',
                                                            borderRadius: '8px',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem'
                                                        }}
                                                        title="Répondre"
                                                    >
                                                        <Share2 size={16} style={{ transform: 'scaleX(-1)' }} />
                                                    </button>

                                                    {/* Delete button (Root, admin or owner) */}
                                                    {(user.role === 'Root' || user.role === 'admin' || isMe) && (
                                                        <button
                                                            onClick={() => confirmDeleteMessage(msg.id)}
                                                            style={{
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                border: 'none',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                padding: '0.5rem',
                                                                borderRadius: '8px',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}

                                                    {/* Report Button */}
                                                    {!isMe && (
                                                        <button
                                                            onClick={() => handleReportMessage(msg.id)}
                                                            style={{
                                                                background: 'rgba(245, 158, 11, 0.1)',
                                                                border: 'none',
                                                                color: '#f59e0b',
                                                                cursor: 'pointer',
                                                                padding: '0.5rem',
                                                                borderRadius: '8px',
                                                                transition: 'all 0.2s',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem'
                                                            }}
                                                            title="Signaler"
                                                        >
                                                            <Shield size={16} />
                                                        </button>
                                                    )}

                                                    {/* Bookmark button */}
                                                    <button
                                                        onClick={() => handleToggleSave(msg.id)}
                                                        style={{
                                                            background: msg.is_archived ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                                                            border: 'none',
                                                            color: msg.is_archived ? 'var(--primary-blue)' : 'var(--gray-300)',
                                                            cursor: 'pointer',
                                                            padding: '0.5rem',
                                                            borderRadius: '8px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        title="Enregistrer"
                                                    >
                                                        {msg.is_archived ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column' }}>

                                                <div className="message-bubble">
                                                    {/* Gradient left border */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: 0,
                                                        top: 0,
                                                        bottom: 0,
                                                        width: '5px',
                                                        background: 'linear-gradient(180deg, var(--primary-blue) 0%, var(--primary-green) 100%)',
                                                        borderRadius: '24px 0 0 24px'
                                                    }}></div>
                                                    {/* Reply Context */}
                                                    {msg.reply_to_id && (
                                                        <div style={{
                                                            background: isMe ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
                                                            padding: '8px 12px',
                                                            borderRadius: '10px',
                                                            marginBottom: '0.8rem',
                                                            borderLeft: `4px solid ${isMe ? 'white' : 'var(--primary-blue)'}`
                                                        }}>
                                                            <p style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: '2px', color: isMe ? 'white' : 'var(--primary-blue)' }}>@{msg.reply_username}</p>
                                                            <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.reply_content}</p>
                                                        </div>
                                                    )}

                                                    {msg.media_url && (
                                                        <div style={{ marginBottom: '1rem', borderRadius: '15px', overflow: 'hidden' }}>
                                                            {msg.type === 'image' ? (
                                                                <img
                                                                    src={`${FILE_BASE_URL}${msg.media_url}`}
                                                                    alt=""
                                                                    onClick={() => openFile(msg)}
                                                                    style={{
                                                                        borderRadius: '12px',
                                                                        maxWidth: '100%',
                                                                        maxHeight: '400px',
                                                                        width: 'auto',
                                                                        objectFit: 'contain',
                                                                        display: 'block',
                                                                        cursor: 'pointer',
                                                                        transition: 'transform 0.2s'
                                                                    }}
                                                                />
                                                            ) : msg.type === 'video' ? (
                                                                <video
                                                                    controls
                                                                    style={{
                                                                        borderRadius: '12px',
                                                                        maxWidth: '100%',
                                                                        maxHeight: '400px',
                                                                        width: '100%',
                                                                        objectFit: 'contain',
                                                                        display: 'block',
                                                                        background: 'rgba(0,0,0,0.05)'
                                                                    }}
                                                                >
                                                                    <source src={`${FILE_BASE_URL}${msg.media_url}`} type="video/mp4" />
                                                                    Votre navigateur ne supporte pas la lecture vidéo.
                                                                </video>
                                                            ) : (
                                                                <div
                                                                    onClick={() => openFile(msg)}
                                                                    style={{
                                                                        color: isMe ? 'white' : 'var(--primary-blue)',
                                                                        fontSize: '0.9rem',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.8rem',
                                                                        background: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                                                                        padding: '0.8rem 1.2rem',
                                                                        borderRadius: '12px',
                                                                        textDecoration: 'none',
                                                                        fontWeight: 600,
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <Paperclip size={20} />
                                                                    <span>Fichier attaché</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <p style={{ fontSize: '1.05rem', lineHeight: '1.6', margin: 0, fontWeight: 400, color: '#2d3748' }}>{msg.content}</p>

                                                    {/* Comments Section */}
                                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                                                        {msg.comments && msg.comments.length > 0 && (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                                                                {(expandedComments[msg.id] ? msg.comments : msg.comments.slice(0, 2)).map(comment => (
                                                                    <div key={comment.id} style={{
                                                                        padding: '0.8rem 1.2rem',
                                                                        background: 'rgba(0,0,0,0.03)',
                                                                        borderRadius: '16px',
                                                                        fontSize: '0.9rem',
                                                                        position: 'relative'
                                                                    }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                                            <span
                                                                                onClick={(e) => { e.stopPropagation(); handleUserClick(comment.user_id); }}
                                                                                style={{
                                                                                    fontWeight: 800,
                                                                                    color: 'var(--primary-blue)',
                                                                                    fontSize: '0.85rem',
                                                                                    cursor: 'pointer'
                                                                                }}
                                                                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                                                            >
                                                                                {comment.full_name || comment.username}
                                                                            </span>
                                                                            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                                                                {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                                                            </span>
                                                                        </div>
                                                                        <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.4' }}>{comment.content}</p>
                                                                    </div>
                                                                ))}

                                                                {msg.comments.length > 2 && (
                                                                    <button
                                                                        onClick={() => toggleComments(msg.id)}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            color: 'var(--primary-blue)',
                                                                            fontSize: '0.85rem',
                                                                            fontWeight: 700,
                                                                            cursor: 'pointer',
                                                                            padding: '0.5rem 0',
                                                                            textAlign: 'left',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px',
                                                                            transition: 'all 0.2s'
                                                                        }}
                                                                    >
                                                                        {expandedComments[msg.id] ? (
                                                                            <>Voir moins</>
                                                                        ) : (
                                                                            <>Voir tout ({msg.comments.length})</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Comment Input */}
                                                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                                            <div style={{ flex: 1, position: 'relative' }}>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ajouter un commentaire..."
                                                                    value={commentInputs[msg.id] || ''}
                                                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(msg.id)}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '0.7rem 1.2rem',
                                                                        borderRadius: '12px',
                                                                        background: 'rgba(0,0,0,0.04)',
                                                                        border: 'none',
                                                                        fontSize: '0.85rem',
                                                                        outline: 'none'
                                                                    }}
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() => handleSendComment(msg.id)}
                                                                disabled={!commentInputs[msg.id]?.trim()}
                                                                style={{
                                                                    background: 'var(--primary-blue)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '10px',
                                                                    padding: '0.6rem',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    opacity: !commentInputs[msg.id]?.trim() ? 0.5 : 1,
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <Send size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </>
                    )}
                </div>

                <div className="chat-input-area">
                    {/* Reply Preview */}
                    {replyTo && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '1rem 1.5rem',
                            background: 'rgba(28, 53, 134, 0.05)',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderLeft: '5px solid var(--primary-blue)',
                            animation: 'fadeInUp 0.3s ease'
                        }}>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary-blue)', marginBottom: '2px' }}>Réponse à @{replyTo.username}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{replyTo.content}</p>
                            </div>
                            <button onClick={() => setReplyTo(null)} style={{ marginLeft: '1rem', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>×</button>
                        </div>
                    )}

                    {selectedFile && (
                        <div style={{ marginBottom: '1rem', padding: '0.8rem 1.2rem', background: 'rgba(46, 171, 78, 0.1)', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeInUp 0.3s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ImageIcon size={20} color="var(--primary-green)" />
                                <span style={{ fontSize: '0.9rem', color: 'var(--primary-green)', fontWeight: 700 }}>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 900 }}>×</button>
                        </div>
                    )}

                    <form className="chat-input-form" onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <input type="file" id="whatsapp-file" style={{ display: 'none' }} accept="image/*,video/*,.pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <button type="button" onClick={() => document.getElementById('whatsapp-file').click()} className="icon-btn" style={{ color: 'var(--gray-500)', background: 'rgba(0,0,0,0.04)', borderRadius: '18px', width: 'fit-content', height: '56px', flexShrink: 0, transition: 'all 0.2s' }}>
                            <Paperclip size={26} />
                        </button>
                        {/* Poll creator button */}
                        <button
                            type="button"
                            onClick={() => setShowPollCreator(true)}
                            title="Créer un sondage"
                            style={{
                                color: 'var(--primary-blue)',
                                background: 'rgba(28,53,134,0.07)',
                                border: 'none',
                                borderRadius: '18px',
                                width: '56px',
                                height: '56px',
                                flexShrink: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(28,53,134,0.14)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(28,53,134,0.07)'}
                        >
                            <BarChart2 size={24} />
                        </button>

                        <div style={{ flex: 1, position: 'relative' }}>
                            <textarea
                                id="community-textarea"
                                className="auth-input"
                                placeholder="Partagez quelque chose avec la communauté..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                style={{
                                    minHeight: '56px',
                                    height: '56px',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '18px',
                                    resize: 'none',
                                    background: 'rgba(0,0,0,0.04)',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    lineHeight: '1.4'
                                }}
                            ></textarea>
                        </div>

                        <button type="submit" disabled={isSending || (!newMessage.trim() && !selectedFile)} style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '18px',
                            background: 'var(--primary-green)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 8px 25px rgba(46, 171, 78, 0.4)',
                            flexShrink: 0,
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                            onMouseOver={(e) => !isSending && (e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)')}
                            onMouseOut={(e) => !isSending && (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                        >
                            {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={26} />}
                        </button>
                    </form>
                </div>
                {/* ── Poll Creator Modal ──────────────────────────────── */}
                {showPollCreator && (
                    <div className="poll-modal-overlay" onClick={() => setShowPollCreator(false)}>
                        <div className="poll-creator-panel" onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BarChart2 size={20} color="white" />
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Créer un sondage</h3>
                                </div>
                                <button onClick={() => setShowPollCreator(false)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.5rem' }}>Question</label>
                                <input
                                    autoFocus
                                    type="text"
                                    className="auth-input"
                                    placeholder="Posez votre question..."
                                    value={pollQuestion}
                                    onChange={e => setPollQuestion(e.target.value)}
                                    maxLength={300}
                                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '1rem' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.75rem' }}>Options</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    {pollOptions.map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))', color: 'white', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                                            <input
                                                type="text"
                                                className="auth-input"
                                                placeholder={`Option ${i + 1}`}
                                                value={opt}
                                                onChange={e => {
                                                    const next = [...pollOptions];
                                                    next[i] = e.target.value;
                                                    setPollOptions(next);
                                                }}
                                                maxLength={150}
                                                style={{ flex: 1, padding: '0.65rem 0.9rem', borderRadius: '10px', fontSize: '0.9rem' }}
                                            />
                                            {pollOptions.length > 2 && (
                                                <button type="button" onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {pollOptions.length < 5 && (
                                    <button type="button" onClick={() => setPollOptions([...pollOptions, ''])} style={{ marginTop: '0.75rem', background: 'none', border: '2px dashed rgba(28,53,134,0.2)', borderRadius: '10px', padding: '0.6rem 1rem', cursor: 'pointer', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', justifyContent: 'center', transition: 'all 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-blue)'}
                                        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(28,53,134,0.2)'}
                                    >
                                        <Plus size={16} /> Ajouter une option
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleCreatePoll}
                                disabled={isCreatingPoll || !pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2}
                                style={{
                                    width: '100%', padding: '0.9rem', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))',
                                    color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem',
                                    cursor: 'pointer', boxShadow: '0 8px 25px rgba(28,53,134,0.25)',
                                    opacity: (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) ? 0.5 : 1,
                                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                            >
                                {isCreatingPoll ? <Loader2 className="animate-spin" size={20} /> : <><BarChart2 size={18} /> Publier le sondage</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Poll Delete Modal ─────────────────────────────────── */}
                {showPollDeleteModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPollDeleteModal(false)}>
                        <div className="community-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-icon-box"><Trash2 size={30} /></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supprimer le sondage ?</h3>
                            <p style={{ color: 'var(--p-text-dim)', marginBottom: '1.5rem' }}>Cette action est irréversible.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button onClick={() => setShowPollDeleteModal(false)} className="btn-cancel">Annuler</button>
                                <button onClick={handleDeletePoll} className="btn-danger-action">Supprimer</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDeleteModal(false)}>
                        <div className="community-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-icon-box"><Trash2 size={30} /></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Supprimer le message ?</h3>
                            <p style={{ color: 'var(--p-text-dim)', marginBottom: '1.5rem' }}>Cette action est irréversible.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Annuler</button>
                                <button onClick={handleDeleteMessage} className="btn-danger-action">Supprimer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Community;
