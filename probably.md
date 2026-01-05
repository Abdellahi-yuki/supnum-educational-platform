# Project Handover: SupNum Educational Platform

## Overview
This is a unified messaging and collaboration platform for educational institutions, built with React (frontend) and PHP (backend). The platform consists of four main modules: **Dashboard**, **Mail**, **Community**, and **Archive**, all consolidated into a single React SPA.

## Recent Major Changes (January 2026)

### ✅ Project Consolidation Completed
- **Unified Frontend**: All modules (`archive`, `community`, `dashboard`) consolidated into `main/src/pages/`
- **Separated Backend**: PHP backend moved to root `backend/` directory (outside of `main/`)
- **Single Entry Point**: Application runs from `main/` with unified routing in `src/App.jsx`
- **Centralized API Config**: `main/src/apiConfig.js` manages `API_BASE_URL` for all modules

### ✅ Authentication Refactoring
- **Dedicated Auth Directory**: Created `src/pages/Auth/` containing:
  - `Login.jsx` - User login with email/password
  - `Register.jsx` - New user registration with email verification
  - `Verify.jsx` - Email verification code entry
- **Top-Level Routes**: Auth pages accessible at `/login`, `/register`, `/verify`
- **User State Management**: Implemented in `App.jsx` with `localStorage` persistence
- **Session Handling**: `handleLogin` function updates both state and localStorage

### ✅ Dashboard Consolidation
- **Single Component**: Consolidated `Dashboard/App.jsx` into `Dashboard/Dashboard.jsx`
- **Removed Redundancy**: Eliminated duplicate auth routes (now handled by main `App.jsx`)
- **CSS Restored**: Fixed missing `index.css` import

### ✅ Community Module Cleanup
- **Removed Legacy Files**: Deleted `LoginPage.jsx`, `LoginPage.css`, `CommunityEntry.jsx`, `index.js`, `index.jsx`
- **Fixed Imports**: Added missing React imports (`useState`, `useEffect`)
- **Removed Mock Data**: Eliminated `MOCK_MESSAGES` and `MOCK_NOTIFICATIONS`
- **Real API Integration**: Connected to backend endpoints for messages and notifications
- **Error Handling**: Added comprehensive array validation to prevent runtime errors

### ✅ CSS Architecture Improvements
- **Scoped Styles**: Each module's CSS scoped to container classes:
  - `.community-container` for Community module
  - `.dashboard-container` for Dashboard module
  - `.mail-container` for Mail module
  - `.archive-container` for Archive module
  - `.auth-container` for Auth pages
- **No Global Conflicts**: Removed global CSS resets, applied box-sizing per module
- **Dedicated Auth CSS**: Created `Auth.css` with extracted authentication styles

## Current Project State

### Completed Features
- ✅ **Unified Application Structure**: Single React SPA with all modules integrated
- ✅ **Global Header Component**: Unified navigation across all modules
- ✅ **Authentication System**: Login, register, and email verification flows
- ✅ **Mail Module (Frontend)**: Complete UI with advanced threading and branching logic
- ✅ **Community Module (Frontend)**: Real-time chat interface with API integration
- ✅ **Archive Module (Frontend)**: Semester/subject/material browsing interface
- ✅ **Dashboard Module (Frontend)**: User dashboard with consolidated routing
- ✅ **Error Handling**: Defensive programming for API responses

### In Progress
- ⚠️ **Backend API Services**: Need full implementation (see `APIs.md`)
- ⚠️ **User Authentication Backend**: Login/register endpoints need completion
- ⚠️ **Real-time Features**: WebSocket/polling for Community chat updates

### Not Started
- ❌ **Attachment Handling**: Upload/download for Mail and Archive
- ❌ **System Notifications**: Cross-module notification center
- ❌ **User Profile Management**: Edit profile, change password, etc.

## Critical Architectural Decisions

