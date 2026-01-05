# Project Documentation

## Website Structure

The application is a React Single Page Application (SPA) located in `main/src`. It merges three distinct functionalities into a unified interface.

### Directory Layout
- `src/`
  - `App.jsx`: Main entry point with routing configuration.
  - `pages/`
    - `archive/`: Archive component (migrated from standalone app).
    - `community/`: Community component (migrated from standalone app).
    - `dashboard/`: Dashboard component (migrated from standalone app).
  - `components/`: Shared components (if any).

### Pages & Components

1.  **Dashboard** (`/dashboard`)
    -   **Entry**: `DashboardPage.jsx`
    -   **Key Components**:
        -   `Login.jsx`: User authentication.
        -   `Register.jsx`: User registration.
        -   `Verify.jsx`: Email verification.
        -   `Settings.jsx`: User profile management.
        -   `Results.jsx`, `Archive.jsx`, `Mail.jsx`, `Community.jsx`: Dashboard sub-features.

2.  **Community** (`/community`)
    -   **Entry**: `CommunityPage.jsx`
    -   **Key Components**:
        -   `DashwordMessages.jsx`: Main messaging interface, handles posts, comments, and file uploads.
        -   `LoginPage.jsx`: Separate login for community (uses `facechat_user` in localStorage).

3.  **Archive** (`/archive`)
    -   **Entry**: `ArchivePage.jsx`
    -   **Key Components**:
        -   `FileViewer.jsx`: Displays document content.
        -   Uses `utils/dataManager.js` for data persistence via `localStorage`.

## Database Configuration

**Type**: MySQL
**Port**: 3306
**Database Name**: `main`
**Credentials**:
-   User: `root`
-   Password: `root`
-   Host: `localhost`

**Configuration File**: `backend/api/db.php`

## API Endpoints

The application communicates with a backend server.
**Base URL**: `http://localhost:8000` (Development, local PHP server)
**Backend Location**: `backend/api` (Workspace)
**Note**: The system Apache server at `/srv/http/backend` is read-only. We run `php -S localhost:8000 -t backend/api` to serve the API from the workspace.

### Dashboard Endpoints
Used for authentication and user management.
-   `POST /login.php`: Authenticate user.
-   `POST /register.php`: Register new user.
-   `POST /verify.php`: Verify email with code.
-   `POST /resend_code.php`: Resend verification code.
-   `POST /update_profile.php`: Update user profile (supports file upload).

### Community Endpoints
Used for social features and messaging.
-   `GET /api/messages`: Fetch messages. Params: `user_id`, `search`, `only_archived`.
-   `POST /api/messages`: Send a new message (supports file attachments).
-   `POST /api/messages/delete`: Delete a message.
-   `POST /api/comments`: Add a comment to a message.
-   `GET /api/notifications`: Fetch user notifications.
-   `POST /api/notifications/read`: Mark notification as read.
-   `POST /api/archives/toggle`: Archive/unarchive a message.
-   `POST /api/upload/chunk`: Upload file chunks.
-   `POST /api/auth/login`: Login for community.

### Archive Data Source
-   **No External API**: The Archive component uses a local data source (`data/database.js`) and persists changes to `localStorage` via `utils/dataManager.js`.
