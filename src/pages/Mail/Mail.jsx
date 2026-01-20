import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mailService from '../../services/mailService';
import {
    Inbox,
    Star,
    Send,
    AlertTriangle,
    Trash2,
    Archive,
    Plus,
    Search,
    Menu,
    X,
    Reply,
    ReplyAll,
    Forward,
    Maximize2,
    Minimize2,
    CheckCircle
} from 'lucide-react';
import './Mail.css';

const Mail = () => {
    const location = useLocation();
    const [selectedLabel, setSelectedLabel] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);

    // Compose state to handle pre-filling data for replies/forwards
    const [composeData, setComposeData] = useState({
        to: '',
        cc: [],
        bcc: [],
        subject: '',
        body: '',
        parentId: null
    });

    // Handle pre-filling from Community profile
    useEffect(() => {
        if (location.state?.composeWithEmail) {
            setComposeData(prev => ({
                ...prev,
                to: location.state.composeWithEmail
            }));
            setIsComposeOpen(true);
            setIsMinimized(false);
            setIsMaximized(false);
        }
    }, [location.state]);

    // Enhanced mock data with labels support and branching
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch messages on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [msgs, users] = await Promise.all([
                    mailService.fetchMessages(selectedLabel),
                    mailService.fetchUsers()
                ]);
                setMessages(msgs);
                setAllUsers(users);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedLabel]);

    const [selectedMessageIds, setSelectedMessageIds] = useState(new Set());

    // Helper to update CC/BCC arrays
    const addRecipient = (type) => {
        setComposeData(prev => ({
            ...prev,
            [type]: [...prev[type], '']
        }));
    };

    const removeRecipient = (type, index) => {
        setComposeData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const updateRecipient = (type, index, value) => {
        setComposeData(prev => ({
            ...prev,
            [type]: prev[type].map((email, i) => i === index ? value : email)
        }));
    };

    // Filter messages based on selected label and search query
    // AND show only LEAF NODES (latest in branch)
    const filteredMessages = useMemo(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = Number(user.id || 3);

        // 1. Identify all parent IDs
        const parentIds = new Set(messages.map(m => Number(m.parentId)));

        // Helper to check if user participated in a thread
        const userParticipatedInThread = (msg) => {
            if (Number(msg.sender_id) === currentUserId) return true;
            let current = messages.find(m => Number(m.id) === Number(msg.parentId));
            while (current) {
                if (Number(current.sender_id) === currentUserId) return true;
                if (Number(current.parentId) === 0) break;
                current = messages.find(m => Number(m.id) === Number(current.parentId));
            }
            return false;
        };

        // 2. Filter
        return messages.filter(msg => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                msg.from.toLowerCase().includes(query) ||
                msg.subject.toLowerCase().includes(query) ||
                msg.content.toLowerCase().includes(query) ||
                msg.email.toLowerCase().includes(query);

            // 3. Leaf Node Check
            const isLeaf = !parentIds.has(Number(msg.id));

            // 4. Label Logic
            if (selectedLabel === 'sent') {
                if (!matchesSearch) return false;

                // Rule: Show if I sent it
                return Number(msg.sender_id) === currentUserId;
            }

            // For other labels (Inbox, Starred, etc.), only show leaf nodes to maintain threaded view
            if (!matchesSearch || !isLeaf) return false;

            if (selectedLabel === 'inbox') {
                // Show if:
                // a) Message itself is in inbox AND (it's received OR it's a sent reply)
                const isInbox = msg.labels.includes('inbox');
                const isSentByMe = Number(msg.sender_id) === currentUserId;
                const isReply = Number(msg.parentId) !== 0;

                // User's rule: "when the mail is (sent) by the user then display it in the (Sent section) and don't display it in inbox, 
                // but if the mail is a part of a thread then display it in both"
                if (isSentByMe && !isReply) return false;

                return isInbox;
            } else {
                // Standard label filtering for other views (starred, etc.)
                return msg.labels.includes(selectedLabel);
            }
        });
    }, [messages, selectedLabel, searchQuery]);

    // Toggle message selection
    const toggleMessageSelection = (id) => {
        const newSelected = new Set(selectedMessageIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedMessageIds(newSelected);
    };

    // Toggle label for selected messages
    const toggleLabelForSelected = async (label) => {
        const dbFieldMap = {
            'starred': 'is_starred',
            'spam': 'is_spam',
            'trash': 'is_trash',
            'archive': 'is_archived'
        };
        const dbField = dbFieldMap[label];
        if (!dbField) return;

        const updatedMessages = [...messages];
        const updatePromises = [];

        for (const msgId of selectedMessageIds) {
            const msgIndex = updatedMessages.findIndex(m => m.id === msgId);
            if (msgIndex !== -1) {
                const currentVal = updatedMessages[msgIndex].labels.includes(label);
                const newVal = !currentVal;

                // Update local state optimistically
                const newLabels = newVal
                    ? [...updatedMessages[msgIndex].labels, label]
                    : updatedMessages[msgIndex].labels.filter(l => l !== label);

                updatedMessages[msgIndex] = {
                    ...updatedMessages[msgIndex],
                    labels: newLabels,
                    [label === 'starred' ? 'isStarred' : dbField]: newVal
                };

                // Prepare API call
                updatePromises.push(mailService.updateMessage(msgId, { [dbField]: newVal }));
            }
        }

        setMessages(updatedMessages);

        try {
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Failed to update labels in batch:", error);
            // In a real app, we might want to rollback or show an error toast
            alert("Some updates failed. Please refresh.");
        }
    };

    // Check if a label is active for all selected messages
    const isLabelActiveForSelected = (label) => {
        if (selectedMessageIds.size === 0) return false;
        const selectedMsgs = messages.filter(msg => selectedMessageIds.has(msg.id));
        return selectedMsgs.every(msg => msg.labels.includes(label));
    };

    // Get Ancestor Path (Branch Isolation)
    // Only show the path from the selected message up to the root.
    const getThreadPath = (message) => {
        if (!message) return [];

        const path = [];
        let current = message;

        // Traverse up
        while (current) {
            path.unshift(current); // Add to beginning (chronological order)
            if (current.parentId === 0) break;
            current = messages.find(m => m.id === current.parentId);
        }

        return path;
    };

    const threadMessages = useMemo(() => getThreadPath(selectedMessage), [selectedMessage, messages]);


    // Reply Handlers
    const handleReply = (msg) => {
        setComposeData({
            to: msg.email,
            cc: [],
            bcc: [],
            subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
            body: '',
            parentId: msg.id
        });
        setIsComposeOpen(true);
        setIsMinimized(false);
    };

    const handleReplyAll = (msg) => {
        setComposeData({
            to: msg.email,
            cc: [], // In real app, extract CCs from msg
            bcc: [],
            subject: msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
            body: '',
            parentId: msg.id
        });
        setIsComposeOpen(true);
        setIsMinimized(false);
    };

    const handleForward = (msg) => {
        setComposeData({
            to: '',
            cc: [],
            bcc: [],
            subject: msg.subject.startsWith('Fwd:') ? msg.subject : `Fwd: ${msg.subject}`,
            body: `\n\n---------- Forwarded message ---------\nFrom: ${msg.from} <${msg.email}>\nDate: ${msg.date}\nSubject: ${msg.subject}\n\n${msg.content}`,
            parentId: null
        });
        setIsComposeOpen(true);
        setIsMinimized(false);
    };

    const handleComposeClose = () => {
        setIsComposeOpen(false);
        setIsMinimized(false);
        setIsMaximized(false);
        setComposeData({ to: '', cc: [], bcc: [], subject: '', body: '', parentId: null });
    };

    const handleMessageClick = async (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            try {
                await mailService.updateMessage(msg.id, { is_read: true });
                const updatedMessages = messages.map(m =>
                    m.id === msg.id ? { ...m, isRead: true } : m
                );
                setMessages(updatedMessages);
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
    };

    const availableLabels = [
        { id: 'starred', icon: 'fas fa-star', label: 'Starred' },
        { id: 'spam', icon: 'fas fa-triangle-exclamation', label: 'Spam' },
        { id: 'trash', icon: 'fas fa-trash', label: 'Trash' },
        { id: 'archive', icon: 'fas fa-box-archive', label: 'Archive' }
    ];

    return (
        <div className="mail-container">
            {/* Sidebar */}
            <aside className={`mail-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="mail-sidebar-header">
                    <h2>Mail</h2>
                </div>

                <nav className="mail-nav">
                    {[
                        { id: 'inbox', label: 'Boîte de réception', icon: Inbox },
                        { id: 'starred', label: 'Favoris', icon: Star },
                        { id: 'sent', label: 'Envoyés', icon: Send },
                        { id: 'spam', label: 'Indésirables', icon: AlertTriangle },
                        { id: 'trash', label: 'Corbeille', icon: Trash2 }
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`nav-item ${selectedLabel === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedLabel(item.id);
                                    setSelectedMessage(null);
                                    setSelectedMessageIds(new Set());
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {item.id === 'inbox' && (
                                    <span className="count">
                                        {messages.filter(m => m.labels.includes('inbox') && !m.isRead).length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="sidebar-compose">
                    <button className="compose-btn" onClick={() => {
                        setComposeData({ to: '', cc: [], bcc: [], subject: '', body: '', parentId: null });
                        setIsComposeOpen(true);
                    }}>
                        <Plus size={20} /> Nouveau message
                    </button>
                </div>

                <div className="sidebar-footer">
                    {/* Back link removed - using global header */}
                </div>
            </aside>

            {/* Main Content */}
            <main className="mail-main">
                {/* Header */}
                <header className="mail-header">
                    <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={20} />
                    </button>
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher des mails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {/* Selection Toolbar (Conditional) */}
                {selectedMessageIds.size > 0 && (
                    <div className="selection-toolbar" style={{ padding: '10px 16px', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#5f6368', marginRight: '8px' }}>{selectedMessageIds.size} selected</span>
                        {availableLabels.map(item => {
                            // Map string icon names to Lucide components
                            const IconMap = {
                                'starred': Star,
                                'spam': AlertTriangle,
                                'trash': Trash2,
                                'archive': Archive
                            };
                            const Icon = IconMap[item.id];
                            return (
                                <button
                                    key={item.id}
                                    className={`label-choice-btn ${isLabelActiveForSelected(item.id) ? 'selected' : ''}`}
                                    onClick={() => toggleLabelForSelected(item.id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${isLabelActiveForSelected(item.id) ? '#00a86b' : '#dadce0'}`,
                                        background: isLabelActiveForSelected(item.id) ? '#d1f2e5' : 'white',
                                        color: isLabelActiveForSelected(item.id) ? '#00a86b' : '#5f6368',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: '500'
                                    }}
                                >
                                    <Icon size={14} /> {item.label}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setSelectedMessageIds(new Set())}
                            style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: '#5f6368' }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Message List */}
                <div className="message-list">
                    {filteredMessages.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#5f6368' }}>No messages in {selectedLabel}</div>
                    ) : (
                        filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                className={`mail-message-item ${!msg.isRead ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                            >
                                <div className="mail-message-content" onClick={() => handleMessageClick(msg)}>
                                    <div className="message-header-row">
                                        <span className="message-from">{msg.from}</span>
                                        <span className="message-date">{msg.date}</span>
                                    </div>
                                    <div className="message-subject">{msg.subject}</div>
                                    <div className="message-preview">{msg.content.substring(0, 35) + '...'}</div>
                                </div>
                                <div className="message-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedMessageIds.has(msg.id)}
                                        onChange={() => toggleMessageSelection(msg.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Message Detail Panel */}
            {selectedMessage && (
                <aside className="message-detail">
                    <div className="detail-header">
                        <button className="close-detail" onClick={() => setSelectedMessage(null)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="detail-content">
                        <h2 className="detail-subject">{selectedMessage.subject}</h2>

                        <div className="thread-container">
                            {threadMessages.map((msg, index) => (
                                <div key={msg.id} className={`thread-message ${msg.id === selectedMessage.id ? 'active' : ''}`}>
                                    <div className="detail-sender">
                                        <div className="sender-avatar">{msg.from ? msg.from[0] : '?'}</div>
                                        <div className="sender-info">
                                            <div className="sender-name">
                                                {msg.from || 'Utilisateur inconnu'}
                                                {(msg.sender_role?.toLowerCase() === 'root' || msg.sender_role?.toLowerCase() === 'teacher') && (
                                                    <span className={`verified-badge ${msg.sender_role.toLowerCase()}`} title={`Compte Officiel (${msg.sender_role})`} style={{ marginLeft: '6px' }}>
                                                        <CheckCircle size={10} />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="sender-email">{msg.email}</div>

                                            {/* Recipients Display */}
                                            {Array.isArray(msg.recipients) && msg.recipients.length > 0 && (
                                                <div className="recipients-list">
                                                    {msg.recipients.filter(r => r.type === 'to').length > 0 && (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                                            <strong>À:</strong> {msg.recipients.filter(r => r.type === 'to').map((r, i, arr) => (
                                                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                                    {r.name || r.email}{i < arr.length - 1 ? ',' : ''}
                                                                    {(r.role?.toLowerCase() === 'root' || r.role?.toLowerCase() === 'teacher') && (
                                                                        <CheckCircle size={10} fill="var(--primary-green)" color="white" />
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {msg.recipients.filter(r => r.type === 'cc').length > 0 && (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                                                            <strong>Cc:</strong> {msg.recipients.filter(r => r.type === 'cc').map((r, i, arr) => (
                                                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                                    {r.name || r.email}{i < arr.length - 1 ? ',' : ''}
                                                                    {(r.role?.toLowerCase() === 'root' || r.role?.toLowerCase() === 'teacher') && (
                                                                        <CheckCircle size={10} fill="var(--primary-green)" color="white" />
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="detail-date">{msg.date}</div>
                                    </div>
                                    <div className="detail-body">
                                        <p>{msg.content}</p>
                                    </div>
                                    <div className="detail-actions">
                                        <button className="action-btn" onClick={() => handleReply(msg)}>
                                            <Reply size={16} /> Répondre
                                        </button>
                                        <button className="action-btn" onClick={() => handleReplyAll(msg)}>
                                            <ReplyAll size={16} /> Répondre à tous
                                        </button>
                                        <button className="action-btn" onClick={() => handleForward(msg)}>
                                            <Forward size={16} /> Transférer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            )}

            {/* Compose Modal */}
            {isComposeOpen && (
                <div
                    className={`compose-modal ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''}`}
                    onClick={() => isMinimized && setIsMinimized(false)}
                >
                    <div className="compose-header">
                        <h3>{isMinimized ? (composeData.subject || 'Nouveau message') : 'Nouveau message'}</h3>
                        <div className="compose-actions">
                            {!isMaximized && (
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMinimized(!isMinimized);
                                }}>
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                            )}
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsMaximized(!isMaximized);
                                setIsMinimized(false);
                            }}>
                                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleComposeClose();
                            }}>
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    {!isMinimized && (
                        <>
                            <div className="compose-body">
                                <div className="compose-field">
                                    <label>To:</label>
                                    <input
                                        type="email"
                                        placeholder="Recipients"
                                        value={composeData.to}
                                        onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                                    />
                                    <div className="cc-bcc-actions">
                                        <button type="button" onClick={() => addRecipient('cc')}>Cc</button>
                                        <button type="button" onClick={() => addRecipient('bcc')}>Bcc</button>
                                    </div>
                                </div>

                                {/* Dynamic CC Inputs */}
                                {composeData.cc.map((email, index) => (
                                    <div className="compose-field" key={`cc-${index}`}>
                                        <label>Cc:</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateRecipient('cc', index, e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            className="remove-recipient-btn"
                                            onClick={() => removeRecipient('cc', index)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Dynamic BCC Inputs */}
                                {composeData.bcc.map((email, index) => (
                                    <div className="compose-field" key={`bcc-${index}`}>
                                        <label>Bcc:</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => updateRecipient('bcc', index, e.target.value)}
                                            autoFocus
                                        />
                                        <button
                                            className="remove-recipient-btn"
                                            onClick={() => removeRecipient('bcc', index)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                <div className="compose-field">
                                    <label>Subject:</label>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={composeData.subject}
                                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    className="compose-message"
                                    placeholder="Compose your message..."
                                    value={composeData.body}
                                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="compose-footer">
                                <button className="send-btn" onClick={async () => {
                                    try {
                                        // 1. Extract all emails
                                        const toEmails = (composeData.to || '').split(',').map(e => e.trim()).filter(e => e !== '');
                                        const allRecipients = [...toEmails, ...composeData.cc, ...composeData.bcc];

                                        if (allRecipients.length === 0) {
                                            window.alert("Veuillez ajouter au moins un destinataire.");
                                            return;
                                        }

                                        // 2. Validate format and existence
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        const validEmails = allUsers.map(u => (u.email || '').toLowerCase());

                                        for (const email of allRecipients) {
                                            if (!emailRegex.test(email)) {
                                                window.alert(`L'adresse email "${email}" n'est pas valide.`);
                                                return;
                                            }
                                            if (!validEmails.includes(email.toLowerCase())) {
                                                window.alert(`"${email}" does not exist`);
                                                return;
                                            }
                                        }

                                        // 3. Send if all valid
                                        const sentMsg = await mailService.sendMessage(composeData);
                                        setMessages(prev => [...prev, sentMsg]);
                                        handleComposeClose();
                                    } catch (error) {
                                        console.error("Failed to send:", error);
                                        alert(error.message);
                                    }
                                }}>
                                    <Send size={16} /> Envoyer
                                </button>
                                <button className="cancel-btn" onClick={handleComposeClose}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className="backdrop" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Mail;
