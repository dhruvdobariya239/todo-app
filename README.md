# TaskFlow — Modern Full-Stack To-Do App

A production-grade To-Do List application built with **Vite + React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend. Features a sleek dark UI (Catppuccin-inspired), full CRUD, task categories, priorities, due dates, and live statistics.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Task CRUD** | Create, view, edit, delete tasks |
| **Complete / Reopen** | Mark done; reopen if needed (can't re-complete) |
| **Categories** | Personal, Work, Shopping, Health, Finance, Other |
| **Priorities** | Low / Medium / High with color coding |
| **Due Dates** | Overdue + "due today" highlighting |
| **Search & Filter** | Live search, filter by status / category / priority |
| **Statistics Bar** | Total, Pending, Done, Completion % with progress bar |
| **Validation** | Both client-side and server-side (express-validator) |
| **Error Handling** | Meaningful toasts + graceful API errors |
| **Persistence** | MongoDB via Mongoose |

---

## 🏗️ Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── middleware/
│   │   │   └── errorHandler.js # Global error + 404 handler
│   │   ├── models/
│   │   │   └── Task.js         # Mongoose schema
│   │   ├── routes/
│   │   │   └── tasks.js        # All task REST endpoints
│   │   └── index.js            # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.ts      # Axios API service layer
│   │   ├── components/
│   │   │   ├── FilterBar.tsx   # Search + filter controls
│   │   │   ├── StatsBar.tsx    # Statistics cards
│   │   │   ├── TaskCard.tsx    # Individual task row
│   │   │   └── TaskModal.tsx   # Create / Edit modal
│   │   ├── hooks/
│   │   │   └── useTasks.ts     # All task state & actions
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   ├── App.tsx             # Root component
│   │   ├── App.css             # All styles (dark theme)
│   │   └── main.tsx            # Vite entry point
│   ├── index.html
│   ├── vite.config.ts          # Proxy /api → backend
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas URI

### 1 — Clone & Install

```bash
git clone <repo-url>
cd todo-app

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2 — Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env:
#   PORT=5000
#   MONGODB_URI=mongodb://localhost:27017/todoapp
```

### 3 — Run Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🔌 REST API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Get all tasks (supports `?category=`, `?priority=`, `?completed=`) |
| `GET` | `/tasks/:id` | Get single task |
| `POST` | `/tasks` | Create task |
| `PUT` | `/tasks/:id` | Update task fields |
| `PATCH` | `/tasks/:id/complete` | Mark as complete (errors if already done) |
| `PATCH` | `/tasks/:id/reopen` | Reopen a completed task |
| `DELETE` | `/tasks/:id` | Delete task |
| `GET` | `/tasks/stats/summary` | Get statistics |

### Create Task — Request Body
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "category": "shopping",
  "priority": "medium",
  "dueDate": "2025-12-31"
}
```

### Response Envelope
```json
{
  "success": true,
  "data": { ... }
}
```

---

## 🧠 Key Design Decisions

### Backend
- **ES Modules** (`type: "module"`) for modern syntax throughout
- **express-validator** for declarative, co-located route validation
- **Mongoose pre-save hooks** auto-populate `completedAt` when `completed` flips
- **Single error handler** middleware catches all thrown errors and Mongoose errors uniformly
- Dedicated `/complete` and `/reopen` PATCH routes enforce the "can't re-complete" rule at the API level

### Frontend
- **`useTasks` custom hook** owns all state and async operations — components stay pure and presentable
- **Optimistic UI updates** — state is patched locally immediately after a successful API call, no re-fetch needed
- **Axios interceptor** normalises all error messages to a single string so toasts always have something useful to show
- **Vite proxy** forwards `/api` to the backend in dev, eliminating CORS issues entirely
- **react-hot-toast** for non-blocking feedback (loading → success/error transitions)

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Plain CSS with CSS custom properties (no Tailwind needed) |
| HTTP client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose 8 |
| Validation | express-validator (server), inline (client) |
| Dev tooling | Nodemon, ESLint |
