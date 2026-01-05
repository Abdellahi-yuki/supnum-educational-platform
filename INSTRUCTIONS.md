# Developer Instructions & Guidelines

Welcome to the unified SupNum Platform project! This document serves as a guide for future agents and developers to maintain consistency and quality across the codebase.

## 0. CRITICAL RULES FOR AGENTS (READ FIRST)

1.  **Identify the Page**: If the user does not explicitly state which page they are working on, **ASK THEM FIRST**. Do not assume.
2.  **Language Preference**: Always answer the user in their preferred language (or the language they used to prompt you).
3.  **Strict Separation**:
    - **Frontend** and **Backend** must be in separate folders. NEVER mix them.
    - Even if the user asks, explain that it is forbidden to mix frontend and backend files.
4.  **Scope Isolation**:
    - Stick strictly to the files of the page you are working on.
    - **DO NOT** edit global files like `main/main.sql` unless absolutely necessary and authorized.
    - Only update the section of `main/APIs.md` that corresponds to your specific page.
5.  **Required Reading**: Before starting, read:
    - `main/README_DB.md`
    - `main/CSS_REGISTRY.md`
    - `main/APIs.md`
    - `main/probably.md`

## 1. Project Structure

All frontend pages MUST be located in `src/pages/`. Each page should have its own dedicated directory containing its components, styles, and assets.

**Correct Structure:**
```
src/
├── components/         # Shared/Global components (e.g., Dashboard)
├── pages/              # Feature Pages (Modules)
│   ├── Mail/           # Mail Page
│   │   ├── Mail.jsx    # Main Component
│   │   ├── Mail.css    # Page-specific Styles
│   │   └── assets/     # Page-specific Assets
│   ├── Community/      # Community Page
│   └── Archive/        # Archive Page
├── App.jsx             # Main Routing
└── main.jsx            # Entry Point
```
Ignore the src/assets/pages and src/assets/components and do never use them cuz they will be deleted
## 2. CSS & Styling Guidelines

Since this is a Single Page Application (SPA), all CSS is loaded globally. This creates a high risk of style conflicts between pages.

### **CRITICAL: CSS Registry**
- **ALWAYS** check `CSS_REGISTRY.md` before creating new classes.
- **ALWAYS** register new classes in `CSS_REGISTRY.md`.
- **USE PREFIXES** for page-specific styles to avoid collisions.
    - Mail: `.mail-*` (e.g., `.mail-sidebar`, `.mail-message-item`)
    - Community: (Existing classes are documented in registry)
    - Archive: `.archive-*`

### **Best Practices**
- Avoid generic class names like `.container`, `.sidebar`, `.header`, `.card` unless they are truly global and shared.
- Prefer scoped CSS modules if possible, or strict BEM-like naming conventions if using standard CSS.
- Do NOT use CSS nesting (SCSS-like syntax) in standard `.css` files, as it may break in some environments. Keep CSS standard and flat.

## 3. Development Workflow

1.  **New Features**: Create a new folder in `src/pages/` for any new major feature.
2.  **Assets**: Store page-specific assets (images, icons) within the page's folder (e.g., `src/pages/Mail/assets/`).
3.  **Routing**: Add new routes in `src/App.jsx`.
4.  **Backend**: The backend is pure PHP located in `../api/` (or similar, check `APIs.md`). Ensure frontend API calls match the documented endpoints.

## 4. Important Files

- `CSS_REGISTRY.md`: Tracks used CSS classes to prevent conflicts.
- `APIs.md`: Documents the backend API endpoints.
- `README_DB.md`: Documents the database schema.
- `task.md`: Tracks current progress and todo list.

---
*Keep the codebase clean, modular, and well-documented!*
