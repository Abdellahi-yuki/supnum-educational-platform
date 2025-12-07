# Supnum Educational Platform

This project is an educational platform built with React and Vite.

## Page Structure

The application consists of the following main pages:

- **Home Page** (`/`): The landing page of the application.
  - Component: `src/assets/pages/Home/Home.jsx`
- **Mail Page** (`/mail`): A page for messaging or mail-related features.
  - Component: `src/assets/pages/Mail/Mail.jsx`
- **Login Page** (`/login`): The user authentication page.
  - Component: `src/assets/pages/Login/Login.jsx`

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

### Running the Development Server

To start the local development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the application for production, run:

```bash
npm run build
```

### You can test it on phone by building the project then Navigating in the dist file and run python code:

```
npm run build
cd dist
python3 -m http.server
```
