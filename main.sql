-- Create the database
CREATE DATABASE IF NOT EXISTS supnum_platform;
USE supnum_platform;

-- ==========================================
-- 1. SHARED TABLES
-- ==========================================

-- Users Table (Merged from Mail and Community)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE, -- From Community
    email VARCHAR(255) NOT NULL UNIQUE, -- From Mail & Community
    password VARCHAR(255) NOT NULL, -- From Mail (hash_password) & Community
    first_name VARCHAR(100), -- From Mail (name)
    last_name VARCHAR(100), -- From Mail (surname)
    role VARCHAR(50) DEFAULT 'user' -- From Both
);

-- ==========================================
-- 2. MAIL COMPONENT TABLES
-- ==========================================

-- Messages Table (Renamed to mail_messages)
CREATE TABLE mail_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255), -- object
    body TEXT,
    created_at DATETIME, -- Merged date and time
    parent_id INT DEFAULT 0, -- parent
    sender_id INT, -- sid
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Recipients Table (Renamed to mail_recipients from received)
CREATE TABLE mail_recipients (
    user_id INT, -- rid
    message_id INT, -- mid
    status VARCHAR(50), -- 'to', 'cc', 'bcc'
    PRIMARY KEY (user_id, message_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

-- Labels Table (Renamed to mail_labels)
CREATE TABLE mail_labels (
    user_id INT, -- uid
    message_id INT, -- mid
    is_starred BOOLEAN DEFAULT FALSE, -- stared
    is_spam BOOLEAN DEFAULT FALSE, -- spam
    is_trash BOOLEAN DEFAULT FALSE, -- trash
    is_archived BOOLEAN DEFAULT FALSE, -- archived
    is_read BOOLEAN DEFAULT FALSE, -- Is_read
    PRIMARY KEY (user_id, message_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

-- Attachments Table (Renamed to mail_attachments)
CREATE TABLE mail_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Fid
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size BIGINT, -- file_size_byte
    file_path TEXT, -- link
    message_id INT, -- mid
    FOREIGN KEY (message_id) REFERENCES mail_messages(id) ON DELETE CASCADE
);

-- ==========================================
-- 3. COMMUNITY COMPONENT TABLES
-- ==========================================

-- Messages Table (Renamed to community_messages)
CREATE TABLE community_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    type VARCHAR(20) DEFAULT 'text',
    media_url VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_saved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments Table (Renamed to community_comments)
CREATE TABLE community_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES community_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Archived Messages Table (Renamed to community_archived_messages)
CREATE TABLE community_archived_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_message (user_id, message_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES community_messages(id) ON DELETE CASCADE
);

-- Notifications Table (Renamed to community_notifications)
CREATE TABLE community_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    actor_id INT NOT NULL,
    message_id INT NOT NULL,
    type VARCHAR(50) DEFAULT 'comment',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES community_messages(id) ON DELETE CASCADE
);

-- ==========================================
-- 4. ARCHIVE COMPONENT TABLES
-- ==========================================

CREATE TABLE archive_semesters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE archive_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    semester_id INT,
    FOREIGN KEY (semester_id) REFERENCES archive_semesters(id) ON DELETE CASCADE
);

CREATE TABLE archive_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'cours', 'td', 'tp', 'devoir', 'examen', 'rattrapage', 'examen_pratique'
    file_path VARCHAR(255),
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES archive_subjects(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. DATA INSERTION
-- ==========================================

-- Insert Users (Merged Data)
-- Note: Passwords are kept as is from source files.
INSERT INTO users (id, username, email, password, first_name, last_name, role) VALUES
(1, 'root', 'root@supnum.mr', 'be518fabd2724ddb', 'root', 'root', 'Root'),
(2, 'brahim', 'brahim.hmeida@supnum.mr', '67448d7e831jd8c8fa', 'brahim', 'hmeida', 'moderator'),
(3, 'hassan', 'hassan.oumeiry@supnum.mr', '8c8ff72809f74c720a9', 'hassan', 'oumeiry', 'moderator'),
(4, '24070', '24070@supnum.mr', 'c8fa822874cff720a9', 'mohmaed', 'sak', 'user'),
-- Additional users from Community
(5, 'test1765045979648', 'test1765045979648@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', NULL, NULL, 'user'),
(6, '24212', '24212@supnum.mr', 'c35be72abbad462e6eb1f9c068ba40ae3fe0ad233187512a80d78d167c11d1e2', NULL, NULL, 'admin'),
(7, 'test1765047565570', 'test1765047565570@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', NULL, NULL, 'user'),
(8, '24050', '24050@supnum.mr', '028f5ec372fa6833671a654eacf3b2751998e1ee19532ef34e3fcf6d03363735', NULL, NULL, 'user'),
(9, '24227', '24227@supnum.mr', '028f5ec372fa6833671a654eacf3b2751998e1ee19532ef34e3fcf6d03363735', NULL, NULL, 'user'),
(10, '24109', '24109@supnum.mr', 'c35be72abbad462e6eb1f9c068ba40ae3fe0ad233187512a80d78d167c11d1e2', NULL, NULL, 'user'),
(11, 'testuser', 'test@supnum.mr', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', NULL, NULL, 'user');

-- Insert Mail Messages
INSERT INTO mail_messages (id, subject, body, created_at, parent_id, sender_id) VALUES
(1, 'test 1', '....', '2023-02-04 08:15:00', 0, 1),
(2, 'test2', '........', '2024-07-14 09:20:00', 0, 2),
(3, 'test3', '........', '2024-08-15 12:30:00', 1, 1),
(4, 'test4', '.......', '2021-02-28 17:30:00', 3, 4);

-- Insert Mail Recipients
INSERT INTO mail_recipients (user_id, message_id, status) VALUES
(2, 1, 'Cc'),
(3, 1, 'Bc'),
(1, 2, 'Fwd'),
(3, 2, 'to');

-- Insert Mail Labels
INSERT INTO mail_labels (user_id, message_id, is_starred, is_spam, is_trash, is_archived, is_read) VALUES
(2, 1, TRUE, FALSE, FALSE, TRUE, TRUE),
(2, 3, FALSE, FALSE, FALSE, FALSE, FALSE),
(1, 3, FALSE, TRUE, FALSE, FALSE, FALSE),
(4, 2, FALSE, FALSE, TRUE, TRUE, TRUE);

-- Insert Mail Attachments
INSERT INTO mail_attachments (id, file_name, file_type, file_size, file_path, message_id) VALUES
(1, 'raport.txt', '.txt', 952300, 'drive.google.com/uc?...', 1),
(2, 'recov.pdf', '.pdf', 258000, 'drive.google.com/uc?...', 2),
(3, 'note.xsls', '.xlsx', 2576200, 'drive.google.com/uc?...', 1),
(4, 'tp.pdf', '.pdf', 75200, 'drive.google.com/uc?...', 4);

-- Insert Community Messages
INSERT INTO community_messages (id, user_id, content, type, media_url, created_at, is_saved) VALUES
(117, 2, '', 'video', '/uploads/1766916694-Chat_Group_App_-_Google_Chrome_2025-12-27_14-22-05.mp4', '2025-12-28 11:11:35', FALSE),
(118, 2, 'jeshfkj\r\n', 'text', NULL, '2025-12-28 11:11:43', FALSE),
(123, 2, 'Test message from Antigravity', 'text', NULL, '2025-12-31 18:36:59', FALSE),
(120, 6, 'hjg\r\n', 'text', NULL, '2025-12-28 15:37:56', FALSE),
(127, 2, '', 'image', '/uploads/1767207896-t__l__chargement.jpg', '2025-12-31 20:04:56', FALSE),
(126, 2, 'hfghfjuvm', 'text', NULL, '2025-12-31 20:04:45', FALSE);

-- Insert Community Comments
INSERT INTO community_comments (id, message_id, user_id, content, created_at) VALUES
(57, 118, 2, 'fghgf', '2025-12-28 11:11:47'),
(58, 118, 2, 'edrg', '2025-12-28 11:11:49'),
(59, 117, 6, 'khh', '2025-12-28 14:27:12'),
(60, 117, 6, 'kjh', '2025-12-28 14:27:28'),
(61, 118, 6, 'lijluijk', '2025-12-28 14:27:32'),
(64, 118, 2, 'ilugyjk', '2025-12-28 16:39:15'),
(65, 118, 2, 'lkj', '2025-12-28 16:39:16'),
(66, 117, 2, 'hghjkn', '2025-12-28 16:39:33'),
(67, 117, 2, 'ihkn', '2025-12-28 16:39:34'),
(68, 118, 6, 'jhn', '2025-12-28 16:40:15'),
(69, 120, 2, 'knh', '2025-12-28 16:40:31'),
(70, 120, 2, 'ijghjnm', '2025-12-28 16:40:32'),
(74, 117, 2, 'jkl,', '2025-12-28 20:51:23');

-- Insert Community Archived Messages
INSERT INTO community_archived_messages (id, user_id, message_id, created_at) VALUES
(44, 6, 118, '2025-12-28 15:38:44'),
(56, 6, 117, '2025-12-28 23:31:29'),
(59, 6, 120, '2025-12-28 23:31:46');

-- Insert Community Notifications
INSERT INTO community_notifications (id, user_id, actor_id, message_id, type, is_read, created_at) VALUES
(1, 2, 6, 117, 'comment', TRUE, '2025-12-28 14:27:12'),
(2, 2, 6, 117, 'comment', TRUE, '2025-12-28 14:27:28'),
(3, 2, 6, 118, 'comment', TRUE, '2025-12-28 14:27:32'),
(6, 2, 6, 118, 'comment', TRUE, '2025-12-28 16:40:15'),
(7, 6, 2, 120, 'comment', FALSE, '2025-12-28 16:40:31'),
(8, 6, 2, 120, 'comment', FALSE, '2025-12-28 16:40:32');

-- Insert Archive Semesters (Sample)
INSERT INTO archive_semesters (id, name) VALUES
(1, 'Semestre 1 - L1'),
(2, 'Semestre 2 - L1'),
(3, 'Semestre 3 - L2'),
(4, 'Semestre 4 - L2'),
(5, 'Semestre 5 - L3'),
(6, 'Semestre 6 - L3');

-- Insert Archive Subjects (Sample)
INSERT INTO archive_subjects (id, name, semester_id) VALUES
(1, 'Anglais Ⅰ', 1),
(2, 'Communication Ⅰ', 1),
(3, 'PPP', 1),
(4, 'Analyse', 1),
(5, 'Algebre Ⅰ', 1),
(6, 'PIX Ⅰ', 1),
(7, 'Algorithmique et Programmation', 1),
(8, 'Téchnologie Web', 1),
(9, 'Bases de données', 1),
(10, 'Bases Informatique', 1),
(11, 'Concepts de base de réseaux', 1);

-- Insert Archive Materials (Sample)
INSERT INTO archive_materials (id, name, type, file_path, subject_id) VALUES
(1, 'Student book', 'cours', './s1/anglais/Elem 4th SB.pdf', 1),
(2, 'Workbook', 'td', './s1/anglais/Workbook.pdf', 1),
(3, 'Suites réelles et séries numériques', 'cours', './s1/Analyse/cours/Suites réelles et séries numériques.pdf', 4),
(4, 'Fonctions réelles', 'cours', './s1/Analyse/cours/Fonctions réelles.pdf', 4),
(30, 'Introduction aux Réseaux', 'cours', './s1/bases réseaux/cours/Introduction aux Réseaux_SupNum_v2.pdf', 11);
