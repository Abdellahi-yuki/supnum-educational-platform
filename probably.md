# Project Handover: SupNum Platform

## Overview
This is a unified messaging and collaboration platform for educational institutions, built with React (frontend) and Pure PHP (backend). The platform consists of three main modules: **Mail**, **Community**, and **Archive**.

## Current Project State

### Completed Features
- ✅ **Global Header Component**: Unified navigation across all modules
- ✅ **Mail Module (Frontend)**: Complete UI with advanced threading and branching logic
- ✅ **Community Module (Frontend)**: Chat interface with message types and comments
- ✅ **Archive Module (Frontend)**: Semester/subject/material browsing interface

### In Progress
- ⚠️ **Backend Implementation**: API services need to be built (see `APIs.md`)
- ⚠️ **Authentication**: Login/register flows need integration

### Not Started
- ❌ **Attachment Handling**: Upload/download for Mail and Archive
- ❌ **Real-time Features**: WebSocket/polling for Community chat
- ❌ **Notifications**: System-wide notification center

## Critical Architectural Decisions

### Mail Threading & Branching Logic
The Mail module implements a **sophisticated branching conversation system** that differs from traditional email threading:

#### 1. Inbox Filtering (Leaf Nodes Only)
- The inbox displays only the **latest message** (leaf node) from each conversation branch
- **Special Rule**: If a user replies to an inbox message (creating a "sent" leaf), that sent message appears in the inbox IF it belongs to a thread that started in the inbox
- This keeps the inbox clean while maintaining conversation context

**Example**:
```
O1 (inbox) -> O2 (sent) -> A1 (inbox) -> A2 (sent)
                        -> B1 (inbox)

Inbox shows: A2, B1 (not O1, O2, or A1)
```

#### 2. Thread View (Ancestor Path / Branch Isolation)
- When opening a message, users see ONLY the **direct path** from the root to that message
- Parallel branches are hidden to avoid confusion
- Users can reply to ANY message in the thread, creating new branches

**Example**:
```
Click A2 → Shows: O1 -> O2 -> A1 -> A2 (B1 is hidden)
Click B1 → Shows: O1 -> O2 -> B1 (A1, A2 are hidden)
```

#### 3. Reply Actions on All Messages
- Every message in the thread view has Reply/Reply All/Forward buttons
- Replying to an older message creates a new branch from that point
- This enables flexible, tree-like conversation structures

### Frontend Implementation Details

#### Mail Component (`/main/src/pages/Mail/Mail.jsx`)
**Key Functions**:
- `filteredMessages`: Implements leaf-node filtering with inbox ancestry check
- `getThreadPath`: Traverses parent_id chain to build ancestor array
- `handleReply/handleReplyAll/handleForward`: Pre-fills compose modal with parent_id for threading

**State Management**:
- `composeData.cc` and `composeData.bcc` are **arrays** of email strings
- When sending, join arrays into comma-separated strings for API

**Mock Data**:
- Contains branching scenario (O1->O2->(A1->A2)+(B1)) for testing
- Replace with API calls during backend integration

#### CSS Architecture
- **Modular CSS**: Each page has its own CSS file (e.g., `Mail.css`, `Community.css`)
- **CSS Registry**: See `CSS_REGISTRY.md` to avoid class name conflicts
- **Global Styles**: Minimal global styles in `App.css` (mainly header padding)

## Database Schema

### Key Tables
- `mail_messages`: Stores all messages with `parent_id` for threading
- `mail_recipients`: Many-to-many relationship for To/CC/BCC
- `mail_message_labels`: Many-to-many for inbox/sent/starred/trash/spam
- `mail_attachments`: File metadata for message attachments

**Important**: The `parent_id` field is central to threading. A `parent_id` of `0` indicates a root message.

## API Specifications

See `APIs.md` for complete endpoint documentation. Key points:

### Mail Service
- `GET /mail/messages?label=inbox`: Must implement leaf-node filtering logic
- `GET /mail/messages/:id/thread`: Must return ancestor path (not full tree)
- `POST /mail/messages`: Accepts comma-separated `to`, `cc`, `bcc` strings

### Authentication
- JWT-based authentication
- Token stored in localStorage (frontend)
- All API requests include `Authorization: Bearer <token>` header

## Development Workflow

### File Structure
```
main/
├── src/
│   ├── components/       # Shared components (Header)
│   ├── pages/            # Module pages (Mail, Community, Archive)
│   │   ├── Mail/
│   │   │   ├── Mail.jsx
│   │   │   └── Mail.css
│   │   └── ...
│   ├── App.jsx           # Main router
│   └── App.css           # Global styles
├── APIs.md               # API documentation
├── main.sql              # Database schema
├── README_DB.md          # Database documentation
├── INSTRUCTIONS.md       # Development guidelines
└── CSS_REGISTRY.md       # CSS class tracking
```

### Important Files
1. **`APIs.md`**: Source of truth for backend contracts
2. **`main.sql`**: Database schema with relationships
3. **`INSTRUCTIONS.md`**: Coding standards and project structure
4. **`CSS_REGISTRY.md`**: Prevents CSS class conflicts

## Next Steps (Priority Order)

### 1. Backend API Implementation
- [ ] Set up PHP routing (single entry point at `api/index.php`)
- [ ] Implement authentication endpoints (`/auth/login`, `/auth/register`)
- [ ] Implement Mail service with threading logic
- [ ] Implement Community service (see `APIs.md` for endpoints)
- [ ] Implement Archive service (currently using hardcoded data)

### 2. Frontend-Backend Integration
- [ ] Create API service layer (`/src/services/api.js`)
- [ ] Create API service layer (`/src/services/api.js`)
- [ ] Replace mock data in Mail.jsx and Community.jsx with API calls
- [ ] Implement error handling and loading states
- [ ] Implement error handling and loading states
- [ ] Add authentication flow (login/logout)

### 3. Advanced Features
- [ ] File upload/download for attachments
- [ ] Real-time chat updates (polling or WebSocket)
- [ ] Notification system
- [ ] User search autocomplete for compose modal

### 4. Testing & Deployment
- [ ] Test branching logic with real data
- [ ] Test edge cases (deep threads, many branches)
- [ ] Performance optimization (pagination, lazy loading)
- [ ] Production deployment setup

## Known Issues & Considerations

### Frontend
- **Search**: Currently searches all fields; consider backend-powered search for large datasets
- **Pagination**: Not implemented; will be needed for production
- **Mobile**: Basic responsive design exists but needs refinement

### Backend (To Be Implemented)
- **Leaf Node Query**: Requires efficient SQL to identify messages that are NOT parent_id of any other message
- **Ancestor Path Query**: Recursive CTE or iterative query to traverse parent_id chain
- **Performance**: Index `parent_id`, `user_id`, and label junction tables

### Security
- **Input Validation**: Sanitize all user inputs (especially email addresses)
- **SQL Injection**: Use prepared statements for all queries
- **File Uploads**: Validate file types and sizes for attachments
- **XSS Protection**: Escape HTML in message content

## Contact & Questions

If you have questions about architectural decisions, especially the Mail threading logic, refer to:
1. This document (`probably.md`)
2. `APIs.md` for backend contracts
3. `Mail.jsx` lines 174-271 for frontend implementation
4. `Community.jsx` for chat implementation (currently using mock data)
5. `Archive.jsx` for archive implementation (currently using hardcoded data)
6. The conversation history with the previous developer

Good luck! 🚀
