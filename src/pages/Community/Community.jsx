import React, { useState, useEffect } from "react";
import './style.css';
import Logo from './assets/Logo-supnum.jpg';

// const socket = io.connect("http://localhost:5000");

// Changed to let to allow mutations for mocking interactions
let MOCK_MESSAGES = [
  {
    id: 117,
    user_id: 2,
    username: "brahim",
    email: "brahim.hmeida@supnum.mr",
    content: "",
    type: "video",
    media_url: "/uploads/1766916694-Chat_Group_App_-_Google_Chrome_2025-12-27_14-22-05.mp4",
    created_at: "2025-12-28 11:11:35",
    is_saved: false,
    comments: [
      { id: 59, user_id: 6, username: "24212", email: "24212@supnum.mr", content: "khh", created_at: "2025-12-28 14:27:12" },
      { id: 60, user_id: 6, username: "24212", email: "24212@supnum.mr", content: "kjh", created_at: "2025-12-28 14:27:28" },
      { id: 66, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "hghjkn", created_at: "2025-12-28 16:39:33" },
      { id: 67, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "ihkn", created_at: "2025-12-28 16:39:34" },
      { id: 74, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "jkl,", created_at: "2025-12-28 20:51:23" }
    ]
  },
  {
    id: 118,
    user_id: 2,
    username: "brahim",
    email: "brahim.hmeida@supnum.mr",
    content: "jeshfkj\r\n",
    type: "text",
    media_url: null,
    created_at: "2025-12-28 11:11:43",
    is_saved: false,
    comments: [
      { id: 57, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "fghgf", created_at: "2025-12-28 11:11:47" },
      { id: 58, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "edrg", created_at: "2025-12-28 11:11:49" },
      { id: 61, user_id: 6, username: "24212", email: "24212@supnum.mr", content: "lijluijk", created_at: "2025-12-28 14:27:32" },
      { id: 64, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "ilugyjk", created_at: "2025-12-28 16:39:15" },
      { id: 65, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "lkj", created_at: "2025-12-28 16:39:16" },
      { id: 68, user_id: 6, username: "24212", email: "24212@supnum.mr", content: "jhn", created_at: "2025-12-28 16:40:15" }
    ]
  },
  {
    id: 123,
    user_id: 2,
    username: "brahim",
    email: "brahim.hmeida@supnum.mr",
    content: "Test message from Antigravity",
    type: "text",
    media_url: null,
    created_at: "2025-12-31 18:36:59",
    is_saved: false,
    comments: []
  },
  {
    id: 120,
    user_id: 6,
    username: "24212",
    email: "24212@supnum.mr",
    content: "hjg\r\n",
    type: "text",
    media_url: null,
    created_at: "2025-12-28 15:37:56",
    is_saved: false,
    comments: [
      { id: 69, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "knh", created_at: "2025-12-28 16:40:31" },
      { id: 70, user_id: 2, username: "brahim", email: "brahim.hmeida@supnum.mr", content: "ijghjnm", created_at: "2025-12-28 16:40:32" }
    ]
  },
  {
    id: 127,
    user_id: 2,
    username: "brahim",
    email: "brahim.hmeida@supnum.mr",
    content: "",
    type: "image",
    media_url: "/uploads/1767207896-t__l__chargement.jpg",
    created_at: "2025-12-31 20:04:56",
    is_saved: false,
    comments: []
  },
  {
    id: 126,
    user_id: 2,
    username: "brahim",
    email: "brahim.hmeida@supnum.mr",
    content: "hfghfjuvm",
    type: "text",
    media_url: null,
    created_at: "2025-12-31 20:04:45",
    is_saved: false,
    comments: []
  }
];

let MOCK_NOTIFICATIONS = [
  { id: 1, user_id: 2, actor_id: 6, actor_name: "24212", message_id: 117, type: "comment", is_read: 1, created_at: "2025-12-28 14:27:12" },
  { id: 2, user_id: 2, actor_id: 6, actor_name: "24212", message_id: 117, type: "comment", is_read: 1, created_at: "2025-12-28 14:27:28" },
  { id: 3, user_id: 2, actor_id: 6, actor_name: "24212", message_id: 118, type: "comment", is_read: 1, created_at: "2025-12-28 14:27:32" },
  { id: 6, user_id: 2, actor_id: 6, actor_name: "24212", message_id: 118, type: "comment", is_read: 1, created_at: "2025-12-28 16:40:15" }
];

