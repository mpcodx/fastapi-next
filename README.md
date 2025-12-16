# FastAPI + Next.js Starter

This repository contains a small FastAPI backend and a Next.js frontend (in `frontend/`) demonstrating raw token auth and simple user CRUD.

Quick start (backend)

1. Activate your Python venv (project includes `env/` for convenience):

```bash
source env/bin/activate
```

2. Install Python deps if needed:

```bash
pip install -r requirements.txt
```

3. Start the backend (development):

```bash
./env/bin/uvicorn main:app --reload
```

The API will run on http://localhost:8000

Quick start (frontend)

1. Change to the frontend folder and install JS deps:

```bash
cd frontend
npm install
```

2. Start the Next.js dev server:

```bash
npm run dev
```

The frontend will run on http://localhost:3000

Notes

- CORS is configured in `main.py` to allow development access from `http://localhost:3000` and `http://127.0.0.1:3000`. For other origins set the `FRONTEND_ORIGINS` environment variable (comma-separated).
- The backend stores data in `app.db` (SQLite). If you change the models, consider using Alembic for migrations instead of deleting the DB.
- Authentication uses a simple raw token stored on the user record (for demo only). For production, use secure HTTP-only cookies or a proper JWT/session mechanism.
- The frontend uses Tailwind CSS. From `frontend/` run `npm install` to pick up Tailwind devDependencies.

Files of interest

- `main.py` — FastAPI app and endpoints
- `auth.py` — password hashing and token generation
- `crud.py`, `models.py`, `schemas.py` — DB layer and Pydantic models
- `frontend/` — Next.js frontend (pages, styles)

If you want, I can:
- Add Alembic migration scaffolding and a migration to add the `token` column (we applied an ALTER earlier).
- Switch the frontend to Bootstrap instead of Tailwind.
- Add tests and CI configuration.
