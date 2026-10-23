# Hostel Survival Manager

Hostel Survival Manager is a full-stack app for student budgeting, expense tracking, and hostel checklists.

## Stack

- Frontend: HTML, CSS, and browser JavaScript
- Backend: Node.js and Express
- Database: MySQL

## Run locally

1. Create a MySQL database named `hostel_survival` (or choose a different name in the environment file).
2. Copy `backend/.env.example` to `backend/.env` and set the local database credentials.
3. Install backend and frontend dependencies:
   ```sh
   npm --prefix backend install
   npm --prefix frontend install
   ```
4. Start the backend in one terminal:
   ```sh
   npm --prefix backend start
   ```
5. Start the frontend dev server in another terminal:
   ```sh
   npm --prefix frontend run dev
   ```
6. Open <http://localhost:5173>.

The Vite development server serves `frontend/` on port 5173 and proxies `/api` requests to the Express backend on port 5000. On startup, the backend creates its app tables with the `hsm_` prefix. This keeps the existing legacy tables intact. Signup and login use salted password hashes and an authenticated API token; each user's budget, expenses, and checklist are stored separately in MySQL.

## Project layout

- `frontend/` contains the static pages, styles, and browser scripts.
- `backend/` contains the Express API, database pool, and environment configuration.

The backend health endpoint is `GET /api/health`.
