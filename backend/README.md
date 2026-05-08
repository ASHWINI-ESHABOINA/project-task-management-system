## Team Task Manager — Backend (Express + MongoDB)

Production-ready REST API for managing users, projects, and tasks with JWT authentication and role-based authorization.

### Project overview

This backend provides:
- **Authentication**: signup/login with **JWT** and **bcrypt** password hashing
- **Authorization**: role-based access control (**admin/member**) + per-resource rules
- **Project management**: create projects (admin), manage members, fetch accessible projects
- **Task management**: create tasks (admin), assign tasks, update status (assignee), fetch by project/user

### Tech stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT** (`jsonwebtoken`)
- **Password hashing** (`bcryptjs`)
- **dotenv** for environment variables
- **CORS** (`cors`)
- **Dev**: `nodemon`

---

## Installation

From the `backend/` directory:

```bash
npm install
```

### Environment variables

Create a `.env` file (you can start from `.env.example`):

| Variable | Required | Example | Notes |
|---|---:|---|---|
| `NODE_ENV` | no | `development` | `production` hides stack traces |
| `PORT` | no | `5000` | API port |
| `MONGO_URI` | yes | `mongodb://127.0.0.1:27017/team_task_manager` | MongoDB connection string |
| `CORS_ORIGINS` | no | `http://localhost:5173,http://localhost:3000` | Comma-separated allowlist. Empty = allow all origins |
| `JWT_SECRET` | yes | `change_me_to_a_long_random_string` | Use a long random secret in production |
| `JWT_EXPIRES_IN` | no | `7d` | Token lifetime |

---

## How to run locally

1) Start MongoDB (local or Atlas) and set `MONGO_URI` in `.env`  
2) Start the API:

```bash
# development (nodemon)
npm run dev

# production
npm start
```

Server starts on: `http://localhost:<PORT>`

---

## Authentication flow (JWT)

1) **Signup** (creates a user; password is hashed before saving)
2) **Login** returns a **JWT**
3) For protected routes, send:
   - `Authorization: Bearer <token>`
4) The auth middleware verifies the token and attaches the user to `req.user`

Notes:
- Password is **excluded** from API responses.
- Admin-only routes require `req.user.role === "admin"`.

---

## API endpoints

### Base / Health
- `GET /` → `{ "message": "API running" }`
- `GET /api/health`

### Auth (`/api/auth`)
- `POST /api/auth/signup`  
  - body: `{ name, email, password, role? }`
- `POST /api/auth/login`  
  - body: `{ email, password }` → returns `{ token, user }`
- `GET /api/auth/me` *(protected)*  
  - header: `Authorization: Bearer <token>`

### Projects (`/api/projects`) *(protected)*
- `POST /api/projects` *(admin only)*  
  - body: `{ title, description?, members? }`
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/members` *(admin or project creator)*  
  - body: `{ members: [userId, ...] }`

### Tasks (`/api/tasks`) *(protected)*
- `POST /api/tasks` *(admin only)*  
  - body: `{ title, description?, assignedTo, projectId, status?, dueDate? }`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id/status` *(assignee or admin)*  
  - body: `{ status: "Todo" | "In Progress" | "Done" }`
- `GET /api/tasks/project/:projectId`
- `GET /api/tasks/assigned/:userId` *(admin or same user)*

---

## Sample requests / responses

### 1) Login (get JWT)

Request:

```bash
curl -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"Password123\"}"
```

Response (example):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "665f0c6b2a1f0b1b2c3d4e5f",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2026-05-07T14:50:00.000Z",
    "updatedAt": "2026-05-07T14:50:00.000Z"
  }
}
```

### 2) Create Project (admin-only)

Request:

```bash
curl -X POST "http://localhost:5000/api/projects" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <token>" ^
  -d "{\"title\":\"Website Redesign\",\"description\":\"Q2 initiatives\"}"
```

Response (example):

```json
{
  "project": {
    "_id": "665f0d7b2a1f0b1b2c3d4e60",
    "title": "Website Redesign",
    "description": "Q2 initiatives",
    "createdBy": {
      "_id": "665f0c6b2a1f0b1b2c3d4e5f",
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "members": [],
    "createdAt": "2026-05-07T14:52:00.000Z",
    "updatedAt": "2026-05-07T14:52:00.000Z"
  }
}
```

---

## Project structure (MVC)

```text
backend/
  src/
    app.js
    server.js
    config/
      db.js
      jwt.js
    controllers/
      authController.js
      healthController.js
      projectController.js
      taskController.js
    middleware/
      asyncHandler.js
      auth.js
      errorHandler.js
      isAdmin.js
      notFound.js
    models/
      Project.js
      Task.js
      User.js
    routes/
      authRoutes.js
      healthRoutes.js
      index.js
      projectRoutes.js
      taskRoutes.js
  .env.example
  nodemon.json
  package.json
```


