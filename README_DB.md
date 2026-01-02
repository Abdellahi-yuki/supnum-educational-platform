# Database Documentation

This document explains the structure of the unified `supnum_platform` database, which consolidates data from the Mail, Community (Chat), and Archive components.

## Overview

The database `supnum_platform` is designed to support a unified platform where users can access mail, chat, and academic archives with a single identity.

## Schema Details

### 1. Shared Tables

#### `users`
Centralized user repository for all components.
- **id**: Unique identifier (Auto Increment).
- **username**: Unique username (primarily for Community).
- **email**: Unique email address (login credential).
- **password**: Hashed password.
- **first_name**: User's first name.
- **last_name**: User's last name.
- **role**: User role (e.g., 'user', 'admin', 'moderator', 'Root').

### 2. Mail Component

Prefix: `mail_`

#### `mail_messages`
Stores email content and metadata.
- **sender_id**: Links to `users.id`.
- **parent_id**: For threading replies (0 if new thread).

#### `mail_recipients`
Junction table for message recipients.
- **status**: Delivery type ('to', 'cc', 'bcc', 'Fwd').

#### `mail_labels`
Per-user message state.
- **is_starred**, **is_spam**, **is_trash**, **is_archived**, **is_read**: Boolean flags.

#### `mail_attachments`
Files attached to emails.
- **file_path**: Link to the file storage.

### 3. Community (Chat) Component

Prefix: `community_`

#### `community_messages`
Instant messages in chat groups.
- **type**: Message type ('text', 'image', 'video').
- **media_url**: Path to media files.

#### `community_comments`
Replies or comments on specific messages.

#### `community_archived_messages`
Messages saved/archived by users.

#### `community_notifications`
User notifications for activities (e.g., new comments).

### 4. Archive Component

Prefix: `archive_`

#### `archive_semesters`
Academic semesters (e.g., "Semestre 1 - L1").

#### `archive_subjects`
Subjects taught within a semester (e.g., "Analyse", "Java").

#### `archive_materials`
Educational resources.
- **type**: Resource category ('cours', 'td', 'tp', 'examen', etc.).
- **file_path**: Relative path to the document.

## Relationships & Constraints

### Foreign Keys
- **Mail**:
    - `mail_messages.sender_id` -> `users.id`
    - `mail_recipients.user_id` -> `users.id`
    - `mail_recipients.message_id` -> `mail_messages.id`
    - `mail_labels.user_id` -> `users.id`
    - `mail_labels.message_id` -> `mail_messages.id`
    - `mail_attachments.message_id` -> `mail_messages.id`
- **Community**:
    - `community_messages.user_id` -> `users.id`
    - `community_comments.message_id` -> `community_messages.id`
    - `community_comments.user_id` -> `users.id`
    - `community_notifications.user_id` -> `users.id` (Receiver)
    - `community_notifications.actor_id` -> `users.id` (Triggered by)
- **Archive**:
    - `archive_subjects.semester_id` -> `archive_semesters.id`
    - `archive_materials.subject_id` -> `archive_subjects.id`

### Cascading Deletes
- Most relationships use `ON DELETE CASCADE` to ensure data integrity. For example, deleting a user will remove their received messages, comments, and notifications.
- `mail_messages.sender_id` uses `ON DELETE SET NULL` to preserve message history even if the sender is deleted.

## Valid Values (Enums)

- **User Roles**: `'user'`, `'admin'`, `'moderator'`, `'Root'`
- **Mail Recipient Status**: `'to'`, `'cc'`, `'bcc'`, `'Fwd'`
- **Community Message Type**: `'text'`, `'image'`, `'video'`
- **Archive Material Type**: `'cours'`, `'td'`, `'tp'`, `'devoir'`, `'examen'`, `'rattrapage'`, `'examen_pratique'`

## Setup Instructions

1.  **Create Database**:
    ```sql
    CREATE DATABASE supnum_platform;
    ```
2.  **Import Schema**:
    ```bash
    mysql -u root -p supnum_platform < main.sql
    ```
3.  **Verify**:
    Check that all 14 tables are created successfully.

## Notes
- **Data Merging**: User accounts from legacy systems have been merged.
- **Renaming**: Tables from original SQL files were renamed to avoid conflicts (e.g., `messages` -> `mail_messages` vs `community_messages`).
