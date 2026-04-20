# Mini CRM

Full-stack MERN mini CRM built for the interview assignment.

## Stack

- Frontend: React, React Router, Axios, TanStack Query, MUI
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT access token, bcrypt password hashing

## Features

- Login with JWT-based authentication
- Dashboard cards powered by aggregation APIs
- Leads module with create, update, list, search, status filter, pagination, and soft delete
- Companies module with create, list, detail view, and associated leads
- Tasks module with create, assignment to users, and restricted status updates

## Project Structure

```text
backend/
frontend/
```

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Seeded Login

- `john@example.com` / `password123`
- `priya@example.com` / `password123`

## Authorization Logic

- Login verifies the user with bcrypt and returns a signed JWT access token.
- The frontend stores the token in local storage and sends it in the `Authorization: Bearer <token>` header for protected API requests.
- Backend middleware validates the JWT, loads the current user, and blocks protected routes when the token is missing or invalid.
- All CRM routes except `/api/auth/login` and `/api/health` are protected.
- Task status updates are additionally restricted: only the user assigned to a task can change that task's status.
- Leads use soft delete through `deletedAt`; normal lead queries always filter out deleted records.

## Important API Areas

- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET/POST /api/leads`
- `GET/PUT/DELETE /api/leads/:id`
- `PATCH /api/leads/:id/status`
- `GET/POST /api/companies`
- `GET /api/companies/:id`
- `GET/POST /api/tasks`
- `PATCH /api/tasks/:id/status`

## Deployment

- Frontend can be deployed to Netlify.
- Backend can be deployed to Render, Railway, or any Node hosting platform.
- Set `VITE_API_URL` in the frontend deployment to the deployed backend API URL.
- Set `CLIENT_URL` in the backend deployment to the deployed frontend URL.
- Use MongoDB Atlas for the production database.
