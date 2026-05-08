# Team Task Manager (MERN Stack)

A full-stack team collaboration app built with the MERN stack for managing projects and tasks with secure JWT authentication and role-based permissions.

## Features

- JWT-based authentication (signup, login, protected routes)
- Role-based access control (`admin` / `member`)
- Project management and assignment workflow
- Task management with create/read/update flows
- Task status tracking (`Todo`, `In Progress`, `Done`)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB Atlas

## Installation

1. Clone the repository:
   - `git clone <your-repository-url>`
   - `cd team-task-manager`
2. Install backend dependencies:
   - `cd backend`
   - `npm install`
3. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`
4. Configure backend environment variables:
   - create `backend/.env`
   - add values from the **Environment Variables** section below
5. Run backend server:
   - `cd ../backend`
   - `npm run dev`
6. Run frontend app (new terminal):
   - `cd frontend`
   - `npm run dev`

## Environment Variables

Create `backend/.env` and set:

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

Recommended defaults:

- `PORT=5000`
- `MONGO_URI=<mongodb-atlas-connection-string>`
- `JWT_SECRET=<strong-random-secret>`

## Run Commands

- Backend: `npm run dev` (inside `backend`)
- Frontend: `npm run dev` (inside `frontend`)

## Project Structure

```text
team-task-manager/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ app.js
│  │  └─ server.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ routes/
│  │  ├─ services/
│  │  └─ main.jsx
│  └─ package.json
└─ README.md
```

## Usage

- Admin:
  - Can create projects
  - Can create and assign tasks
  - Can update task status
  - Can view all workspace activity
- Member:
  - Can view assigned/access-allowed tasks
  - Can update status of own assigned tasks
  - Can work within role-restricted routes and actions

## Notes

- Ensure backend and frontend are both running during local development.
- API base URL is configured in frontend Vite environment (`VITE_API_URL`) or defaults to `http://localhost:5000/api`.
