# 📝 NoteStack — MERN Notes Management Platform

A full-stack MERN application with user authentication, CRUD notes, and password-locked notes.

---

## 🗂️ Project Structure

```
notestack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js    ← Register, Login, GetMe
│   │   │   └── notesController.js   ← CRUD + Unlock
│   │   ├── models/
│   │   │   ├── User.js              ← User schema (bcrypt password)
│   │   │   └── Note.js              ← Note schema (lock password)
│   │   ├── routes/
│   │   │   ├── authRoutes.js        ← /api/v1/auth/*
│   │   │   └── noteRoutes.js        ← /api/v1/notes/*
│   │   ├── middleware/
│   │   │   ├── auth.js              ← JWT verify middleware
│   │   │   └── errorHandler.js      ← Global error handler
│   │   └── app.js                   ← Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.js    ← Auth guard
    │   │   ├── NoteCard.js          ← Individual note card
    │   │   ├── NoteCard.css
    │   │   ├── NoteModal.js         ← Create/Edit modal
    │   │   ├── NoteModal.css
    │   │   ├── UnlockModal.js       ← Password unlock modal
    │   │   ├── UnlockModal.css
    │   │   ├── ViewNoteModal.js     ← Full note view
    │   │   └── ViewNoteModal.css
    │   ├── pages/
    │   │   ├── AuthPage.js          ← Login + Register
    │   │   ├── AuthPage.css
    │   │   ├── HomePage.js          ← Main dashboard
    │   │   └── HomePage.css
    │   ├── services/
    │   │   └── api.js               ← Axios instance + API calls
    │   ├── context/
    │   │   └── AuthContext.js       ← Auth state (React Context)
    │   ├── App.js                   ← Routes
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server
npm run dev

# Start production server
npm start
```

**`.env` contents:**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/notestack
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

App opens at **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Description          | Auth Required |
|--------|-------------|----------------------|---------------|
| POST   | /register   | Create account       | No            |
| POST   | /login      | Login, get JWT token | No            |
| GET    | /me         | Get current user     | Yes           |

### Notes — `/api/v1/notes`

| Method | Endpoint        | Description            | Auth Required |
|--------|-----------------|------------------------|---------------|
| GET    | /               | Get all user notes     | Yes           |
| POST   | /               | Create new note        | Yes           |
| GET    | /:id            | Get single note        | Yes           |
| PUT    | /:id            | Update note            | Yes           |
| DELETE | /:id            | Delete note            | Yes           |
| POST   | /:id/unlock     | Unlock password-locked | Yes           |

---

## 🔒 Password Lock Feature

When creating or editing a note, toggle **"Enable Password Lock"**:
- Sets a separate lock password (hashed with bcrypt)
- Locked notes show `🔒` icon in the grid
- Description is hidden until password is entered
- Click 🔓 on any locked note to enter password and view content
- Locked notes can be edited after password verification

---

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, React Router 6, Axios |
| Backend  | Node.js, Express.js     |
| Database | MongoDB + Mongoose      |
| Auth     | JWT (jsonwebtoken)      |
| Security | bcryptjs (password hashing) |
| Styling  | Custom CSS, Google Fonts |

---

## 🏗️ Architecture Principles

1. **DB First** — Schema drives backend logic
2. **Backend owns business rules** — Frontend never enforces rules
3. **REST-only communication** — All via `/api/v1/`
4. **Frontend never touches database** — Always through Express
5. **JWT Authentication** — All note routes protected

---

*Project: NoteStack | Document Owner: Afiya Begum*
