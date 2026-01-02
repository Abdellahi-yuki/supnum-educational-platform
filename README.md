# Supnum Educational Platform

This project is an educational platform built with React and Vite.

## Page Structure

The application consists of the following main pages:

- **Dashboard** (`/`): The main landing dashboard.
  - Component: `src/components/Dashboard`
- **Mail** (`/mail`): A page for messaging or mail-related features.
  - Component: `src/pages/Mail/Mail`
- **Community** (`/community`): A community interaction page.
  - Component: `src/pages/Community/Community`
- **Archive** (`/archive`): An archive page.
  - Component: `src/pages/Archive/Archive`

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
- **[README_DB.md](README_DB.md)**: Database schema documentation.