export default function Community({ currentUser: propUser, onLogout }) {
  const [activeSection, setActiveSection] = useState('Ccommunauté');
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Lifted state for comments expansion to control it via notifications
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComments = (msgId) => {
    setExpandedComments(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Use propUser if available, otherwise default (though auth should prevent this)
  const currentUser = propUser || { id: 1, username: 'Anonymous' };

  const sections = [
    { id: 'dashword', title: 'Communauté' },
    { id: 'archives', title: 'Archives (Saved)' },
  ];

  // Ref for scrolling
  const messagesEndRef = React.useRef(null);
  const scrollContainerRef = React.useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // ONLY scroll to bottom on initial page load - then never auto-scroll again
  React.useLayoutEffect(() => {
    if (isFirstLoad && messages.length > 0) {
      // Scroll to bottom instantly on first load
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  // Scroll to bottom whenever user changes section (navigates to different page)
  useEffect(() => {
    if (!isFirstLoad && filteredMessages.length > 0) {
      // Scroll to show latest message when changing sections
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]); // Only trigger on section change, not on every message update

  const fetchMessages = React.useCallback(async (query = '', section = 'dashword') => {
    try {
      // Mock Data Implementation
      let data = [...MOCK_MESSAGES];

      if (query) {
        const lowerQuery = query.toLowerCase();
        data = data.filter(msg =>
          (msg.content && msg.content.toLowerCase().includes(lowerQuery)) ||
          (msg.username && msg.username.toLowerCase().includes(lowerQuery))
        );
      }

      if (section === 'archives') {
        data = data.filter(msg => msg.is_saved);
      }

      // Simulate network delay
      // await new Promise(resolve => setTimeout(resolve, 500));

      setMessages(data);
      setFilteredMessages(data);

      /* 
      // Original API Call
      let url = `http://localhost:8000/api/messages?user_id=${currentUser.id}`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (section === 'archives') url += `&only_archived=true`;

      const res = await fetch(url);
      const data = await res.json();
      setMessages(data);
      setFilteredMessages(data); // Backend handles filtering now
      */
    } catch (err) {
      console.error(err);
    }
  }, [currentUser.id]);

  const fetchNotifications = React.useCallback(async () => {
    try {
      // Mock Data Implementation
      setNotifications(MOCK_NOTIFICATIONS);

      /*
      // Original API Call
      const res = await fetch(`http://localhost:8000/api/notifications?user_id=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
      */
    } catch (err) { console.error(err); }
  }, [currentUser.id]);

  // Polling with safety against overlapping requests
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const poll = async () => {
      if (!isMounted) return;
      // Skip polling if we are currently sending a message (especially large files)
      if (!isSending) {
        await fetchMessages(searchQuery, activeSection);
        await fetchNotifications();
      }
      if (isMounted) {
        timeoutId = setTimeout(poll, 3000); // Wait 3s AFTER fetch completes
      }
    };

    poll(); // Start polling

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, isSending, activeSection, fetchMessages, fetchNotifications]);



  const handleNotificationClick = async (notif) => {
    // Mark as read
    if (!notif.is_read) {
      try {
        await fetch('http://localhost:8000/api/notifications/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: notif.id })
        });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n));
      } catch (e) { console.error(e); }
    }

    setShowNotifications(false);

    // Navigate to message
    if (activeSection !== 'dashword') setActiveSection('dashword');

    // Expand comments for this message so user sees it
    setExpandedComments(prev => ({ ...prev, [notif.message_id]: true }));

    // Scroll after slight delay for render
    setTimeout(() => {
      const msgEl = document.getElementById(`msg-${notif.message_id}`);
      if (msgEl) {
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        msgEl.style.transition = 'background 0.5s';
        msgEl.style.background = '#e7f3ff'; // Highlight
        setTimeout(() => msgEl.style.background = '', 2000);
      }
    }, 300);
  };

  const handleToggleArchive = async (messageId) => {
    try {
      // Mock Implementation
      const msgIndex = MOCK_MESSAGES.findIndex(m => m.id === messageId);
      if (msgIndex !== -1) {
        MOCK_MESSAGES[msgIndex].is_saved = !MOCK_MESSAGES[msgIndex].is_saved;

        // Update local state
        const updatedMessages = messages.map(m => {
          if (m.id === messageId) {
            return { ...m, is_archived: !m.is_archived }; // Note: using is_archived/is_saved inconsistently in legacy code, fixing to match mock
          }
          return m;
        });

        if (activeSection === 'archives') {
          setFilteredMessages(updatedMessages.filter(m => m.is_saved)); // Use is_saved to match mock
          setMessages(updatedMessages.filter(m => m.is_saved));
        } else {
          setMessages(updatedMessages);
          setFilteredMessages(updatedMessages);
        }
      }

      /*
      // Original API Call
      // Optimistic update
      const updatedMessages = messages.map(m => {
        if (m.id === messageId) {
          return { ...m, is_archived: !m.is_archived };
        }
        return m;
      });

      // ... (filtering logic) ...

      const res = await fetch('http://localhost:8000/api/archives/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, message_id: messageId })
      });

      if (!res.ok) {
        // Revert on error? For now just log
        console.error('Failed to toggle archive');
        fetchMessages(searchQuery, activeSection);
      }
      */
    } catch (err) {
      console.error(err);
    }
  };



  const uploadFileInChunks = async (file) => {
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = Date.now().toString(36) + Math.random().toString(36).substr(2); // Unique ID for this upload session

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

      try {
        const res = await fetch('http://localhost:8000/api/upload/chunk', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Chunk upload failed');
        }

        const data = await res.json();

        // Calculate progress percentage
        const percent = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setUploadProgress(percent);

        if (data.status === 'done') {
          return { media_url: data.media_url, type: data.type };
        }
      } catch (err) {
        console.error('Upload error:', err);
        throw err;
      }
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || isSending) return;

    setIsSending(true); // Start loading

    let mediaUrl = null;
    let mediaType = null;
    setUploadProgress(0);

    try {
      console.log('Sending message...', currentUser.id, newMessage); // Debug

      // Mock Upload
      if (selectedFile) {
        // Simulate upload delay
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }
        mediaUrl = URL.createObjectURL(selectedFile);
        mediaType = selectedFile.type.startsWith('image') ? 'image' : (selectedFile.type.startsWith('video') ? 'video' : 'file');
      }

      // Mock Send
      const newMsg = {
        id: Date.now(),
        user_id: currentUser.id,
        username: currentUser.username || "Me",
        email: currentUser.email || "me@example.com",
        content: newMessage,
        type: mediaType || 'text',
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
        is_saved: false,
        comments: []
      };

      MOCK_MESSAGES.unshift(newMsg); // Add to top

      setNewMessage('');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      setActiveSection('dashword');
      await fetchMessages(searchQuery);

      /*
      // 1. Upload file if exists
      if (selectedFile) {
        try {
          // For very small files we could skip chunking, but for consistency we use it for all
          // or at least for files > 1MB. Let's use it for all to ensure "chunk upload" requirement is met.
          const uploadResult = await uploadFileInChunks(selectedFile);
          mediaUrl = uploadResult.media_url;
          mediaType = uploadResult.type;
        } catch (uploadErr) {
          alert('File upload failed: ' + uploadErr.message);
          setIsSending(false);
          return;
        }
      }

      // 2. Send Message Data
      const formData = new FormData();
      formData.append('user_id', currentUser.id);
      formData.append('content', newMessage);
      if (mediaUrl) {
        formData.append('media_url', mediaUrl);
        formData.append('media_type', mediaType);
      } else if (selectedFile) {
        // If chunk upload failed or wasn't used for some reason (fallback), 
        // we could send 'file' here, but we are designing this to REPLACE 'file' sending.
        // So we do NOT append 'file' if we have mediaUrl.
      }

      const res = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        console.log('Message sent successfully!');
        setNewMessage('');
        setSelectedFile(null);

        // Clear file input value physically
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';

        // Switch to dashword if in filtered view so user sees their message
        // Always ensure we are on dashword (though we only have one section now)
        setActiveSection('dashword');

        await fetchMessages(searchQuery); // Refresh list immediately
      } else {
        const errText = await res.text();
        console.error('Send failed raw:', errText);
        try {
          const err = JSON.parse(errText);
          console.error('Send failed JSON:', err);
          alert('Failed to send message: ' + (err.error || 'Unknown error'));
        } catch (e) {
          alert('Failed to send message: ' + errText);
        }
      }
      */
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error sending message.');
    } finally {
      setUploadProgress(0);
      setIsSending(false); // Stop loading
    }
  };

  const handleSendComment = async (messageId) => {
    const content = commentInputs[messageId];
    if (!content || !content.trim()) return;

    try {
      // Mock Implementation
      const msgIndex = MOCK_MESSAGES.findIndex(m => m.id === messageId);
      if (msgIndex !== -1) {
        const newComment = {
          id: Date.now(),
          message_id: messageId,
          user_id: currentUser.id,
          username: currentUser.username || "Me",
          email: currentUser.email || "me@example.com",
          content: content,
          created_at: new Date().toISOString()
        };
        MOCK_MESSAGES[msgIndex].comments.push(newComment);

        setCommentInputs({ ...commentInputs, [messageId]: '' });
        fetchMessages(searchQuery);
      }

      /*
      const res = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: messageId,
          user_id: currentUser.id,
          content: content
        }),
      });
      if (res.ok) {
        setCommentInputs({ ...commentInputs, [messageId]: '' });
        fetchMessages(searchQuery); // Refresh list
      }
      */
    } catch (err) {
      console.error(err);
    }
  };

  // Render main content
  return (
    <React.Fragment>
      <nav className="nav_left">
        <div className="sidebar-header">
          <h1>facechat</h1>
          <div style={{ position: 'relative' }}>
            <button className="notif-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {notifications.some(n => !n.is_read) && (
                <span className="notif-badge">{notifications.filter(n => !n.is_read).length}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notif-dropdown">
                {notifications.length === 0 ? <div style={{ padding: '10px' }}>No notifications</div> : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.is_read ? 'unread' : ''}`} onClick={() => handleNotificationClick(n)}>
                      <strong>{n.actor_name}</strong> commented on your {n.message_type || 'post'}.
                      <div style={{ fontSize: '11px', color: '#888' }}>{new Date(n.created_at).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map(sec => (
            <a
              href={`#${sec.id}`}
              key={sec.id}
              className={activeSection === sec.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(sec.id);
              }}
            >
              {sec.title}
            </a>
          ))}
        </div>
      </nav>

      <nav>
        <div className="nave_top">
          <div className="logo">
            <span><img src={Logo} alt="logo"></img></span>
            <h2>Instiut Supérieur de Numerique</h2>
          </div>
          <div className="recherche_bare">
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="bar_recherche"
                placeholder="Search in group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingRight: searchQuery ? '30px' : '10px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchMessages(''); // Immediate fetch on clear
                  }}
                  style={{
                    position: 'absolute',
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <button id="searchButton" type="button" onClick={() => fetchMessages(searchQuery)}>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#333333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="logout-button"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      <section id="dashword">
        <div className="dashword-content">

          <MessageList
            items={filteredMessages}
            currentUser={currentUser}
            commentInputs={commentInputs}
            setCommentInputs={setCommentInputs}
            handleSendComment={handleSendComment}
            handleToggleArchive={handleToggleArchive}
            scrollContainerRef={scrollContainerRef}
            messagesEndRef={messagesEndRef}
            expandedComments={expandedComments}
            toggleComments={toggleComments}
          />

        </div>
      </section>

      {/* Message Bar - Always visible */}
      <div className="bar_mes">
        <div className="file-upload-wrapper">
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button id="enleve" type="button" onClick={() => document.getElementById('file-input').click()}>
            <span className="enlevee">
              <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g fill={selectedFile ? "#007bff" : "#333333"}>
                  <path d="M4.24 5.8a.75.75 0 001.06-.04l1.95-2.1v6.59a.75.75 0 001.5 0V3.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.101.001L4.2 4.74a.75.75 0 00.04 1.06z" />
                  <path d="M1.75 9a.75.75 0 01.75.75v3c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75v-3a.75.75 0 011.5 0v3A2.25 2.25 0 0112.75 15h-9.5A2.25 2.25 0 011 12.75v-3A.75.75 0 011.75 9z" />
                </g>
              </svg>
            </span>
          </button>
          {selectedFile && <span className="file-name">{selectedFile.name}</span>}
        </div>

        <textarea
          name="messages"
          id="mes"
          cols="30"
          rows="3"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>

        <button className="envoyer" type="button" onClick={handleSendMessage} disabled={isSending} style={{ opacity: isSending ? 0.6 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}>
          <span className="arrow">
            {isSending ? (
              <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '20px', height: '20px', border: '2px solid #ccc', borderTop: '2px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <span style={{ position: 'absolute', top: '24px', left: '-10px', fontSize: '10px', width: '50px' }}>{uploadProgress}%</span>
                )}
              </div>
            ) : (
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>
      </div>

    </React.Fragment >
  );
}

// Defined OUTSIDE to prevent remounting - FACEBOOK STYLE COMMENTS
const MessageList = ({ items, currentUser, commentInputs, setCommentInputs, handleSendComment, handleToggleArchive, scrollContainerRef, messagesEndRef, expandedComments, toggleComments }) => {
  const INITIAL_COMMENTS_SHOW = 2;
  const ADMIN_USER_ID = 24212; // Admin user ID

  // State for managing open menu for each post
  const [openMenuId, setOpenMenuId] = React.useState(null);

  // Helper to get display name from email
  const getDisplayName = (email) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  // Handle menu toggle
  const toggleMenu = (msgId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === msgId ? null : msgId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Handle delete post
  const handleDeletePost = async (msgId, e) => {
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/messages/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message_id: msgId,
          user_id: currentUser.id
        })
      });

      if (res.ok) {
        // Reload the page or refetch messages
        window.location.reload();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete post');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting post');
    }

    setOpenMenuId(null);
  };

  // Check if user can delete a message
  const canDelete = (msg) => {
    return msg.user_id === currentUser.id || currentUser.role === 'admin';
  };

  return (
    <div className="messages-container" ref={scrollContainerRef} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {items.length === 0 && <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No items found.</p>}
      {items.map(msg => {
        const isOwnMessage = msg.user_id === currentUser.id;
        const comments = msg.comments || [];
        const isExpanded = expandedComments[msg.id];
        const displayedComments = isExpanded ? comments : comments.slice(-INITIAL_COMMENTS_SHOW);
        const hasMoreComments = comments.length > INITIAL_COMMENTS_SHOW;
        const hiddenCount = comments.length - INITIAL_COMMENTS_SHOW;
        const isMenuOpen = openMenuId === msg.id;

        return (
          <div key={msg.id} id={`msg-${msg.id}`} className={`message-item ${isOwnMessage ? 'message-me' : 'message-others'}`}>
            <div className="message-header">
              <strong>{msg.email ? getDisplayName(msg.email) : (isOwnMessage ? getDisplayName(currentUser.email) : msg.username)}</strong>
              <span>{new Date(msg.created_at).toLocaleString()}</span>

              {/* Three-Dot Menu Button */}
              <button
                className="post-menu-btn"
                onClick={(e) => toggleMenu(msg.id, e)}
                title="Post options"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="post-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                  {/* Save/Archive Option */}
                  <button
                    className={`post-menu-item ${msg.is_archived ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleArchive(msg.id);
                      setOpenMenuId(null);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill={msg.is_archived ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V21L12 17L5 21V7.8Z" />
                    </svg>
                    {msg.is_archived ? 'Unsave post' : 'Save post'}
                  </button>

                  {/* Delete Option - Only if user owns the post or is admin */}
                  {canDelete(msg) && (
                    <button
                      className="post-menu-item delete-item"
                      onClick={(e) => handleDeletePost(msg.id, e)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Delete post
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="message-content">
              {msg.content && <p>{msg.content}</p>}
              {msg.type === 'image' && <img src={`http://localhost:8000${msg.media_url}`} alt="upload" className="msg-media" />}
              {msg.type === 'video' && <video src={`http://localhost:8000${msg.media_url}`} controls className="msg-media" />}
              {msg.type === 'file' && <a href={`http://localhost:8000${msg.media_url}`} target="_blank" rel="noopener noreferrer">Download File</a>}
            </div>

            <div className="comments-section">
              {hasMoreComments && !isExpanded && (
                <button
                  className="show-more-comments"
                  onClick={() => toggleComments(msg.id)}
                >
                  View {hiddenCount} more {hiddenCount === 1 ? 'comment' : 'comments'}
                </button>
              )}

              {displayedComments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div>
                    <div>
                      <strong>{comment.email ? getDisplayName(comment.email) : comment.username}</strong>
                      <span className="comment-text">{comment.content}</span>
                    </div>
                    <span className="comment-time">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}

              {hasMoreComments && isExpanded && (
                <button
                  className="show-more-comments"
                  onClick={() => toggleComments(msg.id)}
                >
                  Show less
                </button>
              )}

              <div className={`add-comment ${commentInputs[msg.id] ? 'has-content' : ''}`}>
                <textarea
                  placeholder="Write a comment..."
                  value={commentInputs[msg.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [msg.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendComment(msg.id);
                    }
                  }}
                />
                <button onClick={() => handleSendComment(msg.id)}>➤</button>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
