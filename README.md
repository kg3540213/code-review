# AI Code Review – MERN Stack

Full-stack web app for AI-powered code reviews using **React (Vite)**, **Express**, **MongoDB**, **JWT + Google OAuth**, and **Google Gemini API**.

## Features

- **Auth**: Signup, Login (JWT), Google OAuth, secure logout, protected routes
- **Dashboard**: User name, total code reviews count, “New review” and Logout
- **Code review**: Paste code, select language, submit → Gemini analyzes and returns structured feedback (summary, quality, bugs, performance, security, refactored code)
- **Backend**: Auth + user + review APIs; JWT middleware; Gemini integration; reviews stored in MongoDB; user `reviewsCount` incremented per review

## Tech Stack

| Layer      | Tech                    |
|-----------|--------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Axios, @react-oauth/google |
| Backend   | Node.js, Express, Mongoose |
| Database  | MongoDB                  |
| Auth      | JWT (cookie + Bearer), bcrypt, Google OAuth |
| AI        | Google Gemini API (@google/generative-ai) |

## Project structure

```
aiCodeReview/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Auth, user, review
│   ├── middleware/     # auth (JWT), errorHandler
│   ├── models/         # User, Review
│   ├── routes/         # auth, users, reviews
│   ├── services/       # geminiService
│   ├── utils/          # generateToken
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/        # axios, auth, users, reviews
│   │   ├── components/ # ProtectedRoute
│   │   ├── context/    # AuthContext
│   │   ├── pages/      # Home, Login, Signup, Dashboard, CodeReview
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docs/
│   └── API_SAMPLES.md  # Sample API requests
└── README.md
```

## Setup

### 1. Environment variables

**Backend** – copy `backend/.env.example` to `backend/.env` and set:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-code-review
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
CLIENT_URL=http://localhost:5173
```

**Frontend** – copy `frontend/.env.example` to `frontend/.env` and set:

```env
VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

(Optional) `VITE_API_URL` – leave empty when using Vite proxy to `http://localhost:5000` in dev.

### 2. MongoDB

Have MongoDB running locally (or use Atlas and set `MONGODB_URI` in `backend/.env`).

### 3. Google OAuth (optional, for Google Sign-In)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create **OAuth 2.0 Client ID** (Web application).
3. Add authorized JavaScript origins: `http://localhost:5173` (and your production URL).
4. Add authorized redirect URIs if required.
5. Put **Client ID** in backend `GOOGLE_CLIENT_ID` and frontend `VITE_GOOGLE_CLIENT_ID`; put **Client secret** in backend `GOOGLE_CLIENT_SECRET`.

### 4. Gemini API

1. [Google AI Studio](https://aistudio.google.com/) or [Google Cloud](https://cloud.google.com/) → get an API key.
2. Set `GEMINI_API_KEY` in `backend/.env`.

### 5. Install and run

**Backend**

```bash
cd backend
npm install
npm run dev
```

Runs at `http://localhost:5000`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. Vite proxy forwards `/api` to the backend.

## Usage

1. Open `http://localhost:5173`.
2. Sign up or log in (email/password or Google).
3. On the dashboard you see your name and total reviews; click **New review**.
4. Paste code, choose language, click **Analyze code**.
5. AI response is shown in sections (summary, quality, bugs, performance, security, refactored code).

## API overview

- `POST /api/auth/signup` – register (name, email, password)
- `POST /api/auth/login` – login (email, password)
- `POST /api/auth/google` – Google OAuth (credential)
- `POST /api/auth/logout` – logout (clears cookie)
- `GET /api/users/profile` – current user (protected)
- `POST /api/reviews` – create code review (protected): `{ code, language }`
- `GET /api/reviews` – list current user’s reviews (protected)

See `docs/API_SAMPLES.md` for sample requests (curl / JSON).

## Security notes

- Passwords hashed with bcrypt (salt 12).
- JWT in HTTP-only cookie and optional Bearer header; do not log or expose tokens.
- CORS limited to `CLIENT_URL`; credentials allowed for cookie auth.
- Validate/sanitize input; rate-limit in production.

## License

MIT.
