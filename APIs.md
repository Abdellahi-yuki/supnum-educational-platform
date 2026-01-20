# API Documentation

This document outlines the API endpoints required for the unified messaging system.

## Base URL
`http://localhost:8000/api`

> [!NOTE]
> Since the backend is **Pure PHP**, we will use a single entry point (`api/index.php`) to handle routing. This allows us to keep the clean URL structure defined below (e.g., `/auth/login` instead of `/auth/login.php`).

## 1. Authentication (`/auth`)
- `POST /auth/login`: Login user.
    - Body: `{ email, password }`
    - Response: `{ token, user: { id, username, email, role } }`
- `POST /auth/register`: Register new user.
    - Body: `{ email, password, first_name, last_name, username }`
- `GET /auth/me`: Get current user profile.

## 2. Mail Service (`/mail`)
- `GET /mail/messages`: Get list of messages for current user.
    - Query Params: 
        - `label`: (inbox, sent, trash, spam, starred, archived)
        - `search`: (optional search term)
        - `page`: (pagination, default 1)
        - `limit`: (items per page, default 20)
    - Response: `[{ id, subject, content, date, from, isRead, isStarred, labels, hasAttachments }]`
    - **Logic Note**: 
        - For `label=inbox`, the backend returns only **Leaf Nodes** (latest message in a branch).
        - For `label=sent`, the backend filters by `sender_id = :user_id`.

- `GET /mail/messages/:id`: Get details of a specific message.
    - Response: `{ id, subject, content, date, from: {name, email}, to: [{name, email}], cc: [], attachments: [{id, name, url}], parent_id }`

- `GET /mail/messages/:id/thread`: Get ancestor path for a message (Branch Isolation).
    - Response: `[{ id, subject, content, date, from, parent_id }]` (Ordered by date, from root to selected message)

- `POST /mail/messages`: Send a new email.
    - Content-Type: `multipart/form-data`
    - Body: 
        - `to`: (comma separated emails)
        - `cc`: (comma separated emails)
        - `bcc`: (comma separated emails)
        - `subject`: (string)
        - `body`: (text)
        - `attachments[]`: (files)
        - `parent_id`: (optional, ID of the message being replied to. Required for threading)
    - **Validation**: The backend validates all recipients (To, Cc, Bcc) against the `users` table. If any email is not found, it returns `400 Bad Request` with `{ "error": "{email} does not exist" }`.

- `PATCH /mail/messages/batch`: Batch update messages (labels, read status).
    - Body: 
        - `ids`: `[1, 2, 3]`
        - `action`: `'add_label' | 'remove_label' | 'mark_read' | 'mark_unread'`
        - `label`: `'starred' | 'trash' | 'spam' | 'archive'` (required for label actions)

- `DELETE /mail/messages/batch`: Permanently delete messages.
    - Body: `{ ids: [1, 2, 3] }`

## 3. User Service (`/users`)
- `GET /users/search`: Search users for autocomplete.
    - Query: `q` (name or email)
    - Response: `[{ id, name, email, avatar }]`

## 3. Community Service (`/community`)
- `GET /community/messages`: Get chat history.
    - Query: `limit`, `offset`, `search`, `user_id`
    - Response: 
      ```json
      [
        {
          "id": 117,
          "user_id": 2,
          "username": "brahim",
          "email": "brahim.hmeida@supnum.mr",
          "content": "",
          "type": "video",
          "media_url": "/uploads/video.mp4",
          "created_at": "2025-12-28 11:11:35",
          "is_saved": true, // Computed: true if current user has archived this message
          "comments": [
            { "id": 59, "user_id": 6, "username": "24212", "email": "24212@supnum.mr", "content": "khh", "created_at": "2025-12-28 14:27:12" }
          ]
        }
      ]
      ```
- `POST /community/messages`: Send a chat message.
    - Body: `{ content, type, media_url, user_id }`
- `POST /community/comments`: Add a comment to a message.
    - Body: `{ message_id, user_id, content }`
- `POST /community/archives/toggle`: Toggle archive status of a message.
    - Body: `{ user_id, message_id }`
- `POST /community/messages/delete`: Delete a message.
    - Body: `{ message_id, user_id }`
- `POST /community/upload/chunk`: Upload a file in chunks.
    - Body: `FormData` with `chunk`, `upload_id`, `chunk_index`, `total_chunks`, `file_name`
    - Response: `{ "status": "done" | "part", "media_url": "string", "type": "string" }`
    - **Note**: `media_url` is returned relative to the root (e.g., `/uploads/...`). The frontend should prepend the base URL (excluding `/api`) for display.
- `GET /community/notifications`: Get user notifications.
    - Query: `user_id`
    - Response: `[{ id, user_id, actor_id, actor_name, message_id, type, is_read, created_at }]`
- `POST /community/notifications/read`: Mark notification as read.
    - Body: `{ id }`

## 4. Archive Service (`/archive`)
- `GET /archive/semesters`: List all semesters.
- `GET /archive/semesters/:id/subjects`: List subjects for a semester.
- `GET /archive/subjects/:id/materials`: List materials for a subject.
- `POST /archive/materials`: Upload a new material (Admin only).
    - Body: `{ name, type, file, subject_id }`

## 5. Results Service (`/results`)
- `GET /get_results.php`: Get student results.
    - Query Params:
        - `matricule`: Student ID string.
        - `semester`: Semester ID (e.g., '1').
    - Response: 
      ```json
      {
        "status": "success",
        "data": {
          "Matricule": "...",
          "Nom": "...",
          "Prenom": "...",
          "Decision": "...",
          "Moy_General": "...",
          "Credit_total": "...",
          "NCC_CODE": "...",
          "NSN_CODE": "...",
          ...
        },
        "subjects_map": {
          "CODE": { "name": "...", "credits": 5 }
        }
      }
      ```
