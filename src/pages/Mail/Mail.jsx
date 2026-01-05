import React, { useState, useMemo } from 'react';
import './Mail.css';

const Mail = () => {
    const [selectedLabel, setSelectedLabel] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Compose state to handle pre-filling data for replies/forwards
    const [composeData, setComposeData] = useState({
        to: '',
        cc: [],
        bcc: [],
        subject: '',
        body: '',
        parentId: null
    });

    // Enhanced mock data with labels support and branching
    const [messages, setMessages] = useState([
        {
            id: 1,
            from: 'Root Admin',
            email: 'root@supnum.mr',
            subject: 'Welcome to SupNum Mail',
            content: 'Welcome to the new unified messaging platform...',
            date: 'Jan 1',
            isRead: false,
            isStarred: false,
            labels: ['inbox'],
            parentId: 0
        },
        {
            id: 2,
            from: 'Brahim Hmeida',
            email: 'brahim.hmeida@supnum.mr',
            subject: 'Project Update',
            content: 'Here is the latest update on the project progress...',
            date: 'Jan 1',
            isRead: true,
            isStarred: true,
            labels: ['inbox', 'starred'],
            parentId: 0
        },
        {
            id: 3,
            from: 'Spam Bot',
            email: 'spam@bot.com',
            subject: 'You won a prize!',
            content: 'Click here to claim your prize...',
            date: 'Jan 2',
            isRead: false,
            isStarred: false,
            labels: ['spam'],
            parentId: 0
        },
        // Thread Example
        {
            id: 4,
            from: 'Me',
            email: 'me@supnum.mr',
            subject: 'Re: Project Update',
            content: 'Thanks for the update, Brahim.',
            date: 'Jan 1',
            isRead: true,
            isStarred: false,
            labels: ['sent'],
            parentId: 2
        },
        {
            id: 5,
            from: 'Brahim Hmeida',
            email: 'brahim.hmeida@supnum.mr',
            subject: 'Re: Project Update',
            content: 'You are welcome! Let me know if you need anything else.',
            date: 'Jan 2',
            isRead: false,
            isStarred: false,
            labels: ['inbox'],
            parentId: 4
        },
        // Branching Example: O1 -> O2 -> (A1->A2) + (B1)
        {
            id: 10,
            from: 'Origin Sender',
            email: 'origin@supnum.mr',
            subject: 'Branching Discussion',
            content: 'O1: Starting the discussion.',
            date: 'Jan 1',
            isRead: true,
            isStarred: false,
            labels: ['inbox'],
            parentId: 0
        },
        {
            id: 11,
            from: 'Me',
            email: 'me@supnum.mr',
            subject: 'Re: Branching Discussion',
            content: 'O2: My reply to O1.',
            date: 'Jan 2',
            isRead: true,
            isStarred: false,
            labels: ['sent'],
            parentId: 10
        },
        // Branch A
        {
            id: 12,
            from: 'Alice',
            email: 'alice@supnum.mr',
            subject: 'Re: Branching Discussion',
            content: 'A1: Alice replying to O2.',
            date: 'Jan 3',
            isRead: true,
            isStarred: false,
            labels: ['inbox'],
            parentId: 11
        },
        {
            id: 13,
            from: 'Me',
            email: 'me@supnum.mr',
            subject: 'Re: Branching Discussion',
            content: 'A2: Me replying to Alice (Leaf of Branch A).',
            date: 'Jan 4',
            isRead: true,
            isStarred: false,
            labels: ['sent'],
            parentId: 12
        },
        // Branch B
        {
            id: 14,
            from: 'Bob',
            email: 'bob@supnum.mr',
            subject: 'Re: Branching Discussion',
            content: 'B1: Bob replying to O2 separately (Leaf of Branch B).',
            date: 'Jan 3',
            isRead: false,
            isStarred: true,
            labels: ['inbox'],
            parentId: 11
        }
    ]);

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
        // 1. Identify all parent IDs
        const parentIds = new Set(messages.map(m => m.parentId));

        // Helper to check if any ancestor has a specific label
        const hasAncestorWithLabel = (startMsg, label) => {
            let current = messages.find(m => m.id === startMsg.parentId);
            while (current) {
                if (current.labels.includes(label)) return true;
                if (current.parentId === 0) break;
                current = messages.find(m => m.id === current.parentId);
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
            const isLeaf = !parentIds.has(msg.id);

            if (!matchesSearch || !isLeaf) return false;

            // 4. Label Logic
            if (selectedLabel === 'inbox') {
                // Show if:
                // a) Message itself is in inbox
                // b) Message is 'sent' (reply) BUT it belongs to a thread that started in inbox (ancestor has 'inbox')
                const isInbox = msg.labels.includes('inbox');
                const isSentReplyToInbox = msg.labels.includes('sent') && hasAncestorWithLabel(msg, 'inbox');

                return isInbox || isSentReplyToInbox;
            } else {
                // Standard label filtering for other views (sent, starred, etc.)
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
    const toggleLabelForSelected = (label) => {
        const updatedMessages = messages.map(msg => {
            if (selectedMessageIds.has(msg.id)) {
                const newLabels = msg.labels.includes(label)
                    ? msg.labels.filter(l => l !== label)
                    : [...msg.labels, label];
                return { ...msg, labels: newLabels };
            }
            return msg;
        });
        setMessages(updatedMessages);
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
        setComposeData({ to: '', cc: [], bcc: [], subject: '', body: '', parentId: null });
    };

    const handleMessageClick = (msg) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            const updatedMessages = messages.map(m =>
                m.id === msg.id ? { ...m, isRead: true } : m
            );
            setMessages(updatedMessages);
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
                    {['inbox', 'starred', 'sent', 'spam', 'trash'].map(label => (
                        <button
                            key={label}
                            className={`nav-item ${selectedLabel === label ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedLabel(label);
                                setSelectedMessage(null);
                                setSelectedMessageIds(new Set());
                            }}
                        >
                            <i className={`fas fa-${label === 'inbox' ? 'inbox' : label === 'starred' ? 'star' : label === 'sent' ? 'paper-plane' : label === 'spam' ? 'triangle-exclamation' : 'trash'}`}></i>
                            <span style={{ textTransform: 'capitalize' }}>{label}</span>
                            {label === 'inbox' && <span className="count">{messages.filter(m => m.labels.includes('inbox') && !m.isRead).length}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-compose">
                    <button className="compose-btn" onClick={() => {
                        setComposeData({ to: '', subject: '', body: '', parentId: null });
                        setIsComposeOpen(true);
                    }}>
                        <i className="fas fa-plus"></i> Compose
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
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search mail"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                </header>

                {/* Selection Toolbar (Conditional) */}
                {selectedMessageIds.size > 0 && (
                    <div className="selection-toolbar" style={{ padding: '10px 16px', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#5f6368', marginRight: '8px' }}>{selectedMessageIds.size} selected</span>
                        {availableLabels.map(item => (
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
                                <i className={item.icon}></i> {item.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedMessageIds(new Set())}
                            style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: '#5f6368' }}
                        >
                            <i className="fas fa-times"></i>
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
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="detail-content">
                        <h2 className="detail-subject">{selectedMessage.subject}</h2>

                        <div className="thread-container">
                            {threadMessages.map((msg, index) => (
                                <div key={msg.id} className={`thread-message ${msg.id === selectedMessage.id ? 'active' : ''}`}>
                                    <div className="detail-sender">
                                        <div className="sender-avatar">{msg.from[0]}</div>
                                        <div className="sender-info">
                                            <div className="sender-name">{msg.from}</div>
                                            <div className="sender-email">{msg.email}</div>
                                        </div>
                                        <div className="detail-date">{msg.date}</div>
                                    </div>
                                    <div className="detail-body">
                                        <p>{msg.content}</p>
                                    </div>
                                    <div className="detail-actions">
                                        <button className="action-btn" onClick={() => handleReply(msg)}>
                                            <i className="fas fa-reply"></i> Reply
                                        </button>
                                        <button className="action-btn" onClick={() => handleReplyAll(msg)}>
                                            <i className="fas fa-reply-all"></i> Reply All
                                        </button>
                                        <button className="action-btn" onClick={() => handleForward(msg)}>
                                            <i className="fas fa-forward"></i> Forward
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
                    className={`compose-modal ${isMinimized ? 'minimized' : ''}`}
                    onClick={() => isMinimized && setIsMinimized(false)}
                >
                    <div className="compose-header">
                        <h3>{isMinimized ? (composeData.subject || 'New Message') : 'New Message'}</h3>
                        <div className="compose-actions">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setIsMinimized(!isMinimized);
                            }}>
                                <i className={`fas fa-${isMinimized ? 'plus' : 'minus'}`}></i>
                            </button>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                handleComposeClose();
                            }}>
                                <i className="fas fa-times"></i>
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
                                            <i className="fas fa-times"></i>
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
                                            <i className="fas fa-times"></i>
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
                                <button className="send-btn" onClick={() => {
                                    console.log('Sending message:', composeData);
                                    handleComposeClose();
                                }}>
                                    <i className="fas fa-paper-plane"></i> Send
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
