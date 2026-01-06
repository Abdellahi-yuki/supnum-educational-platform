import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    Plus
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import { useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';

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

    const fetchMessages = useCallback(async () => {
        if (!user) return;
        try {
            let url = `${API_BASE_URL}/community_messages.php?user_id=${user.id}`;
            if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
            if (showOnlySaved) url += `&only_archived=true`;

            const response = await fetch(url);
            const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(data);
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
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    }, []);

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

        pollInterval.current = setInterval(() => {
            fetchMessages();
            fetchStats();
        }, 5000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [fetchMessages, fetchStats, fetchMembers]);

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
        <div className="community-whatsapp-container" style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? '350px 1fr' : '1fr',
            height: 'calc(100vh - 120px)',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(40px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            overflow: 'hidden',
            margin: '0 auto',
            maxWidth: '1600px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            position: 'relative'
        }}>
            {/* Mobile Menu Button */}
            {window.innerWidth <= 768 && (
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 1001,
                        background: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Sidebar */}
            <div className="whatsapp-sidebar" style={{
                borderRight: '1px solid rgba(0,0,0,0.05)',
                display: window.innerWidth <= 768 && !isMobileMenuOpen ? 'none' : 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.2)',
                position: window.innerWidth <= 768 ? 'absolute' : 'relative',
                left: 0,
                top: 0,
                bottom: 0,
                width: window.innerWidth <= 768 ? '80%' : 'auto',
                maxWidth: window.innerWidth <= 768 ? '350px' : 'none',
                zIndex: 1000,
                boxShadow: window.innerWidth <= 768 ? '4px 0 20px rgba(0,0,0,0.1)' : 'none'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
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
                            background: !showOnlySaved ? 'rgba(28, 53, 134, 0.05)' : 'transparent',
                            borderLeft: !showOnlySaved ? '5px solid var(--primary-blue)' : '5px solid transparent',
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
            <div className="whatsapp-chat" style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.6)',
                height: '100%',
                minHeight: 0
            }}>
                {/* Chat Header */}
                <div style={{ padding: '1.2rem 2.5rem', background: 'white', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                background: 'rgba(0,0,0,0.05)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.6rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--gray-700)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                        >
                            <X size={20} />
                        </button>
                        <div style={{ width: '48px', height: '48px', borderRadius: '15px', background: showMembersList ? 'var(--primary-green)' : (showOnlySaved ? 'var(--primary-blue)' : 'var(--primary-blue)'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            {showMembersList ? <Users size={24} /> : (showOnlySaved ? <Bookmark size={24} /> : <Users size={24} />)}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>{showMembersList ? 'Membres' : (showOnlySaved ? 'Favoris' : 'Flux de Publications')}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)' }}></div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600, margin: 0 }}>{stats.activeMembers} actifs maintenant</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2.5rem',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    gap: '1.5rem',
                    background: 'rgba(240, 242, 245, 0.3)',
                    minHeight: 0
                }}>
                    {/* Members List View */}
                    {showMembersList ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {members.map(member => (
                                <div key={member.id} style={{
                                    background: 'white',
                                    padding: '1.2rem 1.5rem',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                    onClick={() => handleUserClick(member.id)}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                                    }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '14px',
                                        background: member.is_active ? 'var(--primary-blue)' : '#e5e7eb',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}>
                                        {member.profile_path ? (
                                            <img src={`${API_BASE_URL}${member.profile_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: '1rem', fontWeight: 900, color: member.is_active ? 'white' : 'var(--gray-600)' }}>
                                                {member.username?.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                        {member.is_active && (
                                            <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-green)', border: '2px solid white' }}></div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, marginBottom: '2px' }}>{member.username}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
                                            {member.message_count} message{member.message_count !== 1 ? 's' : ''}
                                            {member.is_active && <span style={{ color: 'var(--primary-green)', marginLeft: '0.5rem', fontWeight: 600 }}>• Actif</span>}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        <div style={{ margin: 'auto' }}><Loader2 className="animate-spin" size={48} color="var(--primary-blue)" /></div>
                    ) : messages.length === 0 ? (
                        <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--gray-400)' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <MessageSquare size={48} style={{ opacity: 0.2 }} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gray-600)' }}>Pas encore de messages</h3>
                            <p>Envoyez le premier message pour lancer la discussion !</p>
                        </div>
                    ) : (
                        messages.map(msg => {
                            const isMe = msg.user_id == user.id;
                            return (
                                <div key={msg.id} id={`msg-${msg.id}`} style={{
                                    alignSelf: 'flex-start',
                                    width: '100%',
                                    maxWidth: '900px',
                                    marginBottom: '1.5rem'
                                }}>
                                    {/* Header with ID and timestamp */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', marginLeft: '1rem' }}>
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
                                                <img src={`${API_BASE_URL}${msg.profile_path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>
                                                    {msg.username?.substring(0, 2).toUpperCase() || 'U'}
                                                </span>
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
                                                background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                fontWeight: 900
                                            }}>
                                                <Users size={14} />
                                            </div>
                                            <span
                                                onClick={(e) => { e.stopPropagation(); handleUserClick(msg.user_id); }}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: 700,
                                                    color: 'var(--primary-blue)',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                                            >{msg.username || `User ${msg.user_id}`}</span>
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

                                            {/* Delete button (admin or owner) */}
                                            {(user.role === 'admin' || isMe) && (
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

                                        <div style={{
                                            padding: '1.5rem 1.75rem',
                                            borderRadius: '24px',
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                            backdropFilter: 'blur(20px)',
                                            color: 'var(--dark)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                            position: 'relative',
                                            border: '1px solid rgba(255, 255, 255, 0.8)',
                                            overflow: 'hidden'
                                        }}>
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
                                                            src={`${API_BASE_URL}${msg.media_url}`}
                                                            alt=""
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
                                                            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
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
                                                            <source src={`${API_BASE_URL}${msg.media_url}`} type="video/mp4" />
                                                            Votre navigateur ne supporte pas la lecture vidéo.
                                                        </video>
                                                    ) : (
                                                        <a href={`${API_BASE_URL}${msg.media_url}`} target="_blank" rel="noreferrer" style={{
                                                            color: isMe ? 'white' : 'var(--primary-blue)',
                                                            fontSize: '0.9rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.8rem',
                                                            background: isMe ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
                                                            padding: '0.8rem 1.2rem',
                                                            borderRadius: '12px',
                                                            textDecoration: 'none',
                                                            fontWeight: 600
                                                        }}>
                                                            <Paperclip size={20} />
                                                            <span>Fichier attaché</span>
                                                        </a>
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
                                                                    <span style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '0.85rem' }}>{comment.username}</span>
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
                        })
                    )}
                </div>

                <div style={{ padding: '1.5rem 2.5rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 -4px 10px rgba(0,0,0,0.01)' }}>
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

                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <input type="file" id="whatsapp-file" style={{ display: 'none' }} accept="image/*,video/*,.pdf,.doc,.docx" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <button type="button" onClick={() => document.getElementById('whatsapp-file').click()} className="icon-btn" style={{ color: 'var(--gray-500)', background: 'rgba(0,0,0,0.04)', borderRadius: '18px', width: '56px', height: '56px', flexShrink: 0, transition: 'all 0.2s' }}>
                            <Paperclip size={26} />
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
                {/* Custom Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onClick={() => setShowDeleteModal(false)}>
                        <div style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            width: '90%',
                            maxWidth: '400px',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                color: '#ef4444'
                            }}>
                                <Trash2 size={30} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1f2937' }}>Supprimer le message ?</h3>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeleteMessage}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                    }}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