### Application Structure
```
main/
├── src/
│   ├── components/          # Shared components
│   │   └── Header/          # Global navigation header
│   ├── pages/               # Module pages
│   │   ├── Auth/            # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Verify.jsx
│   │   │   └── Auth.css
│   │   ├── Dashboard/       # Dashboard module
│   │   │   ├── Dashboard.jsx
│   │   │   ├── index.css
│   │   │   └── components/
│   │   ├── Mail/            # Mail module
│   │   │   ├── Mail.jsx
│   │   │   └── Mail.css
│   │   ├── Community/       # Community module
│   │   │   ├── Community.jsx
│   │   │   ├── style.css
│   │   │   └── assets/
│   │   └── Archive/         # Archive module
│   │       ├── App.jsx
│   │       └── style.css
│   ├── apiConfig.js         # Centralized API configuration
│   ├── App.jsx              # Main router with auth routes
│   └── App.css              # Global styles
├── probably.md              # This file - project handover doc
├── APIs.md                  # API documentation
└── package.json

backend/                     # PHP backend (separate from main/)
├── api/
│   ├── messages.php
│   ├── notifications.php
│   ├── login.php
│   ├── register.php
│   └── verify.php
└── ...
```

### User Authentication Flow
1. User visits `/login` → `Login.jsx` component
2. On successful login → `handleLogin()` in `App.jsx` saves user to `localStorage`
3. User state lifted to `App.jsx` and passed to modules that need it
4. Dashboard checks `localStorage` for user, redirects to `/login` if not found
5. Community receives `currentUser` prop from `App.jsx`

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

#### Community Component (`/main/src/pages/Community/Community.jsx`)
**Key Features**:
- Real-time message fetching with polling (3-second intervals)
- Comment system with expandable/collapsible threads
- Notification system for new comments
- Archive/save functionality for messages
- Chunked file upload for large media files

**Error Handling**:
- Array validation in `fetchMessages` and `fetchNotifications`
- Defensive checks before using array methods (`.map()`, `.some()`, `.filter()`)
- Graceful fallback to empty arrays on API errors

#### App Component (`/main/src/App.jsx`)
**Responsibilities**:
- User state management with `useState` and `localStorage`
- Top-level routing for all modules
- `handleLogin` function for authentication
- Passing `currentUser` to modules that need it

### CSS Architecture
- **Modular CSS**: Each page has its own CSS file scoped to a container class
- **No Global Resets**: Removed global `* { margin: 0; padding: 0; }` to prevent conflicts
- **Box-Sizing Per Module**: Applied to container and children only
- **Minimal Global Styles**: Only essential app-level styles in `App.css`

## Database Schema

### Key Tables
- `mail_messages`: Stores all messages with `parent_id` for threading
- `mail_recipients`: Many-to-many relationship for To/CC/BCC
- `mail_message_labels`: Many-to-many for inbox/sent/starred/trash/spam
- `mail_attachments`: File metadata for message attachments
- `community_messages`: Chat messages with media support
- `community_comments`: Comments on messages
- `notifications`: User notifications for comments and mentions

**Important**: The `parent_id` field is central to threading. A `parent_id` of `0` indicates a root message.

## API Specifications

See `APIs.md` for complete endpoint documentation. Key points:

### Authentication Endpoints
- `POST /login.php`: User login, returns user data
- `POST /register.php`: User registration, sends verification email
- `POST /verify.php`: Email verification with code
- `POST /resend_code.php`: Resend verification code

### Mail Service
- `GET /mail/messages?label=inbox`: Must implement leaf-node filtering logic
- `GET /mail/messages/:id/thread`: Must return ancestor path (not full tree)
- `POST /mail/messages`: Accepts comma-separated `to`, `cc`, `bcc` strings

### Community Service
- `GET /messages?user_id=X`: Fetch messages for user
- `POST /messages`: Create new message
- `POST /comments`: Add comment to message
- `GET /notifications?user_id=X`: Fetch user notifications
- `POST /upload/chunk`: Chunked file upload for large media

