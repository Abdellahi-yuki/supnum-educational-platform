# Supnum Educational Platform

A unified messaging and collaboration platform for educational institutions, built with **React** (Vite) and **Pure PHP**.

## 🚀 Overview

The Supnum Educational Platform is a consolidated Single Page Application (SPA) designed to streamline communication and academic resource management.

### Key Modules:
- **Dashboard**: Central hub for schedules and profile overview.
- **Webmail**: Sophisticated branching conversation system with thread isolation.
- **Community**: Real-time chat with 3-second polling and chunked media uploads.
- **Archive**: Hierarchical repository for semesters, subjects, and academic materials.
- **Results**: Academic performance tracking via matricule lookup.
- **Admin Command Center**: Complete suite for managing subjects and executing Upserts on student grades.
- **Bulk Importer**: High-performance Excel/CSV grade importer with auto-column mapping.

---

## 👥 Role Hierarchy

The platform implements a strict role-based access control system:

| Role | Description | Permissions |
| :--- | :--- | :--- |
| **Student** | Primary user | Access Learning, Results, Mail, and Community. |
| **Teacher** | Academic Staff | All Student permissions + Upload materials to Archive. |
| **Root** | Super Admin | All Staff permissions + User Banning, Mailing Lists, and Reports. |

---

## 🛠️ Technical Highlights

- **Webmail Branching**: Implements a leaf-node strategy for a clean inbox and direct path traversal for isolated thread views.
- **Chunked Uploads**: Robust handling of large media files (1MB chunks) in the Community module.
- **Unified Routing**: Single-entry routing in `src/App.jsx` with centralized API configuration in `src/apiConfig.js`.
- **Blockchain Dashboard**: Live, transparent display of recent donations validated using the Hedera Hashgraph (HCS).

---

## 📖 Developer Documentation

For deep technical insights, refer to the following:

- **[probably.md](probably.md)**: Detailed project handover, architecture, and core logic explanations.
- **[APIs.md](APIs.md)**: Full specification of the Pure PHP backend endpoints.
- **[INSTRUCTIONS.md](INSTRUCTIONS.md)**: Coding standards and development guidelines.

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18+
- **PHP**: 7.4+ (for local backend development)

### Running Locally

1. **Backend**:
   ```bash
   cd supnum-educational-platform-backend-master
   php -S localhost:8000 index.php
   ```

2. **Frontend**:
   ```bash
   cd supnum-educational-platform-master
   npm install
   npm run dev
   ```

> [!IMPORTANT]
> The backend must be running on port **8000** by default for the frontend to connect.
