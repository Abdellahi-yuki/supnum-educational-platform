# Supnum Educational Platform

This project is an educational platform built with React and Vite.

## Page Structure

The application consists of the following main pages:

- **Dashboard** (`/dashboard`): The main landing dashboard.
  - Component: `src/pages/Dashboard/Dashboard.jsx`
- **Mail** (`/mail`): A page for messaging or mail-related features.
  - Component: `src/pages/Mail/Mail.jsx`
- **Community** (`/community`): A community interaction page.
  - Component: `src/pages/Community/Community.jsx`
- **Archive** (`/archive`): An archive page.
  - Component: `src/pages/Archive/Archive.jsx`
- **Results** (`/results`): A results/grades page.
  - Component: `src/pages/Results/Results.jsx`

## Getting Started

Follow these instructions to set up and run the development environment.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository (if you haven't already).
2. Navigate to the project directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Runs the app in the development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run lint`**: Runs ESLint to check for code quality issues.
- **`npm run preview`**: Locally preview the production build.

### Running the Backend

The application requires a PHP backend to function. The backend is maintained in a separate directory: `supnum-educational-platform-backend`.

To run the backend:

1. Open a terminal in the `supnum-educational-platform-backend` directory.
2. Run the following command:

```bash
php -S localhost:8000 index.php
```

> **Note:** The backend must be running on port 8000 for the frontend to connect successfully.

### Running the Full Stack

To run the full application, you need two terminal windows:

1.  **Terminal 1 (Backend):**
    ```bash
    cd ../supnum-educational-platform-backend
    php -S localhost:8000 index.php
    ```

2.  **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```


### Testing on Mobile

To test on a phone, build the project and serve the `dist` folder:

```bash
npm run build
cd dist
python3 -m http.server
```

Then access it via your computer's local IP address on your phone.

## Developer Documentation

For more detailed information, please refer to the following documents:

- **[INSTRUCTIONS.md](INSTRUCTIONS.md)**: General developer guidelines and rules.
- **[APIs.md](APIs.md)**: Backend API documentation.
- **[CSS_REGISTRY.md](CSS_REGISTRY.md)**: Registry of used CSS classes to prevent conflicts.
- **[probably.md](probably.md)**: Detailed project handover and architecture.