### Current API Configuration
- **API Base URL**: Configured in `main/src/apiConfig.js`
- **Default**: `http://localhost:8000` (can be changed for production)
- **CORS**: Backend must allow requests from frontend origin

## Development Workflow

### Running the Application
```bash
# Frontend (from main/ directory)
npm install
npm run dev        # Development server
npm run build      # Production build

# Backend (PHP)
# Ensure PHP backend is running on port 8000
# Or update API_BASE_URL in src/apiConfig.js
```

### Important Files
1. **`probably.md`** (this file): Project handover and architecture
2. **`APIs.md`**: Backend API contracts and specifications
3. **`main.sql`**: Database schema with relationships
4. **`src/apiConfig.js`**: API base URL configuration
5. **`src/App.jsx`**: Main application router and user state

## Next Steps (Priority Order)

### 1. Backend API Completion
- [ ] Complete authentication endpoints (login, register, verify)
- [ ] Implement Mail service with threading logic
- [ ] Implement Community service endpoints
- [ ] Implement Archive service (currently using hardcoded data)
- [ ] Add proper error responses and validation

### 2. Frontend-Backend Integration Testing
- [ ] Test authentication flow end-to-end
- [ ] Test Community real-time updates
- [ ] Test Mail threading with real data
- [ ] Verify Archive data loading
- [ ] Test error handling for failed API calls

### 3. Advanced Features
- [ ] File upload/download for Mail attachments
- [ ] WebSocket implementation for real-time Community updates
- [ ] System-wide notification center
- [ ] User profile management
- [ ] Search functionality across modules

### 4. Testing & Deployment
- [ ] Test branching logic with complex thread scenarios
- [ ] Test edge cases (deep threads, many branches, large files)
- [ ] Performance optimization (pagination, lazy loading)
- [ ] Production deployment configuration
- [ ] Environment variable management

## Known Issues & Considerations

### Frontend
- **Pagination**: Not implemented; will be needed for production with large datasets
- **Mobile**: Basic responsive design exists but needs refinement
- **Loading States**: Some components need better loading indicators
- **Error Messages**: User-facing error messages could be more descriptive

### Backend (To Be Completed)
- **Leaf Node Query**: Requires efficient SQL to identify messages that are NOT parent_id of any other message
- **Ancestor Path Query**: Recursive CTE or iterative query to traverse parent_id chain
- **Performance**: Index `parent_id`, `user_id`, and label junction tables
- **File Storage**: Implement proper file storage and cleanup for uploads

### Security
- **Input Validation**: Sanitize all user inputs (especially email addresses)
- **SQL Injection**: Use prepared statements for all queries
- **File Uploads**: Validate file types and sizes for attachments
- **XSS Protection**: Escape HTML in message content
- **Authentication**: Implement proper session management and token expiration
- **CORS**: Configure properly for production

## Debugging Tips

### Common Issues
1. **"user is not defined"**: Check that `App.jsx` has user state and passes it to components
2. **"items.map is not a function"**: API response is not an array - check backend response format
3. **"notifications.some is not a function"**: Same as above - ensure backend returns arrays
4. **CSS conflicts**: Check that each module's CSS is scoped to its container class
5. **API errors**: Check `apiConfig.js` for correct `API_BASE_URL` and ensure backend is running

### Testing Locally
- Frontend runs on `http://localhost:5173` (Vite default)
- Backend should run on `http://localhost:8000` (or update `apiConfig.js`)
- Check browser console for API errors
- Use React DevTools to inspect component state

## Contact & Questions

If you have questions about architectural decisions, refer to:
1. This document (`probably.md`) for overall architecture
2. `APIs.md` for backend contracts
3. `Mail.jsx` for Mail threading implementation
4. `Community.jsx` for chat and real-time features
5. `App.jsx` for routing and authentication flow
6. The conversation history with the previous developer

Good luck! 🚀
