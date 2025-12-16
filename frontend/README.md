# Frontend (Next.js)

This is a minimal Next.js frontend that talks to the FastAPI backend in the parent folder.

Setup

1. From this folder, install dependencies:

```bash
cd frontend
npm install
```

2. Run the dev server:

```bash
npm run dev
```

The Next.js dev server runs at http://localhost:3000 by default and the FastAPI backend runs at http://localhost:8000.

Notes

- CORS is enabled in the backend for `http://localhost:3000` (development only).
- The frontend includes simple pages for Signup and Login which call `/signup` and `/login` on the backend.
- For production deploy, configure proper environment variables and CORS origins.

Tailwind

- This frontend uses Tailwind CSS. After editing the repo you should run `npm install` inside `frontend` to install Tailwind and PostCSS devDependencies.
- Tailwind config: `tailwind.config.js`, PostCSS: `postcss.config.js`.
