# Skribbled – Collaborative Document Editor

Skribbled is a modern, real-time collaborative document editor built with React, Firebase, and Yjs. It allows users to create, edit, and share documents with others, featuring live collaboration, user presence, and a rich text editing experience.

## Features

- Real-time collaborative editing with [TipTap](https://tiptap.dev/) and [Yjs](https://yjs.dev/)
- User authentication (sign up, sign in, password reset) via Firebase
- Share documents with collaborators by email
- Sidebar for document navigation and management
- Rich text formatting (headings, lists, code, math, etc.)
- User presence indicators
- Responsive, modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- Firebase project (for authentication and Firestore)
- Yjs WebSocket server (for real-time collaboration)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/skribble.git
   cd skribble
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

6. **Start the backend API server if required for document sharing and user management.**

## Project Structure

- `src/` – Main source code
  - `components/` – UI and editor components
  - `contexts/` – React context providers (e.g., Auth)
  - `lib/` – Firebase initialization
  - `pages/` – Application pages (Dashboard, Editor, Login, etc.)
  - `services/` – API and Firestore service functions
  - `types/` – TypeScript types

## Scripts

- `npm run dev` – Start the Vite development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint the codebase

## License

MIT

---

Write better,