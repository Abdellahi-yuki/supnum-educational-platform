import { API_BASE_URL } from '../apiConfig';

// Toggle this to false when backend is ready
const USE_MOCK = false;

// Mock Data
const MOCK_MESSAGES = [
    // ... (keep mock data for reference if needed, or remove)
];

const mailService = {
    /**
     * Fetch messages based on label
     * @param {string} label - inbox, sent, starred, etc.
     * @returns {Promise<Array>}
     */
    fetchMessages: async (label = 'inbox') => {
        if (USE_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve([...MOCK_MESSAGES]);
                }, 500);
            });
        }

        // Real API call
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 3; // Fallback to 3 for testing
        const response = await fetch(`${API_BASE_URL}/mail/messages?label=${label}&user_id=${userId}`);

        if (!response.ok) {
            let errorMessage = 'Failed to fetch messages';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // Not JSON
            }
            throw new Error(errorMessage);
        }
        return response.json();
    },

    /**
     * Send a new message
     * @param {Object} data - { to, cc, bcc, subject, body, parentId }
     * @returns {Promise<Object>}
     */
    sendMessage: async (data) => {
        if (USE_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newMessage = {
                        id: Date.now(),
                        from: 'Me', // Simulated current user
                        email: 'me@supnum.mr',
                        subject: data.subject,
                        content: data.body,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        isRead: true,
                        isStarred: false,
                        labels: ['sent'],
                        parentId: data.parentId || 0
                    };
                    MOCK_MESSAGES.push(newMessage);
                    resolve(newMessage);
                }, 800);
            });
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 3;
        const response = await fetch(`${API_BASE_URL}/mail/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, sender_id: userId })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to send message');
        }
        return result;
    },

    /**
     * Mark messages as read/unread/starred/etc
     */
    updateMessage: async (id, updates) => {
        if (USE_MOCK) {
            return new Promise((resolve) => {
                const index = MOCK_MESSAGES.findIndex(m => m.id === id);
                if (index !== -1) {
                    MOCK_MESSAGES[index] = { ...MOCK_MESSAGES[index], ...updates };
                }
                resolve(MOCK_MESSAGES[index]);
            });
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 3;
        const response = await fetch(`${API_BASE_URL}/mail/messages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updates, user_id: userId })
        });
        if (!response.ok) throw new Error('Failed to update message');
        return response.json();
    },

    /**
     * Fetch all users for email validation
     */
    fetchUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/community_members.php`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    }
};

export default mailService;
